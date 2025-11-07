const Transaction = require("../models/Transaction");
const mongoose = require("mongoose");

// @desc    Obter o resumo financeiro (saldos e gastos por categoria)
// @route   GET /api/dashboard/summary
// @access  Private

exports.getSummary = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json({ success: false, message: "Usuário não autenticado" });
    }
    const userId = req.user._id;
    const { month, year } = req.query; // Filtros opcionais de data

    // --- 1. Construção do $match (Filtro base) ---
    const matchCriteria = { user: new mongoose.Types.ObjectId(userId) };

    if (month && year) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);
      matchCriteria.date = { $gte: startDate, $lte: endDate };
    }

    // --- 2.Pipeline de Agregação Principal ---
    const summary = await Transaction.aggregate([
      // Etapa 1: Filtrar documentos (apenas do usuário e, opcionalmente, por data)
      { $match: matchCriteria },

      // Etapa 2: Agrupar por tipo (income/expense) e calcular totais
      {
        $group: {
          _id: "$type", //Agrupa por 'income' ou 'expense'
          total: { $sum: "$value" }, //Soma o valor de cada grupo
        },
      },
      // Resultado desta etapa:
      // [{_id: 'income', total: 5000}, {_id: 'expense', total: 3500}]
    ]);

    // --- 3. Calcular Totais (Receita, Despesa, Saldo) ---
    let totalIncome = 0;
    let totalExpense = 0;

    summary.forEach((item) => {
      if (item._id === "income") {
        totalIncome = item.total;
      } else if (item._id === "expense") {
        totalExpense = item.total;
      }
    });

    const balance = totalIncome - totalExpense;

    // --- 4.Pipeline de Agregação para Categorias (SÓ despesas) ---
    // (Conforme solicitado no Ponto 4 no planejamento)
    const categoryMatch = { ...matchCriteria, type: "expense" };
    const expensesByCategory = await Transaction.aggregate([
      // Etapa 1: Filtrar (mesmo filtro, mas APENAS 'expense')
      { $match: categoryMatch },

      // Etapa 2: Agrupar por categoria
      {
        $group: {
          _id: "$category", // Agrupa pelo ID da categoria
          total: { $sum: "$value" }, // Soma os valores para essa categoria
        },
      },

      // Etapa 3: Popular o nome da categoria (opcional, mas muito útil)
      {
        $lookup: {
          from: "categories", // Nome da coleçao de categorias
          localField: "_id",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },

      // Etapa 4: Formatar a saída
      {
        $project: {
          _id: 0,
          total: "$total",
          
          name: {
            $ifNull: [
              { $arrayElemAt: ["$categoryDetails.name", 0] },
              "Sem categoria",
            ],
          },
          
        },
      },
    ]);

    // --- 5. Enviar Resposta ---
    res.status(200).json({
      success: true,
      data: {
        totalIncome,
        totalExpense,
        balance,
        expensesByCategory,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
