import { useState, useEffect } from "react";
import Input from "./ui/Input";
import Button from "./ui/Button";
import { useCreateCategory } from "../hooks/useCreateCategory";
import { useUpdateCategory } from "../hooks/useUpdateCategory";

const CategoryForm = ({ onSuccess, categoryToEdit }) => {
  // Hooks
  const { createCategory, isCreatingCategory } = useCreateCategory();
  const { updateCategory, isUpdating } = useUpdateCategory();

  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name);
    } else {
      setName("");
    }
  }, [categoryToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!name) {
      setError("O nome da categoria é obrigatório.");
      return;
    }

    const mutationOptions = {
      onSuccess: () => {
        onSuccess();
        setName("");
      },
      onError: (err) => {
        setError(err.message || "Falha ao salvar categoria");
      },
    };

    if (categoryToEdit) {
      updateCategory({ id: categoryToEdit._id, name }, mutationOptions);
    } else {
      createCategory(name, mutationOptions);
    }
  };

  const isLoading = isCreatingCategory || isUpdating;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-100 p-3 text-center text-red-700 dark:bg-red-900 dark:text-red-200">
          {error}
        </div>
      )}

      <Input
        id="name"
        name="name"
        placeholder="Nome da Categoria (ex: Moradia)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={isLoading}
      />

      <Button type="submit" isLoading={isLoading}>
        {isLoading
          ? "Salvando..."
          : categoryToEdit
          ? "Atualizar Categoria"
          : "Salvar Categoria"}
      </Button>
    </form>
  );
};

export default CategoryForm;
