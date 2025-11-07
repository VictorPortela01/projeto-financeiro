import { useTransactions } from "../hooks/useTransactions";
import TransactionItem from "./TransactionItem";

const RecentTransactionList = () => {
  const { transactions, isLoadingTransactions, isErrorTransactions } =
    useTransactions();

    const renderContent = () => {
        if(isLoadingTransactions) {
            return (
                <p className="pt-4 text-center text-gray-500 dark:text-gray-400">
                    Carregando transações...
                </p>
            );
        }

        if(isErrorTransactions) {
            return (
                <p className="py-4 text-center text-gray-500 dark:text-gray-400">
                    Erro ao carregar transações.
                </p>
            );
        }

        if(!transactions || transactions.length === 0) {
            return (
                <p className="py-4 text-center text-gray-500 dark:text-gray-400">
                    Nenhuma transação registrada ainda.
                </p>
            );
        }

        return (
            <ul className="scroll-container divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto pr-2.5">
                {transactions.map((transaction) => (
                    <TransactionItem key={transaction._id} transaction={transaction}/>
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
