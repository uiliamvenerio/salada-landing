import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { IngredientsList } from './IngredientsList';
import { IngredientModal } from './IngredientModal';
import { db } from '../../lib/supabase';
import toast from 'react-hot-toast';

export function IngredientsPage() {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all'
  });

  useEffect(() => {
    loadIngredients();
  }, []);

  const loadIngredients = async () => {
    try {
      setLoading(true);
      const data = await db.ingredients.getAll();
      setIngredients(data);
    } catch (error) {
      console.error('Error loading ingredients:', error);
      toast.error('Erro ao carregar ingredientes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIngredient = async (ingredient) => {
    try {
      const newIngredient = await db.ingredients.create(ingredient);
      setIngredients([newIngredient, ...ingredients]);
      setIsModalOpen(false);
      toast.success('Ingrediente criado com sucesso!');
    } catch (error) {
      console.error('Error creating ingredient:', error);
      toast.error('Erro ao criar ingrediente');
    }
  };

  const handleUpdateIngredient = async (updatedIngredient) => {
    try {
      const updated = await db.ingredients.update(updatedIngredient.id, updatedIngredient);
      setIngredients(ingredients.map(i => 
        i.id === updated.id ? updated : i
      ));
      setIsModalOpen(false);
      setSelectedIngredient(null);
      toast.success('Ingrediente atualizado com sucesso!');
    } catch (error) {
      console.error('Error updating ingredient:', error);
      toast.error('Erro ao atualizar ingrediente');
    }
  };

  const handleDeleteIngredient = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este ingrediente?')) {
      return;
    }

    try {
      await db.ingredients.delete(id);
      setIngredients(ingredients.filter(i => i.id !== id));
      toast.success('Ingrediente excluído com sucesso!');
    } catch (error) {
      console.error('Error deleting ingredient:', error);
      toast.error('Erro ao excluir ingrediente');
    }
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

  if (loading) {
    return (
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="max-w-[1440px] mx-auto animate-fade-in">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500 dark:text-gray-400">Carregando ingredientes...</div>
          </div>
        </div>
      </main>
    );
  }

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