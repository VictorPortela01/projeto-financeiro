import { FaArrowUp, FaArrowDown, FaEdit, FaTrash } from "react-icons/fa";
import { formatCurrency } from "../utils/formatters";
import { formatDate } from "../utils/formatters";

const TransactionItem = ({ transaction, onEdit, onDelete }) => {
  const { description, value, type, category, date } = transaction;

  const isIncome = type === "income";
  const Icon = isIncome ? FaArrowUp : FaArrowDown;
  const color = isIncome
    ? "text-green-600 dark:text-green-500"
    : "text-red-600 dark:text-red-500";

  return (
    <li className="flex items-center justify-between gap-2 py-4"> {/* Adicionado gap-2 */}
      
      {/* Esquerda: Ícone e Descrição */}
      <div className="flex min-w-0 items-center gap-4"> {/* Adicionado min-w-0 */}
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
            isIncome ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
          }`}
        >
          <Icon className={`h-5 w-5 ${color}`} />
        </span>
        <div className="min-w-0 flex-1"> {/* Adicionado min-w-0 e flex-1 */}
          <p className="truncate font-medium text-gray-900 dark:text-gray-100">
            {description}
          </p>
          <p className="truncate text-sm text-gray-500 dark:text-gray-400">
            {category?.name || 'Sem Categoria'} | {formatDate(date)}
          </p>
        </div>
      </div>

      {/* Direita: Valor e Botões */}
      <div className="flex shrink-0 items-center gap-4">
        {/* Valor (COM A CORREÇÃO) */}
        <div className={`text-lg font-bold ${color}`}>
          {isIncome ? '+' : '-'}
          {formatCurrency(Math.abs(value))} {/* <-- CORREÇÃO DO MATH.ABS */}
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(transaction)}
            className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
            title="Editar"
          >
            <FaEdit className="cursor-pointer"/>
          </button>
          <button
            onClick={() => onDelete(transaction._id)}
            className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
            title="Excluir"
          >
            <FaTrash className="cursor-pointer"/>
          </button>
        </div>
      </div>
    </li>
  );
};

export default TransactionItem;