import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { Card } from '../ui/Card';
import { db } from '../../lib/supabase';
import toast from 'react-hot-toast';

const categories = [
  'Acompanhamento', 'Couvert', 'Drinks', 'Entrada', 'Entrada Fria', 
  'Entrada Quente', 'Guarnição', 'Lanche Rápido', 'Massa', 'Molho',
  'Outro', 'Pães', 'Petisco', 'Prato Principal', 'Prato Único',
  'Receita Base', 'Salgado', 'Sanduíche', 'Sobremesa', 'Sopa'
];

const difficultyLevels = ['Fácil', 'Médio', 'Difícil'];

const initialFormData = {
  name: '',
  category: '',
  measurementUnit: 'g',
  ingredients: [],
  cookingIndex: 0,
  internalCode: '',
  prepTime: '',
  yield: '',
  difficulty: '',
  preparationSteps: [],
  notes: '',
  image: '',
  tags: [],
  grossWeight: 0,
  netWeight: 0,
  correctionFactor: 1
};

export function RecipeModal({ isOpen, onClose, onSubmit, recipe }) {
  const [formData, setFormData] = useState(initialFormData);
  const [availableIngredients, setAvailableIngredients] = useState([]);
  const [filteredIngredients, setFilteredIngredients] = useState([]);
  const [ingredientFilter, setIngredientFilter] = useState('');
  const [showIngredientDropdown, setShowIngredientDropdown] = useState(false);
  const [currentIngredient, setCurrentIngredient] = useState({
    ingredient_id: null,
    name: '',
    quantity: '',
    unit: 'g',
    correctionFactor: '1'
  });
  const [currentStep, setCurrentStep] = useState('');

  useEffect(() => {
    if (recipe) {
      setFormData(recipe);
    } else {
      setFormData(initialFormData);
    }
  }, [recipe]);

  useEffect(() => {
    loadIngredients();
  }, []);

  useEffect(() => {
    if (ingredientFilter) {
      const filtered = availableIngredients.filter(ingredient =>
        ingredient.descricao_alimento.toLowerCase().includes(ingredientFilter.toLowerCase())
      );
      setFilteredIngredients(filtered);
      setShowIngredientDropdown(true);
    } else {
      setFilteredIngredients([]);
      setShowIngredientDropdown(false);
    }
  }, [ingredientFilter, availableIngredients]);

  const loadIngredients = async () => {
    try {
      const ingredients = await db.ingredients.getAll();
      setAvailableIngredients(ingredients);
    } catch (error) {
      console.error('Error loading ingredients:', error);
      toast.error('Erro ao carregar ingredientes');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.measurementUnit) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (formData.ingredients.length === 0) {
      toast.error('Adicione pelo menos um ingrediente');
      return;
    }

    onSubmit(formData);
    toast.success(`Receita ${recipe ? 'atualizada' : 'criada'} com sucesso`);
    onClose();
  };

  const handleIngredientSelect = (ingredient) => {
    setCurrentIngredient({
      ...currentIngredient,
      ingredient_id: ingredient.id,
      name: ingredient.descricao_alimento
    });
    setIngredientFilter(ingredient.descricao_alimento);
    setShowIngredientDropdown(false);
  };

  const addIngredient = () => {
    if (!currentIngredient.name || !currentIngredient.quantity) {
      toast.error('Preencha o nome e quantidade do ingrediente');
      return;
    }

    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, currentIngredient]
    });
    setCurrentIngredient({ ingredient_id: null, name: '', quantity: '', unit: 'g', correctionFactor: '1' });
    setIngredientFilter('');
  };

  const addPreparationStep = () => {
    if (!currentStep) {
      toast.error('Digite o passo de preparação');
      return;
    }

    setFormData({
      ...formData,
      preparationSteps: [...formData.preparationSteps, {
        number: formData.preparationSteps.length + 1,
        description: currentStep
      }]
    });
    setCurrentStep('');
  };

  const handleTagInput = (e) => {
    if (e.key === 'Enter' && e.target.value) {
      e.preventDefault();
      setFormData({
        ...formData,
        tags: [...formData.tags, e.target.value]
      });
      e.target.value = '';
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/20 dark:bg-black/40" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-5xl max-h-[95vh] overflow-auto">
          <Card>
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
              <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-white">
                {recipe ? 'Editar Receita' : 'Nova Receita'}
              </Dialog.Title>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-hover transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-8 space-y-8">
                {/* Informações Básicas */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256" className="text-primary">
                        <path d="M224,48H32A16,16,0,0,0,16,64V192a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48Zm0,144H32V64H224V192Z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Informações Básicas</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nome da Receita *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ex: Bolo de Chocolate"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Categoria *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        required
                      >
                        <option value="">Selecione uma categoria</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Unidade de Medida *
                      </label>
                      <select
                        value={formData.measurementUnit}
                        onChange={(e) => setFormData({ ...formData, measurementUnit: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        required
                      >
                        <option value="g">Gramas (g)</option>
                        <option value="ml">Mililitros (ml)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Código Interno
                      </label>
                      <input
                        type="text"
                        value={formData.internalCode}
                        onChange={(e) => setFormData({ ...formData, internalCode: e.target.value })}
                        placeholder="Ex: REC001"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      />
                    </div>
                  </div>
                </section>

                {/* Detalhes da Receita */}
                <section className="border-t border-gray-100 dark:border-gray-800 pt-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256" className="text-blue-600 dark:text-blue-400">
                        <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Detalhes da Receita</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Índice de Cocção *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.cookingIndex}
                        onChange={(e) => setFormData({ ...formData, cookingIndex: parseFloat(e.target.value) })}
                        placeholder="0.00"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tempo de Preparo
                      </label>
                      <input
                        type="number"
                        value={formData.prepTime}
                        onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })}
                        placeholder="Minutos"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Rendimento
                      </label>
                      <input
                        type="number"
                        value={formData.yield}
                        onChange={(e) => setFormData({ ...formData, yield: e.target.value })}
                        placeholder="Porções"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Dificuldade
                      </label>
                      <select
                        value={formData.difficulty}
                        onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      >
                        <option value="">Selecione</option>
                        {difficultyLevels.map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </section>

                {/* Ingredientes */}
                <section className="border-t border-gray-100 dark:border-gray-800 pt-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256" className="text-green-600 dark:text-green-400">
                        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a8,8,0,0,1-8,8H136v32a8,8,0,0,1-16,0V136H88a8,8,0,0,1,0-16h32V88a8,8,0,0,1,16,0v32h32A8,8,0,0,1,176,128Z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ingredientes *</h3>
                  </div>

                  <div className="bg-gray-50 dark:bg-dark-hover rounded-lg p-6 space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                      <div className="lg:col-span-5 relative">
                        <input
                          type="text"
                          placeholder="Digite para buscar ingrediente"
                          value={ingredientFilter}
                          onChange={(e) => {
                            setIngredientFilter(e.target.value);
                            setCurrentIngredient({ ...currentIngredient, ingredient_id: null, name: e.target.value });
                          }}
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-card text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        />
                        {showIngredientDropdown && filteredIngredients.length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
                            {filteredIngredients.map((ingredient) => (
                              <button
                                key={ingredient.id}
                                type="button"
                                onClick={() => handleIngredientSelect(ingredient)}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-dark-hover text-gray-900 dark:text-white transition-colors"
                              >
                                <div>
                                  <p className="font-medium">{ingredient.descricao_alimento}</p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">{ingredient.categoria}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="lg:col-span-2">
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Quantidade"
                          value={currentIngredient.quantity}
                          onChange={(e) => setCurrentIngredient({ ...currentIngredient, quantity: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-card text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        />
                      </div>
                      <div className="lg:col-span-1">
                        <select
                          value={currentIngredient.unit}
                          onChange={(e) => setCurrentIngredient({ ...currentIngredient, unit: e.target.value })}
                          className="w-full px-3 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-card text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        >
                          <option value="g">g</option>
                          <option value="ml">ml</option>
                        </select>
                      </div>
                      <div className="lg:col-span-2">
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Fator Correção"
                          value={currentIngredient.correctionFactor}
                          onChange={(e) => setCurrentIngredient({ ...currentIngredient, correctionFactor: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-card text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        />
                      </div>
                      <div className="lg:col-span-2">
                        <button
                          type="button"
                          onClick={addIngredient}
                          className="w-full px-6 py-3 text-white bg-primary hover:bg-primary-light rounded-lg font-medium transition-colors"
                        >
                          Adicionar
                        </button>
                      </div>
                    </div>

                    {formData.ingredients.length > 0 && (
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-gray-700">
                        {formData.ingredients.map((ingredient, index) => (
                          <div key={index} className="p-4 flex justify-between items-center">
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {ingredient.name}
                              </span>
                              <span className="ml-2 text-gray-500 dark:text-gray-400">
                                {ingredient.quantity}{ingredient.unit}
                                {ingredient.correctionFactor && ` (FC: ${ingredient.correctionFactor})`}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setFormData({
                                ...formData,
                                ingredients: formData.ingredients.filter((_, i) => i !== index)
                              })}
                              className="text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                                <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>

                {/* Modo de Preparo */}
                <section className="border-t border-gray-100 dark:border-gray-800 pt-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256" className="text-orange-600 dark:text-orange-400">
                        <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Modo de Preparo</h3>
                  </div>

                  <div className="bg-gray-50 dark:bg-dark-hover rounded-lg p-6 space-y-4">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={currentStep}
                        onChange={(e) => setCurrentStep(e.target.value)}
                        placeholder="Digite o passo de preparação"
                        className="flex-1 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-card text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      />
                      <button
                        type="button"
                        onClick={addPreparationStep}
                        className="px-6 py-3 text-white bg-primary hover:bg-primary-light rounded-lg font-medium transition-colors"
                      >
                        Adicionar Passo
                      </button>
                    </div>

                    {formData.preparationSteps.length > 0 && (
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-gray-700">
                        {formData.preparationSteps.map((step, index) => (
                          <div key={index} className="p-4 flex justify-between items-start">
                            <div className="flex gap-3 flex-1">
                              <span className="flex-shrink-0 w-6 h-6 bg-primary text-white text-xs font-medium rounded-full flex items-center justify-center">
                                {step.number}
                              </span>
                              <span className="text-gray-900 dark:text-white">{step.description}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setFormData({
                                ...formData,
                                preparationSteps: formData.preparationSteps.filter((_, i) => i !== index)
                              })}
                              className="text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ml-3"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                                <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>

                {/* Informações Adicionais */}
                <section className="border-t border-gray-100 dark:border-gray-800 pt-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256" className="text-purple-600 dark:text-purple-400">
                        <path d="M216,48H40A16,16,0,0,0,24,64V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V64A16,16,0,0,0,216,48Zm0,144H40V64H216V192ZM184,96a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h96A8,8,0,0,1,184,96Zm0,32a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h96A8,8,0,0,1,184,128Zm-32,32a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h64A8,8,0,0,1,152,160Z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Informações Adicionais</h3>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Observações
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows={4}
                        placeholder="Adicione observações, dicas ou informações importantes sobre a receita..."
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tags
                      </label>
                      <input
                        type="text"
                        placeholder="Digite uma tag e pressione Enter"
                        onKeyPress={handleTagInput}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      />
                      {formData.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {formData.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full border border-primary/20"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => setFormData({
                                  ...formData,
                                  tags: formData.tags.filter((_, i) => i !== index)
                                })}
                                className="text-primary hover:text-primary-light transition-colors"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256">
                                  <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
                                </svg>
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Foto Ilustrativa
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setFormData({ ...formData, image: reader.result });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                      />
                      {formData.image && (
                        <div className="mt-3">
                          <img
                            src={formData.image}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                {/* Campos Calculados */}
                <section className="border-t border-gray-100 dark:border-gray-800 pt-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256" className="text-gray-600 dark:text-gray-400">
                        <path d="M232,208a8,8,0,0,1-8,8H32a8,8,0,0,1-8-8V48a8,8,0,0,1,16,0V156.69l50.34-50.35a8,8,0,0,1,11.32,0L128,132.69,180.69,80H160a8,8,0,0,1,0-16h40a8,8,0,0,1,8,8V112a8,8,0,0,1-16,0V91.31L139.31,144a8,8,0,0,1-11.32,0L101.66,117.66,40,179.31V200H224A8,8,0,0,1,232,208Z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Campos Calculados</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 dark:bg-dark-hover p-6 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Peso Bruto
                      </label>
                      <input
                        type="text"
                        value={formData.grossWeight}
                        disabled
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-dark-card text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Fator de Correção
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.correctionFactor}
                        onChange={(e) => setFormData({ ...formData, correctionFactor: parseFloat(e.target.value) })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Peso Líquido
                      </label>
                      <input
                        type="text"
                        value={formData.netWeight}
                        disabled
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-dark-card text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </section>
              </div>

              <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-dark-hover">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-card rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 text-sm font-medium text-white bg-primary hover:bg-primary-light rounded-lg transition-colors"
                >
                  {recipe ? 'Atualizar Receita' : 'Criar Receita'}
                </button>
              </div>
            </form>
          </Card>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}