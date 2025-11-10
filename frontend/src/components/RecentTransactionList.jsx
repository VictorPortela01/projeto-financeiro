import { useTransactions } from "../hooks/useTransactions";
import TransactionItem from "./TransactionItem";

import { useDeleteTransaction } from "../hooks/useDeleteTransaction";

const RecentTransactionList = ({ onEdit }) => {
  const { transactions, isLoadingTransactions, isErrorTransactions } =
    useTransactions();

  const { deleteTransaction } = useDeleteTransaction();

  const handleDelete = (transactionId) => {
    if (window.confirm("Tem certeza que deseja excluir esta transação?")) {
      deleteTransaction(transactionId, {
        onError: (err) => {
          alert(`Erro ao deletar: ${err.message}`);
        },
      });
    }
  };

  const renderContent = () => {
    if (isLoadingTransactions) {
      return (
        <p className="pt-4 text-center text-gray-500 dark:text-gray-400">
          Carregando transações...
        </p>
      );
    }

    if (isErrorTransactions) {
      return (
        <p className="py-4 text-center text-gray-500 dark:text-gray-400">
          Erro ao carregar transações.
        </p>
      );
    }

    if (!transactions || transactions.length === 0) {
      return (
        <p className="py-4 text-center text-gray-500 dark:text-gray-400">
          Nenhuma transação registrada ainda.
        </p>
      );
    }

    return (
      <ul className="scroll-container divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto pr-2.5">
        {transactions.map((transaction) => (
          <TransactionItem key={transaction._id} transaction={transaction} 
          onDelete={handleDelete} onEdit={onEdit}/>
        ))}
      </ul>
    );
  };

  return (
    <div className="flex h-full min-h-[400px] flex-col rounded-lg bg-white p-4 shadow-md dark:bg-gray-800">
      <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-gray-100">
        Transações Recentes
      </h3>
      <div>{renderContent()}</div>
    </div>
  );
};

export default RecentTransactionList;
