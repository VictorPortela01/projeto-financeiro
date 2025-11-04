import { useEffect, useState } from "react";
import Input from "./ui/Input";
import Button from "./ui/Button";
import { useCategories } from "../hooks/useCategories"; // Hook de busca
import { useCreateTransaction } from "../hooks/useCreateTransaction"; // Hook de mutação

// Pega a data de hoje no formato YYYY-MM-DD (para o <inpuy type="date">)
const getTodayDate = () => {
  return new Date().toISOString().split("T")[0];
};

const TransactionForm = ({ onSuccess }) => {
  // Hooks
  const { categories, isLoadingCategories } = useCategories();
  const { createTransaction, isCreating, errorCreating } =
    useCreateTransaction();

  // Estado do formulário
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [date, setDate] = useState(getTodayDate());
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");

  // Seta a primeira categoria como padrão quando a lista carregar
  useEffect(() => {
    if (categories && categories.length > 0 && !category) {
      setCategory(categories[0]._id);
    }
  }, [categories, category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!description || !value || !date || !category) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    const transactionData = {
      description,
      value: parseFloat(value), // Garante que o valor é um número
      type,
      date,
      category,
    };

    createTransaction(transactionData, {
      onSuccess: () => {
        setDescription("");
        setValue("");
        setDate(getTodayDate());
        setType("expense");
        onSuccess();
      },
      onError: (err) => {
        setError(err.message || "Falha ao criar transação.");
      },
    });
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

      <Input
        type="number"
        id="value"
        name="value"
        placeholder="Valor (ex: 150.50)"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        step="0.01"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3">
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
        <select 
        name="category" 
        id="category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        disabled={isLoadingCategories}
        className="w-full rounded-md border border-indigo-300 bg-white px-4 py-2text-gray-900 shadow:sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 ">
          {isLoadingCategories ? (
            <option>Carregando categorias...</option>
          ) : (
            categories?.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))
          )}
        </select>
      </div>

      <Button type="submit" isLoading={isCreating}>
        {isCreating ? "Salvando" : "Salvar Transação"}
      </Button>
    </form>
  );
};

export default TransactionForm;
