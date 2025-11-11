import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCategoryReq } from "../services/categoryService";

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  const {
    mutate: updateCategory,
    isLoading: isUpdating,
    isError: isErrorUpdating,
    error: errorUpdating,
  } = useMutation({
    mutationFn: updateCategoryReq,
    onSuccess: () => {
      // Invalida a lista de categorias para dar refresh
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      console.log("Categoria atualizada! Atualizandop lista...");
    },
    onError: (error) => {
      console.error("Falha ao autalizar categoria", error.message);
    },
  });

  return {
    updateCategory,
    isUpdating,
    isErrorUpdating,
    errorUpdating,
  };
};
