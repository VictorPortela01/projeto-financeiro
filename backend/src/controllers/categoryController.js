const { mongoose } = require("mongoose");
const Category = require("../models/Category");
const Transaction = require("../models/Transaction"); // Precisamos para a lógica de 'delete'

// @desc Criar uma nova categoria
// @route POST /api/categories
// @access Private (Protegido)
exports.createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "O nome da categoria é obrigatória.",
      });
    }

    // Verifica se o usuário já tem uma categoria com esse nome
    const existingCategory = await Category.findOne({
      name,
      user: req.user._id,
    });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Você já possui uma categoria com este nome",
      });
    }

    // Cria a categoria, associando ao usuário logado (req.user)
    const category = await Category.create({
      name,
      user: req.user._id,
    });
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Obter todas as categorias do usuário logado
// @route   GET /api/categories
// @access  Private
exports.getCategories = async (req, res, next) => {
  try {
    // Busca apenas as categorias que pertecem ao usuário logado
    const categories = await Category.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res
      .status(200)
      .json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Atualizar uma categoria
// @route   PUT /api/categories/:id
// @access  Private
exports.updateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "O nome é obrigatório" });
    }

    // Busca a categoria pelo ID E pelo dono (req.user._id)
    let category = await Category.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Categoria não encontrada ou não autorizada.",
      });
    }

    // Atualiza o nome e salva
    category.name = name;
    await category.save();

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Deletar uma categoria
// @route   DELETE /api/categories/:id
// @access  Private
exports.deleteCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    // 0. Valida se o ID é um Object válido
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "ID de categoria inválido",
      });
    }
    // 1. Encontra a categoria (garatindo que pertence ao usuário)
    const category = await Category.findOne({
      _id: categoryId,
      user: req.user._id,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Categoria não encontrada ou não autorizada. ",
      });
    }

    // 2. REGRA DE NEGÓCIO: Não permitir deletar se houver transações nela
    const hasTransactions = await Transaction.exists({ category: categoryId });
    if (hasTransactions) {
      return res.status(400).json({
        success: false,
        message:
          "Não é possível deletar. Esta categoria esta sendo usada por transações",
      });
    }

    // 3. Deleta a categoria
    await category.deleteOne();
     // 4. Retorna sucesso
    res.status(200).json({
      success: true,
      message: "Categoria deletada com sucesso",
      data: category, // opcional: retorna os dados da categoria deletada
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
