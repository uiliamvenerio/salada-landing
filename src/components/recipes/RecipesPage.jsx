import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { RecipesList } from './RecipesList';
import { RecipeStats } from './RecipeStats';
import { RecipeForm } from './RecipeForm';

const initialRecipes = [
  {
    id: 1,
    name: 'Carne de Panela',
    category: 'Prato Principal', 
    yield: 30,
    prepTime: 60,
    budget: 5000,
    spent: 2500,
    metrics: {
      sent: 10000,
      opened: 4500,
      clicked: 2000,
      converted: 500
    }
  },
  {
    id: 2,
    name: 'Carne Moída com Molho de Tomate',
    category: 'Prato Principal', 
    yield: 30,
    prepTime: 60,
    budget: 10000,
    spent: 0,
    metrics: {
      impressions: 0,
      engagement: 0,
      clicks: 0,
      conversions: 0
    }
  },
  {
    id: 3,
    name: 'Iscas de Porco com Cebola',
    category: 'Prato Principal', 
    yield: 30,
    prepTime: 60,
    budget: 8000,
    spent: 8000,
    metrics: {
      sent: 15000,
      opened: 8000,
      clicked: 4000,
      converted: 1200
    }
  }
];

export function RecipesPage() {
  const [recipes, setRecipes] = useState(initialRecipes);
  const [isAddingRecipe, setIsAddingRecipe] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    search: ''
  });

  const handleCreateRecipe = (recipe) => {
    setRecipes([...recipes, { ...recipe, id: Date.now() }]);
    setIsAddingRecipe(false);
  };

  const handleUpdateRecipe = (updatedRecipe) => {
    setRecipes(recipes.map(c => 
      c.id === updatedRecipe.id ? updatedRecipe : c
    ));
    setSelectedRecipe(null);
  };

  const handleDeleteRecipe = (id) => {
    setRecipes(recipes.filter(c => c.id !== id));
  };

  const filteredRecipes = recipes.filter(recipe => {
    if (filters.status !== 'all' && recipe.status !== filters.status) return false;
    if (filters.type !== 'all' && recipe.type !== filters.type) return false;
    if (filters.search && !recipe.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  // Calculate total metrics
  const totalMetrics = recipes.reduce((acc, recipe) => {
    if (recipe.type === 'email') {
      acc.emailsSent += recipe.metrics.sent || 0;
      acc.conversions += recipe.metrics.converted || 0;
    }
    acc.spent += recipe.spent || 0;
    return acc;
  }, { emailsSent: 0, conversions: 0, spent: 0 });

  if (isAddingRecipe) {
    return (
      <RecipeForm
        onSubmit={handleCreateRecipe}
        onCancel={() => setIsAddingRecipe(false)}
      />
    );
  }

  if (selectedRecipe) {
    return (
      <RecipeForm
        recipe={selectedRecipe}
        onSubmit={handleUpdateRecipe}
        onCancel={() => setSelectedRecipe(null)}
      />
    );
  }

  return (
    <main className="flex-1 min-w-0 overflow-auto">
      <div className="max-w-[1440px] mx-auto animate-fade-in">
        <div className="flex flex-wrap items-center justify-between gap-4 p-4">
          <h1 className="text-gray-900 dark:text-white text-2xl md:text-3xl font-bold">Receitas</h1>
          <Button onClick={() => setIsAddingRecipe(true)}>
            Nova Receita
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
          <RecipeStats
            title="Total Emails Sent"
            value={totalMetrics.emailsSent.toLocaleString()}
            trend="+12.5%"
            description="Compared to last month"
          />
          <RecipeStats
            title="Total Conversions"
            value={totalMetrics.conversions.toLocaleString()}
            trend="+8.2%"
            description="Compared to last month"
          />
          <RecipeStats
            title="Total Spent"
            value={`$${totalMetrics.spent.toLocaleString()}`}
            trend="+15.3%"
            description="Compared to last month"
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
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                </select>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="all">All Types</option>
                  <option value="email">Email</option>
                  <option value="social">Social</option>
                </select>
              </div>
            </CardHeader>
            <CardContent>
              <RecipesList
                recipes={filteredRecipes}
                onEdit={setSelectedRecipe}
                onDelete={handleDeleteRecipe}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}