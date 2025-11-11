import { useState } from "react";
import { useCategories } from "../hooks/useCategories";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

import { useDeleteCategory } from "../hooks/useDeleteCategory";
import { useCreateCategory } from "../hooks/useCreateCategory";
import { useUpdateCategory } from "../hooks/useUpdateCategory";

import Modal from "../components/ui/Modal";
import CategoryForm from "../components/CategoryForm";

const CategoriesPage = () => {
  const { categories, isLoadingCategories, isErrorCategories } =
    useCategories();

  const { deleteCategory, isDeleting } = useDeleteCategory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const openCreateModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleDelete = (categoryId) => {
    if (
      window.confirm(
        "Tem certeza que deseja excluir esta categoria? \n (Isso pode falhar se a categoria estiver em uso por transações.)"
      )
    ) {
      deleteCategory(categoryId);
    }
  };

  const renderContent = () => {
    if (isLoadingCategories) {
      return (
        <p className="text-center text-gray-500">Carregando categorias...</p>
      );
    }
    if (isErrorCategories) {
      return (
        <p className="text-center text-red-500">Erro ao carregar categorias.</p>
      );
    }
    if (!categories || categories.length === 0) {
      return (
        <p className="text-center text-gray-500">
          Nenhuma categoria encontrada.
        </p>
      );
    }

    return (
      <ul className="divide-y divide-gray-200 rounded-lg bg-white shadow-md dark:divide-gray-700 dark:bg-gray-800">
        {categories.map((category) => (
          <li
            key={category._id}
            className="flex items-center justify-between p-4"
          >
            <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {category.name}
            </span>
            <div className="flex gap-4">
              <button
                onClick={() => openEditModal(category)}
                className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                title="Editar"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(category._id)}
                className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                title="Excluir"
              >
                <FaTrash />
              </button>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="container mx-auto max-w-4xl p-4 sm:px-6 lg:px-8">
      {/* Cabeçalho da Página */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          Gerenciar Categorias
        </h1>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2
                     font-semibold text-white shadow-lg transition-colors duration-200
                     hover:bg-indigo-700 focus:outline-none focus:ring-2 
                     focus:ring-indigo-500 focus:ring-offset-2
                     dark:bg-indigo-500 dark:hover:bg-indigo-600 
                     dark:focus:ring-offset-gray-900"
        >
          <FaPlus />
          Nova Categoria
        </button>
      </div>

      {/* Conteúdo da Lista */}
      <div className="mt-8">{renderContent()}</div>

      {/* Modal (será adicionado depois) */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingCategory ? "Editar Categoria" : "Nova Categoria"}
      >
        <CategoryForm onSuccess={closeModal} categoryToEdit={editingCategory} />
      </Modal>
    </div>
  );
};

export default CategoriesPage;
