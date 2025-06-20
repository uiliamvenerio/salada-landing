import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { RecipesList } from './RecipesList';
import { RecipeStats } from './RecipeStats';
import { RecipeModal } from './RecipeModal';
import { RecipeDetailsModal } from './RecipeDetailsModal';
import { db } from '../../lib/supabase';
import toast from 'react-hot-toast';

export function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [viewingRecipe, setViewingRecipe] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    search: ''
  });

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      const data = await db.recipes.getAll();
      
      // Transform data to match component expectations
      const transformedRecipes = data.map(recipe => ({
        ...recipe,
        measurementUnit: recipe.measurement_unit,
        cookingIndex: recipe.cooking_index,
        internalCode: recipe.internal_code,
        prepTime: recipe.prep_time,
        grossWeight: recipe.gross_weight,
        netWeight: recipe.net_weight,
        correctionFactor: recipe.correction_factor,
        ingredients: recipe.recipe_ingredients?.map(ri => ({
          ingredient_id: ri.ingredient_id,
          name: ri.ingredients?.descricao_alimento || '',
          quantity: ri.quantity,
          unit: ri.unit,
          correctionFactor: ri.correction_factor
        })) || [],
        preparationSteps: recipe.preparation_steps?.map(step => ({
          number: step.step_number,
          description: step.description
        })) || []
      }));
      
      setRecipes(transformedRecipes);
    } catch (error) {
      console.error('Error loading recipes:', error);
      toast.error('Erro ao carregar receitas');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRecipe = async (recipe) => {
    try {
      const newRecipe = await db.recipes.create(recipe);
      await loadRecipes(); // Reload to get complete data with relationships
      setIsModalOpen(false);
      toast.success('Receita criada com sucesso!');
    } catch (error) {
      console.error('Error creating recipe:', error);
      toast.error('Erro ao criar receita');
    }
  };

  const handleUpdateRecipe = async (updatedRecipe) => {
    try {
      await db.recipes.update(updatedRecipe.id, updatedRecipe);
      await loadRecipes(); // Reload to get complete data with relationships
      setSelectedRecipe(null);
      setIsModalOpen(false);
      toast.success('Receita atualizada com sucesso!');
    } catch (error) {
      console.error('Error updating recipe:', error);
      toast.error('Erro ao atualizar receita');
    }
  };

  const handleDeleteRecipe = async (id) => {
    if (!confirm('Tem certeza que deseja excluir esta receita?')) {
      return;
    }

    try {
      await db.recipes.delete(id);
      setRecipes(recipes.filter(r => r.id !== id));
      toast.success('Receita excluída com sucesso!');
    } catch (error) {
      console.error('Error deleting recipe:', error);
      toast.error('Erro ao excluir receita');
    }
  };

  const handleViewDetails = (recipe) => {
    setViewingRecipe(recipe);
  };

  const handleEditRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const filteredRecipes = recipes.filter(recipe => {
    if (filters.search && !recipe.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  // Calculate total metrics
  const totalMetrics = recipes.reduce((acc, recipe) => {
    acc.totalRecipes += 1;
    acc.totalIngredients += recipe.ingredients?.length || 0;
    return acc;
  }, { totalRecipes: 0, totalIngredients: 0 });

  if (loading) {
    return (
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="max-w-[1440px] mx-auto animate-fade-in">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500 dark:text-gray-400">Carregando receitas...</div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 min-w-0 overflow-auto">
      <div className="max-w-[1440px] mx-auto animate-fade-in">
        <div className="flex flex-wrap items-center justify-between gap-4 p-4">
          <h1 className="text-gray-900 dark:text-white text-2xl md:text-3xl font-bold">Receitas</h1>
          <Button onClick={() => {
            setSelectedRecipe(null);
            setIsModalOpen(true);
          }}>
            Nova Receita
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
          <RecipeStats
            title="Total de Receitas"
            value={totalMetrics.totalRecipes.toString()}
            trend="+12.5%"
            description="Comparado ao mês passado"
          />
          <RecipeStats
            title="Total de Ingredientes"
            value={totalMetrics.totalIngredients.toString()}
            trend="+8.2%"
            description="Comparado ao mês passado"
          />
          <RecipeStats
            title="Receitas Ativas"
            value={totalMetrics.totalRecipes.toString()}
            trend="+15.3%"
            description="Comparado ao mês passado"
          />
        </div>

        <div className="p-4">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center gap-4">
                <input
                  type="text"
                  placeholder="Pesquisar receitas..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="flex-1 min-w-[200px] px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </CardHeader>
            <CardContent>
              <RecipesList
                recipes={filteredRecipes}
                onEdit={handleEditRecipe}
                onDelete={handleDeleteRecipe}
                onViewDetails={handleViewDetails}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <RecipeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRecipe(null);
        }}
        onSubmit={selectedRecipe ? handleUpdateRecipe : handleCreateRecipe}
        recipe={selectedRecipe}
      />

      {viewingRecipe && (
        <RecipeDetailsModal
          recipe={viewingRecipe}
          onClose={() => setViewingRecipe(null)}
        />
      )}
    </main>
  );
}