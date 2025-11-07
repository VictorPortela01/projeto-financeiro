import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTransactionReq } from "../services/transactionService";

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  const {
    mutate: deleteTransaction,
    isLoading: isDeleting,
    isError: isErrorDeleting,
    error: errorDeleting,
  } = useMutation({
    mutationFn: deleteTransactionReq,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });

      console.log("Transação deletada! Atualizando dados...");
    },
    onError: (error) => {
      console.log("Falha ao deletar transação", error.message);
    },
  });

  return [
    deleteTransaction,
    isDeleting,
    isErrorDeleting,
    errorDeleting
  ]
};
