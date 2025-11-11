import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategoryReq } from "../services/categoryService";

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  const {
    mutate: deleteCategory,
    isLoading: isDeleting,
    isError: isErrorDeleting,
    error: errorDeleting,
  } = useMutation({
    mutationFn: deleteCategoryReq,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      console.log("Categoria deletada! Atualizando lista...");
    },
    onError: (error) => {
      console.log("Falha ao deletar transação", error.message);
      alert(`Erro: ${error.message}`)
    },
  });
  return {
    deleteCategory,
    isDeleting,
    isErrorDeleting,
    errorDeleting,
  };
};
