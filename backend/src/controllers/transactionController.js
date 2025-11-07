const Transaction = require("../models/Transaction");
const Category = require("../models/Category");

// @desc    Criar uma nova transação
// @route   POST /api/transactions
// @access  Private
exports.createTransaction = async (req, res, next) => {
  try {
    const { description, value, type, date, category } = req.body;

    // 1. Validação de campos
    if (!description || !value || !type || !date || !category) {
      return res
        .status(400)
        .json({ success: false, message: "Todos os campos são obrigatórios." });
    }

    // 2. Validação de seguraça: A categoria informada pertence ao usuário?
    const categoryExists = await Category.findOne({
      _id: category,
      user: req.user._id,
    });

    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: "Categoria não encontrada ou não pertence a este usuário.",
      });
    }

    // 3. Cria a transação
    const transaction = await Transaction.create({
      description,
      value,
      type,
      date,
      category,
      user: req.user._id, // Associado ao usuário logado
    });

    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Obter todas as transações (com filtros)
// @route   GET /api/transactions
// @access  Private
exports.getTransactions = async (req, res, next) => {
  try {
    const { type, category, startDate, endDate } = req.query;

    // Base: apenas transações do usuário logado
    const query = { user: req.user._id };

    // Filtros opcionais
    if (type) query.type = type;
    if (category) query.category = category;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Busca apenas as transações do usuário logado
    const transactions = await Transaction.find(query)
      .populate("category", "name") // Substitui o ID da categoria pelo nome
      .sort({ date: -1 }); // Ordena pela data (mais nova primeiro)

    res
      .status(200)
      .json({ success: true, count: transactions.length, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Atualizar uma transação
// @route   PUT /api/transactions/:id
// @access  Private
exports.updateTransaction = async (req, res, next) => {
  try {
    // 1. Busca a transação (garantindo que pertence ao usuário)
    let transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transação não encontrada ou não autorizada.",
      });
    }

    // 2. Validação de categoria (se enviada)
    if (req.body.category) {
      const categoryExists = await Category.findOne({
        _id: req.body.category,
        user: req.user._id,
      });

      if (!categoryExists) {
        return res.status(404).json({
          success: false,
          message: "Nova categoria não encontrada.",
        });
      }
    }

    // 3. Define apenas os campos permitidos para update
    const fieldsToUpdate = {};
    const allowedFields = ["description", "value", "type", "date", "category"];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        fieldsToUpdate[field] = req.body[field];
      }
    });

    // 4. Atualiza a transação
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      fieldsToUpdate,
      {
        new: true, // Retorna o documento modificado
        runValidators: true, // Roda as validações do Schema( ex: 'type' só pode ser 'income'/'expense')
      }
    ).populate("category", "name");
    
    res.status(200).json({ success: true, data: updatedTransaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// @desc  Deletar uma transação
// @route DELETE /api/transactions/:id
// @access Private
exports.deleteTransaction = async (req, res, next) => {
  // 1. Busca a transação (garantindo que pertence ao usuário)
  try{
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id
    })

    if(!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transação não encontrada "
      })
    }
    // 2. Deleta
    await transaction.deleteOne()

    res.status(200).json({success: true, data: {}})
  } catch (error) {
    res.status(500).json({
      success: false, message: error.message
    })
  }
}