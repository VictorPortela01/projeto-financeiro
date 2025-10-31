import { useQuery } from '@tanstack/react-query';
import { getCategoriesReq } from '../services/categoryService';

export const useCategories = () => {
    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey:['categories'], // Chave ID
        queryFn: getCategoriesReq, // Função de Busca
        select: (data) => data.data,
    });

    return {
    categories: data, // Renomeia 'data' para 'categories'
    isLoadingCategories: isLoading,
    isErrorCategories: isError,
    errorCategories: error,
    refetchCategories: refetch,
};
};

