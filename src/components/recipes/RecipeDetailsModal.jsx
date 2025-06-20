import React from 'react';
import { Dialog } from '@headlessui/react';
import { Card } from '../ui/Card';

export function RecipeDetailsModal({ recipe, onClose }) {
  if (!recipe) return null;

  return (
    <Dialog
      open={true}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/20 dark:bg-black/40" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-4xl max-h-[90vh] overflow-auto">
          <Card>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-4">
                {recipe.image && (
                  <img
                    src={recipe.image}
                    alt={recipe.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
                <div>
                  <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-white">
                    {recipe.name}
                  </Dialog.Title>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {recipe.category}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Informações Básicas */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Informações Básicas</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Categoria</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{recipe.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Unidade de Medida</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {recipe.measurementUnit === 'g' ? 'Gramas (g)' : 'Mililitros (ml)'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Índice de Cocção</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{recipe.cookingIndex}</p>
                  </div>
                  {recipe.internalCode && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Código Interno</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{recipe.internalCode}</p>
                    </div>
                  )}
                  {recipe.prepTime && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Tempo de Preparo</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{recipe.prepTime} minutos</p>
                    </div>
                  )}
                  {recipe.yield && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Rendimento</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{recipe.yield} porções</p>
                    </div>
                  )}
                  {recipe.difficulty && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Dificuldade</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{recipe.difficulty}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Ingredientes */}
              {recipe.ingredients && recipe.ingredients.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Ingredientes</h3>
                  <div className="bg-gray-50 dark:bg-dark-hover rounded-lg p-4">
                    <div className="space-y-2">
                      {recipe.ingredients.map((ingredient, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {ingredient.name}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {ingredient.quantity}{ingredient.unit}
                            {ingredient.correctionFactor && ` (FC: ${ingredient.correctionFactor})`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Modo de Preparo */}
              {recipe.preparationSteps && recipe.preparationSteps.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Modo de Preparo</h3>
                  <div className="bg-gray-50 dark:bg-dark-hover rounded-lg p-4">
                    <ol className="space-y-3">
                      {recipe.preparationSteps.map((step, index) => (
                        <li key={index} className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-primary text-white text-xs font-medium rounded-full flex items-center justify-center">
                            {step.number}
                          </span>
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {step.description}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}

              {/* Tags */}
              {recipe.tags && recipe.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {recipe.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Observações */}
              {recipe.notes && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Observações</h3>
                  <div className="bg-gray-50 dark:bg-dark-hover rounded-lg p-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {recipe.notes}
                    </p>
                  </div>
                </div>
              )}

              {/* Informações Calculadas */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Informações Calculadas</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 dark:bg-dark-hover rounded-lg p-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Peso Bruto</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{recipe.grossWeight || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Fator de Correção</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{recipe.correctionFactor || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Peso Líquido</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{recipe.netWeight || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-hover rounded-lg transition-colors"
              >
                Fechar
              </button>
            </div>
          </Card>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}