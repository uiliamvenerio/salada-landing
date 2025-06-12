import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { Card } from '../ui/Card';
import toast from 'react-hot-toast';

const initialFormData = {
  tabela_nutricional: '',
  numero_alimento: '',
  descricao_alimento: '',
  categoria: '',
  porcentagem_umidade: 0,
  energia_kcal: 0,
  energia_kj: 0,
  proteina_g: 0,
  lipideos_g: 0,
  colesterol_mg: 0,
  carboidrato_g: 0,
  fibra_alimentar_g: 0,
  cinzas_g: 0,
  calcio_mg: 0,
  magnesio_mg: 0,
  manganes_mg: 0,
  fosforo_mg: 0,
  ferro_mg: 0,
  sodio_mg: 0,
  potassio_mg: 0,
  cobre_mg: 0,
  zinco_mg: 0,
  retinol_mcg: 0,
  re_mcg: 0,
  rae_mcg: 0,
  tiamina_mg: 0,
  riboflavina_mg: 0,
  piridoxina_mg: 0,
  niacina_mg: 0,
  vitamina_c_mg: 0
};

export function IngredientModal({ isOpen, onClose, onSubmit, ingredient }) {
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (ingredient) {
      setFormData(ingredient);
    } else {
      setFormData(initialFormData);
    }
  }, [ingredient]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.descricao_alimento || !formData.categoria) {
      toast.error('Por favor, preencha os campos obrigatórios');
      return;
    }

    onSubmit(formData);
    toast.success(`Ingrediente ${ingredient ? 'atualizado' : 'criado'} com sucesso`);
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/20 dark:bg-black/40" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-4xl max-h-[90vh] overflow-auto">
          <Card>
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
              <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
                {ingredient ? 'Editar Ingrediente' : 'Novo Ingrediente'}
              </Dialog.Title>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-6">
                {/* Informações Básicas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tabela Nutricional *
                    </label>
                    <input
                      type="text"
                      value={formData.tabela_nutricional}
                      onChange={(e) => setFormData({ ...formData, tabela_nutricional: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Número do Alimento *
                    </label>
                    <input
                      type="text"
                      value={formData.numero_alimento}
                      onChange={(e) => setFormData({ ...formData, numero_alimento: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Descrição do Alimento *
                    </label>
                    <input
                      type="text"
                      value={formData.descricao_alimento}
                      onChange={(e) => setFormData({ ...formData, descricao_alimento: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Categoria *
                    </label>
                    <select
                      value={formData.categoria}
                      onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      required
                    >
                      <option value="">Selecione uma categoria</option>
                      <option value="Cereais">Cereais</option>
                      <option value="Legumes">Legumes</option>
                      <option value="Frutas">Frutas</option>
                      <option value="Carnes">Carnes</option>
                      <option value="Laticínios">Laticínios</option>
                    </select>
                  </div>
                </div>

                {/* Informações Nutricionais */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Informações Nutricionais</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Umidade (%)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.porcentagem_umidade}
                        onChange={(e) => setFormData({ ...formData, porcentagem_umidade: parseFloat(e.target.value) })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Energia (kcal)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.energia_kcal}
                        onChange={(e) => setFormData({ ...formData, energia_kcal: parseFloat(e.target.value) })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Energia (kJ)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.energia_kj}
                        onChange={(e) => setFormData({ ...formData, energia_kj: parseFloat(e.target.value) })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Proteína (g)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.proteina_g}
                        onChange={(e) => setFormData({ ...formData, proteina_g: parseFloat(e.target.value) })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Lipídeos (g)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.lipideos_g}
                        onChange={(e) => setFormData({ ...formData, lipideos_g: parseFloat(e.target.value) })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Colesterol (mg)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.colesterol_mg}
                        onChange={(e) => setFormData({ ...formData, colesterol_mg: parseFloat(e.target.value) })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Carboidrato (g)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.carboidrato_g}
                        onChange={(e) => setFormData({ ...formData, carboidrato_g: parseFloat(e.target.value) })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Fibra Alimentar (g)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.fibra_alimentar_g}
                        onChange={(e) => setFormData({ ...formData, fibra_alimentar_g: parseFloat(e.target.value) })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Cinzas (g)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.cinzas_g}
                        onChange={(e) => setFormData({ ...formData, cinzas_g: parseFloat(e.target.value) })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                  </div>
                </div>

                {/* Minerais */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Minerais</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Cálcio (mg)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.calcio_mg}
                        onChange={(e) => setFormData({ ...formData, calcio_mg: parseFloat(e.target.value) })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Magnésio (mg)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.magnesio_mg}
                        onChange={(e) => setFormData({ ...formData, magnesio_mg: parseFloat(e.target.value) })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Manganês (mg)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.manganes_mg}
                        onChange={(e) => setFormData({ ...formData, manganes_mg: parseFloat(e.target.value) })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Fósforo (mg)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.fosforo_mg}
                        onChange={(e) => setFormData({ ...formData, fosforo_mg: parseFloat(e.target.value) })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Ferro (mg)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.ferro_mg}
                        onChange={(e) => setFormData({ ...formData, ferro_mg: parseFloat(e.target.value) })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Sódio (mg)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.sodio_mg}
                        onChange={(e) => setFormData({ ...formData, sodio_mg: parseFloat(e.target.value) })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Potássio (mg)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.potassio_mg}
                        onChange={(e) => setFormData({ ...formData, potassio_mg: parseFloat(e.target.value) })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Cobre (mg)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.cobre_mg}
                        onChange={(e) => setFormData({ ...formData, cobre_mg: parseFloat(e.target.value) })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Zinco (mg)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.zinco_mg}
                        onChange={(e) => setFormData({ ...formData, zinco_mg: parseFloat(e.target.value) })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                  </div>
                </div>

                {/* Vitaminas */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Vitaminas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Retinol (mcg)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.retinol_mcg}
                        onChange={(e) => setFormData({ ...formData, retinol_mcg: parseFloat(e.target.value) })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        RE (mcg)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.re_mcg}
                        onChange={(e) => setFormData({ ...formData, re_mcg: parseFloat(e.target.value) })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        RAE (mcg)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.rae_mcg}
                        onChange={(e) => setFormData({ ...formData, rae_mcg: parseFloat(e.target.value) })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tiamina (mg)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.tiamina_mg}
                        onChange={(e) => setFormData({ ...formData, tiamina_mg: parseFloat(e.target.value) })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Riboflavina (mg)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.riboflavina_mg}
                        onChange={(e) => setFormData({ ...formData, riboflavina_mg: parseFloat(e.target.value) })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Piridoxina (mg)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.piridoxina_mg}
                        onChange={(e) => setFormData({ ...formData, piridoxina_mg: parseFloat(e.target.value) })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Niacina (mg)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.niacina_mg}
                        onChange={(e) => setFormData({ ...formData, niacina_mg: parseFloat(e.target.value) })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Vitamina C (mg)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.vitamina_c_mg}
                        onChange={(e) => setFormData({ ...formData, vitamina_c_mg: parseFloat(e.target.value) })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-hover rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-light rounded-lg transition-colors"
                >
                  {ingredient ? 'Atualizar Ingrediente' : 'Criar Ingrediente'}
                </button>
              </div>
            </form>
          </Card>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}