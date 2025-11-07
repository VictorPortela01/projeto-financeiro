import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTransactionReq } from "../services/transactionService";

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  const {
    mutate: createTransaction,
    isLoading: isCreating,
    isError: isErrorCreating,
    error: errorCreating,
  } = useMutation({
    // 1. A função que ele vai chamar
    mutationFn: createTransactionReq,

    // 2. O que fazer em caso de SUCESSO
    onSuccess: () => {
      // 3. A MÁGINA: Inválida as queries que precisam ser atualizadas

      // Invalida o reusmo de dashboard (para atualizar os cards)
      queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] });

      // Invalida a lista de transações (vamos criar essa query depois)
      queryClient.invalidateQueries({ queryKey: ["transactions"]});

      console.log("Transação criada! Atualizando o dashboard...");
    },

    // Erro
    onError: (error) => {
      console.error("Falha ao criar transação: ", error.message);
    },
  });

  return {
    createTransaction,
    isCreating,
    isErrorCreating,
    errorCreating,
  };
};
