import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateTransactionReq
} from "../services/transactionService";

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  const {
    mutate: updateTransaction,
    isLoading: isUpdating,
    isError: isErrorUpdating,
    error: errorUpdating,
  } = useMutation({
    mutationFn: updateTransactionReq,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      console.log("Transação atualizada! Atualizando dados...");
    },
    onError: (error) => {
        console.log("Falha ao atualizar transação", error.message);
    },
  });

  return {
    updateTransaction,
    isUpdating,
    isErrorUpdating,
    errorUpdating,
  }
};
