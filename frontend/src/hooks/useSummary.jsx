import { useQuery } from '@tanstack/react-query';
import { getSummaryReq } from '../services/dashboardService';

export const useSummary =  () => {
    const { data, isLoading, isError, error, refetch } = useQuery({
        // 1. A "Chave" (ID) deste dado no cache
        queryKey: ["dashboardSummary"],

        // 2. A "Função de Busca" (a que acabamos de criar)
        queryFn: getSummaryReq,

        // 3. (Opcional) Configurações
        select: (data) => data.data, // Pega diretamente o objeto "data" da resposta da API
        // staleTime, refetchOnWindowFocus, etc. já estão no 'main.jsx'
    });

    return {
        summary: data,
        isLoadingSummary: isLoading,
        isErrorSummary: isError,
        errorSummary: error,
        refetchSummary: refetch,
    };
};
