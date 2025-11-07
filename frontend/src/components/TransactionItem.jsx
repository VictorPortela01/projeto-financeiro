import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const formatCurrency = (value) => {
  if (value === undefined || value === null) {
    return "R$ 0,00";
  }
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    timeZone: "UTC", // Importante pois nossas datas não têm fuso
  });
};

const TransactionItem = ({ transaction }) => {
  const { description, value, type, category, date } = transaction;

  const isIncome = type === "income";
  const Icon = isIncome ? FaArrowUp : FaArrowDown;
  const color = isIncome
    ? "text-green-600 dark:text-green-500"
    : "text-red-600 dark:text-red-500";

  return (
    <li className="flex items-center justify-between border-b border-gray-200 py-4 last:border-b-0 dark:border-gray-700">
      <div className="flex items-center gap-4">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
            isIncome
              ? "bg-green-100 dark:bg-green-900"
              : "bg-red-100 dark:bg-red-900"
          }`}
        >
            <Icon className={`h-5 w-5 ${color}`}/>
        </span>
        <div className="flex flex-col">
            <span className="font-medium text-gray-900 dark:text-gray-100">
                {description}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-500">
                {category.name} | {formatDate(date)}
            </span>
        </div>
      </div>

      {/* Valor */}
      <div className={`text-lg font-bold ${color}`}>
        {isIncome ? "+" : "-"}
        {formatCurrency(Math.abs(value))}
      </div>
    </li>
  );
};

export default TransactionItem;