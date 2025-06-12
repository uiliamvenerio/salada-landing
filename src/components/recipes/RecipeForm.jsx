import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
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
  correctionFactor: 0
};

export function RecipeForm({ recipe, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(recipe || initialFormData);
  const [currentIngredient, setCurrentIngredient] = useState({
    name: '',
    quantity: '',
    unit: 'g',
    correctionFactor: ''
  });
  const [currentStep, setCurrentStep] = useState('');

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
    setCurrentIngredient({ name: '', quantity: '', unit: 'g', correctionFactor: '' });
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
    <main className="flex-1 min-w-0 overflow-auto">
      <div className="max-w-[1440px] mx-auto animate-fade-in">
        <div className="flex flex-wrap items-center gap-4 p-4">
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-hover rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-gray-900 dark:text-white text-2xl md:text-3xl font-bold">
            {recipe ? 'Editar Receita' : 'Nova Receita'}
          </h1>
        </div>

        <div className="p-4">
          <Card>
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-6">
                {/* Campos obrigatórios */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nome da Receita *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Categoria *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      required
                    >
                      <option value="">Selecione uma categoria</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Unidade de Medida *
                    </label>
                    <select
                      value={formData.measurementUnit}
                      onChange={(e) => setFormData({ ...formData, measurementUnit: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      required
                    >
                      <option value="g">Gramas (g)</option>
                      <option value="ml">Mililitros (ml)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Índice de Cocção *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.cookingIndex}
                      onChange={(e) => setFormData({ ...formData, cookingIndex: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      required
                    />
                  </div>
                </div>

                {/* Lista de Ingredientes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Ingredientes *
                  </label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Nome do ingrediente"
                        value={currentIngredient.name}
                        onChange={(e) => setCurrentIngredient({ ...currentIngredient, name: e.target.value })}
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                      <input
                        type="number"
                        placeholder="Quantidade"
                        value={currentIngredient.quantity}
                        onChange={(e) => setCurrentIngredient({ ...currentIngredient, quantity: e.target.value })}
                        className="w-24 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                      <select
                        value={currentIngredient.unit}
                        onChange={(e) => setCurrentIngredient({ ...currentIngredient, unit: e.target.value })}
                        className="w-20 px-2 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      >
                        <option value="g">g</option>
                        <option value="ml">ml</option>
                      </select>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Fator de Correção"
                        value={currentIngredient.correctionFactor}
                        onChange={(e) => setCurrentIngredient({ ...currentIngredient, correctionFactor: e.target.value })}
                        className="w-32 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={addIngredient}
                        className="px-4 py-2 text-white bg-primary hover:bg-primary-light rounded-lg transition-colors"
                      >
                        Adicionar
                      </button>
                    </div>
                    <div className="border rounded-lg divide-y dark:divide-gray-700">
                      {formData.ingredients.map((ingredient, index) => (
                        <div key={index} className="p-2 flex justify-between items-center">
                          <span>{ingredient.name} - {ingredient.quantity}{ingredient.unit}</span>
                          <button
                            type="button"
                            onClick={() => setFormData({
                              ...formData,
                              ingredients: formData.ingredients.filter((_, i) => i !== index)
                            })}
                            className="text-red-500 hover:text-red-600"
                          >
                            Remover
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Campos opcionais */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Código de Controle Interno
                    </label>
                    <input
                      type="text"
                      value={formData.internalCode}
                      onChange={(e) => setFormData({ ...formData, internalCode: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tempo de Preparo (minutos)
                    </label>
                    <input
                      type="number"
                      value={formData.prepTime}
                      onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Rendimento (porções)
                    </label>
                    <input
                      type="number"
                      value={formData.yield}
                      onChange={(e) => setFormData({ ...formData, yield: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Dificuldade
                    </label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      <option value="">Selecione a dificuldade</option>
                      {difficultyLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Modo de Preparo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Modo de Preparo
                  </label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={currentStep}
                        onChange={(e) => setCurrentStep(e.target.value)}
                        placeholder="Digite o passo"
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={addPreparationStep}
                        className="px-4 py-2 text-white bg-primary hover:bg-primary-light rounded-lg transition-colors"
                      >
                        Adicionar
                      </button>
                    </div>
                    <div className="border rounded-lg divide-y dark:divide-gray-700">
                      {formData.preparationSteps.map((step, index) => (
                        <div key={index} className="p-2 flex justify-between items-center">
                          <span>{step.number}. {step.description}</span>
                          <button
                            type="button"
                            onClick={() => setFormData({
                              ...formData,
                              preparationSteps: formData.preparationSteps.filter((_, i) => i !== index)
                            })}
                            className="text-red-500 hover:text-red-600"
                          >
                            Remover
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Observações */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Observações
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tags
                  </label>
                  <input
                    type="text"
                    placeholder="Digite uma tag e pressione Enter"
                    onKeyPress={handleTagInput}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 dark:bg-dark-hover rounded-lg text-sm flex items-center gap-2"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => setFormData({
                            ...formData,
                            tags: formData.tags.filter((_, i) => i !== index)
                          })}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Foto */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  {formData.image && (
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="mt-2 w-32 h-32 object-cover rounded-lg"
                    />
                  )}
                </div>

                {/* Campos calculados */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 dark:bg-dark-hover p-4 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Peso Bruto
                    </label>
                    <input
                      type="text"
                      value={formData.grossWeight}
                      disabled
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-dark-card text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Fator de Correção
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.correctionFactor}
                      onChange={(e) => setFormData({ ...formData, correctionFactor: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Peso Líquido
                    </label>
                    <input
                      type="text"
                      value={formData.netWeight}
                      disabled
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-dark-card text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 dark:border-gray-800">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onCancel}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {recipe ? 'Atualizar Receita' : 'Criar Receita'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </main>
  );
}