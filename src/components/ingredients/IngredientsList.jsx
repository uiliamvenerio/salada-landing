import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

export function IngredientsList({ ingredients, onEdit, onDelete }) {
  const handleDeleteClick = (ingredient) => {
    if (confirm(`Tem certeza que deseja excluir o ingrediente "${ingredient.descricao_alimento}"?`)) {
      onDelete(ingredient.id);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px]">
        <thead>
          <tr className="border-b border-gray-100 dark:border-gray-800">
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Descrição</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Categoria</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Energia (kcal)</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Proteína (g)</th>
            <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Ações</th>
          </tr>
        </thead>
        <tbody>
          {ingredients.map((ingredient) => (
            <tr 
              key={ingredient.id}
              className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-dark-hover transition-colors"
            >
              <td className="py-3 px-4">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{ingredient.descricao_alimento}</p>
                <p className="text-sm text-gray-500">{ingredient.numero_alimento}</p>
              </td>
              <td className="py-3 px-4">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                  {ingredient.categoria}
                </span>
              </td>
              <td className="py-3 px-4">
                <p className="text-sm text-gray-900 dark:text-white">{ingredient.energia_kcal}</p>
              </td>
              <td className="py-3 px-4">
                <p className="text-sm text-gray-900 dark:text-white">{ingredient.proteina_g}</p>
              </td>
              <td className="py-3 px-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(ingredient)}
                    className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                    title="Editar Ingrediente"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(ingredient)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Excluir Ingrediente"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}