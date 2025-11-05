import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategoryReq } from "../services/categoryService";

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  const {
    mutate: createCategory,
    isLoading: isCreatingCategory,
    isError: isErrorCreating,
    error: errorCategory,
  } = useMutation({
    mutationFn: createCategoryReq,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      console.log("Categoria criada! Atualizando a lista..");
    },
    onError: (error) => {
      console.error("Falha ao criar categoria: ", error.message);
    },
  });

  return {
    createCategory,
    isCreatingCategory,
    isErrorCreating,
    errorCategory,
  };
};
