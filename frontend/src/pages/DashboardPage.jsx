import React from "react";
import { useSummary } from '../hooks/useSummary'

import BalanceCard from '../components/ui/BalanceCard';
import SummaryCard from '../components/ui/SummaryCard';

// Componente de Loading
const DashboardLoading = () => {
  return (
    <div className="container mx-auto animate-pulse p-4 sm:p-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="h-36 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-36 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-36 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
      </div>
    </div>
  )
}


const DashboardPage = () => {
  // 1. Usando nosso Hook customizado!
  const { summary, isLoadingSummary, isErrorSummary, errorSummary } = useSummary();

  // 2. Estado de Carregamento (do React Query)
  if(isLoadingSummary) return <DashboardLoading />;

  // 3. Estado de Erro
  if(isErrorSummary) {
    return (
      <div className="container mx-auto p-4 sm:px-6 lg:px-8">
        <div className="rounded-md bg-red-100 p-4 text-red-700 dark:bg-red-900 dark:text-red-200">
          <p>
            <strong>Erro ao carregar o resumo:</strong> {errorSummary.message}
          </p>
        </div>
      </div>
    )
  }

  if(!summary) {
    return <DashboardLoading />;
  }

  // 4. Estado de Sucesso (Exibindo os dados)
  return (
    <div className="container mx-auto p-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">      
        <BalanceCard balance={summary.balance}/>
        <SummaryCard 
        title="Receitas"
        value={summary.totalIncome}
        type="income"
        />
        <SummaryCard 
        title="Despesas"
        value={summary.totalExpense}
        type='expense'
        />
    </div>

    {/* /**
      1. Gráfico de Despesas (usando 'summary.expensesByCategory')
      2. Formulário de Adicionar Transação (usando o 'useCategories')
      3. Lista de Transações Recentes
     */ }
    </div>
  );
};

export default DashboardPage;
