import { useEffect, useState } from "react";
import Input from "./ui/Input";
import Button from "./ui/Button";
import { useCategories } from "../hooks/useCategories"; // Hook de busca
import { useCreateTransaction } from "../hooks/useCreateTransaction"; // Hook de mutação
import { useCreateCategory } from "../hooks/useCreateCategory";
import { FaPlus } from "react-icons/fa";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateTransaction } from "../hooks/useUpdateTransaction";

// Pega a data de hoje no formato YYYY-MM-DD (para o <inpuy type="date">)
const getTodayDate = () => {
  return new Date().toISOString().split("T")[0];
};

const TransactionForm = ({ onSuccess, transactionToEdit }) => {
  const queryClient = useQueryClient();

  // Estado do formulário
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [date, setDate] = useState(getTodayDate());
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");

  // Hooks de dados
  const { categories, isLoadingCategories } = useCategories();
  const { createTransaction, isCreating, errorCreating } =
    useCreateTransaction();
  const { createCategory, isCreatingCategory } = useCreateCategory();

  const { updateTransaction, isUpdating } = useUpdateTransaction();

  useEffect(() => {
    if (transactionToEdit) {
      setDescription(transactionToEdit.description);
      setValue(transactionToEdit.value);
      setDate(new Date(transactionToEdit.date).toISOString().split("T")[0]);
      setType(transactionToEdit.type);
      setCategory(
        transactionToEdit.category?._id || transactionToEdit.category
      );
    } else {
      setDescription("");
      setValue("");
      setDate(getTodayDate());
      setType("expense");
      setCategory(categories && categories.length > 0 ? categories[0]._id : "");
    }
  }, [transactionToEdit, categories]);

  const handleCreateCategory = () => {
    const newCategoryName = window.prompt("Qual o nome da nova categoria?");

    if (newCategoryName) {
      createCategory(newCategoryName, {
        onSuccess: (newData) => {

          queryClient.invalidateQueries({ queryKey: ["categories"] });
          setCategory(newData.data._id);
        },
        onError: (error) => {
          console.error("Falha ao criar categoria", error);
        },
      });
    }
  };

  // Seta a primeira categoria como padrão quando a lista carregar
  useEffect(() => {
    if (categories && categories.length > 0 && !category) {
      setCategory(categories[0]._id);
    }
  }, [categories, category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!category && !isLoadingCategories && categories?.length > 0) {
      setError("Por favor, selecione uma categoria.");
      return;
    }

    if (!description || !value || !date) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    if (categories?.length === 0) {
      setError("Você precisa criar uma categoria primeiro.");
      return;
    }

    const transactionData = {
      description,
      value: parseFloat(value), // Garante que o valor é um número
      type,
      date,
      category,
    };

    if (transactionToEdit) {
      // --- LÓGICA DE ATUALIZAÇÃO ---
      updateTransaction(
        { id: transactionToEdit._id, transactionData },
        {
          onSuccess: () => {
            onSuccess();
          },
          onError: (err) => {
            setError(err.message || "Falha ao atualizar transação.");
          },
        }
      );
    } else {
      // --- LÓGICA DE CRIAÇÃO
      createTransaction(transactionData, {
        onSuccess: () => {
          onSuccess();
        },
        onError: (err) => {
          setError(err.message || "Falha ao criar transação.");
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Erro */}
      {error && (
        <div className="rounded-md bg-red-100 p-3 text-center text-red-700 dark:bg-red-900 dark:text-red-200">
          {error}
        </div>
      )}

      {/* Erro da Mutação (caso o hook falhe) */}
      {errorCreating && (
        <div className="rounded-md bg-red-100 p-3 text-center text-red-700 dark:bg-red-900 dark:text-red-200">
          {errorCreating.message}
        </div>
      )}

      {/* Descrição */}
      <Input
        id="description"
        name="description"
        placeholder="Descrição (ex: Supermercado)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* Valor */}
      <Input
        type="number"
        id="value"
        name="value"
        placeholder="Valor (ex: 150.50)"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        step="0.01"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Data */}
        <Input
          type="date"
          id="date"
          name="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        {/* Tipo (Receita/Despesa) */}
        <select
          id="type"
          name="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        >
          <option value="expense">Despesa</option>
          <option value="income">Receita</option>
        </select>

        {/* Categoria */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Categoria
          </label>
          <div className="flex items-center gap-2">
            <select
              name="category"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isLoadingCategories}
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
            >
              {isLoadingCategories ? (
                <option>Carregando categorias...</option>
              ) : categories && categories.length > 0 ? (
                categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))
              ) : (
                <option disabled value="">
                  Nenhuma categoria
                </option>
              )}
            </select>

            {/* Botão de Nova Categoria */}
            <button
              type="button"
              onClick={handleCreateCategory}
              disabled={isCreatingCategory}
              className="flex shrink-0 rounded-md bg-green-600 p-2 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-offset-gray-800"
              title="Criar nova categoria"
            >
              {isCreatingCategory ? (
                <span className="animate-pulse">...</span>
              ) : (
                <FaPlus />
              )}
            </button>
          </div>
        </div>
      </div>

      <Button type="submit" isLoading={isCreating || isUpdating}>
        {isCreating
          ? "Salvando"
          : isUpdating
          ? "Atualizando..."
          : "Salvar Transação"}
      </Button>
    </form>
  );
};

export default TransactionForm;
