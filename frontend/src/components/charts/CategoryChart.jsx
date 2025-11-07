import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJs, ArcElement, Tooltip, Legend } from "chart.js";

// 1. REGISTR DOS MÓDULOS
ChartJs.register(ArcElement, Tooltip, Legend);

// 2. Cores
const CHART_COLORS = [
  "#3b82f6", // blue-500
  "#ef4444", // red-500
  "#22c55e", // green-500
  "#eab308", // yellow-500
  "#f97316", // orange-500
  "#a855f7", // purple-500
  "#ec4899", // pink-500
  "#6b7280", // gray-500
];

/** Componnete de Gráfico
 * @param {Array }chartData = ({ data: expenseByCategory })
 */
const CategoryChart = ({ data: expensesByCategory }) => {
  if (!expensesByCategory || expensesByCategory.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg bg-white p-4 shadow-md dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400">
          Nenhuma despesa registrada ainda.
        </p>
      </div>
    );
  }

  // 4. TRANSFORMAÇÃO DOS DADOS
  const labels = expensesByCategory.map((item) => item.name);
  const dataValues = expensesByCategory.map((item) => item.total);

  // 5. Estrutura de dados para o Chart.js
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Gastos por Categoria",
        data: dataValues,
        backgroundColor: CHART_COLORS,
        borderColor: "ffffff",
        borderWidth: 2,
      },
    ],
  };

  // 6. Opções de configurações do gráfico
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: document.documentElement.classList.contains("dark")
            ? "#fff"
            : "#333",
        },
      },
      title: {
        display: true,
        text: "Distribuição de Despesas",
        color: document.documentElement.classList.contains("dark")
          ? "#fff"
          : "#333",
        font: {
          size: 18,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed !== null) {
              label += new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(context.parsed);
            }
            return label;
          },
        },
      },
    },
  };

  return (
    <div className="h-96 rounded-lg bg-white p-4 shadow-md dark:bg-gray-800">
        <Doughnut data={data} options={options} className="cursor-pointer"/> 
    </div>
  )
};
export default CategoryChart;