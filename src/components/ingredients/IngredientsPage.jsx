import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { IngredientsList } from './IngredientsList';
import { IngredientModal } from './IngredientModal';

const initialIngredients = [
  {
    id: 1,
    tabela_nutricional: 'TACO',
    numero_alimento: '001',
    descricao_alimento: 'Arroz branco cozido',
    categoria: 'Cereais',
    energia_kcal: 128.0,
    proteina_g: 2.5,
    carboidrato_g: 28.1,
  },
];

export function IngredientsPage() {
  const [ingredients, setIngredients] = useState(initialIngredients);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all'
  });

  const handleCreateIngredient = (ingredient) => {
    setIngredients([...ingredients, { ...ingredient, id: Date.now() }]);
  };

  const handleUpdateIngredient = (updatedIngredient) => {
    setIngredients(ingredients.map(i => 
      i.id === updatedIngredient.id ? updatedIngredient : i
    ));
  };

  const handleDeleteIngredient = (id) => {
    setIngredients(ingredients.filter(i => i.id !== id));
  };

  const filteredIngredients = ingredients.filter(ingredient => {
    if (filters.search && !ingredient.descricao_alimento.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.category !== 'all' && ingredient.categoria !== filters.category) {
      return false;
    }
    return true;
  });

  return (
    <main className="flex-1 min-w-0 overflow-auto">
      <div className="max-w-[1440px] mx-auto animate-fade-in">
        <div className="flex flex-wrap items-center justify-between gap-4 p-4">
          <h1 className="text-gray-900 dark:text-white text-2xl md:text-3xl font-bold">Ingredientes</h1>
          <Button onClick={() => {
            setSelectedIngredient(null);
            setIsModalOpen(true);
          }}>
            Novo Ingrediente
          </Button>
        </div>

        <div className="p-4">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center gap-4">
                <input
                  type="text"
                  placeholder="Buscar ingredientes..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="flex-1 min-w-[200px] px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="all">Todas as Categorias</option>
                  <option value="Cereais">Cereais</option>
                  <option value="Legumes">Legumes</option>
                  <option value="Frutas">Frutas</option>
                  <option value="Carnes">Carnes</option>
                  <option value="Laticínios">Laticínios</option>
                </select>
              </div>
            </CardHeader>
            <CardContent>
              <IngredientsList
                ingredients={filteredIngredients}
                onEdit={(ingredient) => {
                  setSelectedIngredient(ingredient);
                  setIsModalOpen(true);
                }}
                onDelete={handleDeleteIngredient}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <IngredientModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedIngredient(null);
        }}
        onSubmit={selectedIngredient ? handleUpdateIngredient : handleCreateIngredient}
        ingredient={selectedIngredient}
      />
    </main>
  );
}