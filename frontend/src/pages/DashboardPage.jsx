import { useState } from "react";
import { useSummary } from "../hooks/useSummary";
import { FaPlus } from "react-icons/fa";
import BalanceCard from "../components/ui/BalanceCard";
import SummaryCard from "../components/ui/SummaryCard";
import Modal from "../components/ui/Modal";
import TransactionForm from "../components/TransactionForm";

import CategoryChart from "../components/charts/CategoryChart";

import RecentTransactionList from "../components/RecentTransactionList";

// Componente de Loading
const DashboardLoading = () => {
  return (
    <div className="container mx-auto animate-pulse p-4 sm:p-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-36 rounded-lg bg-gray-200 dark:bg-gray-700"
          ></div>
        ))}
      </div>
    </div>
  );
};

const DashboardPage = () => {
  // 1. Usando nosso Hook customizado!
  const { summary, isLoadingSummary, isErrorSummary, errorSummary } =
    useSummary();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- 1. NOVO ESTADO PARA GERENCIAR A EDIÇÃO ---
  const [editingTransaction, setEditingTransaction] = useState(null);

  // --- 2. NOVAS FUNÇÕES PARA ABRIR/FECHAR O MODAL ---
  const openCreateModal = () => {
    setEditingTransaction(null); // Garante que é o modo "Criar"
    setIsModalOpen(true);
  };

  const openEditModal = (transaction) => {
    setEditingTransaction(transaction); // Define qual transação estamos editando
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null); // Limpa o estado de edição ao fechar
  };

  // 2. Estado de Carregamento (do React Query)
  if (isLoadingSummary || !summary) return <DashboardLoading />;

  // 3. Estado de Erro
  if (isErrorSummary) {
    return (
      <div className="container mx-auto p-4 sm:px-6 lg:px-8">
        <div className="rounded-md bg-red-100 p-4 text-red-700 dark:bg-red-900 dark:text-red-200">
          <p>
            <strong>Erro ao carregar o resumo:</strong>{" "}
            {errorSummary?.message || "Erro desconhecido."}
          </p>
        </div>
      </div>
    );
  }

  // 4. Estado de Sucesso (Exibindo os dados)
  return (
    <>
      <div className="container mx-auto p-4 sm:px-6 lg:px-8">
        {/* Cabeçalho com o Botão */}
        <div className="m-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Meu Resumo
          </h1>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white shadow-lg transition-colors duration-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-offset-gray-900 cursor-pointer"
          >
            <FaPlus />
            Nova Transação
          </button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="container mx-auto p-4 sm:p-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <BalanceCard balance={summary.balance} />
          <SummaryCard
            title="Receitas"
            value={summary.totalIncome}
            type="income"
          />
          <SummaryCard
            title="Despesas"
            value={summary.totalExpense}
            type="expense"
          />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="lg:col-span-1">
            <CategoryChart data={summary.expensesByCategory} />
          </div>

          <div className="lg:col-span-1">
            <RecentTransactionList onEdit={openEditModal} />
          </div>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={
            editingTransaction ? "Editar Transação" : "Adicionar Nova Transação"
          }
        >
          <TransactionForm onSuccess={closeModal} 
          transactionToEdit={editingTransaction}/>
        </Modal>
      </div>
    </>
  );
};

export default DashboardPage;
