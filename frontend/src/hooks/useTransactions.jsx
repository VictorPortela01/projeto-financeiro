import { useQuery } from "@tanstack/react-query";
import { getTransactionsReq } from "../services/transactionService";

export const useTransactions = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["transactions"],

    queryFn: getTransactionsReq,

    select: (data) => data.data,
  });

  return {
    transactions: data,
    isLoadingTransactions: isLoading,
    isErrorTransactions: isError,
    errorTransactions: error,
    refetchTransactions: refetch,
  };
};
