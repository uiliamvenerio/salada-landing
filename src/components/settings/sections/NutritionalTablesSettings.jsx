import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../../ui/Card';
import { Button } from '../../ui/Button';
import toast from 'react-hot-toast';

export function NutritionalTablesSettings() {
  const [settings, setSettings] = useState({
    taco: true,
    tbca: false,
    ibge: false,
    usda: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Configurações de tabelas nutricionais atualizadas com sucesso');
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-gray-900 dark:text-white text-lg font-semibold">
          Tabelas de Composição Nutricional dos Alimentos
        </h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.taco}
                onChange={(e) => setSettings({ ...settings, taco: e.target.checked })}
                className="checkbox-custom"
              />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Tabela TACO</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Tabela Brasileira de Composição de Alimentos
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.tbca}
                onChange={(e) => setSettings({ ...settings, tbca: e.target.checked })}
                className="checkbox-custom"
              />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Tabela TBCA</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Tabela Brasileira de Composição de Alimentos - USP
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.ibge}
                onChange={(e) => setSettings({ ...settings, ibge: e.target.checked })}
                className="checkbox-custom"
              />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Tabela IBGE</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Tabela de Composição Nutricional dos Alimentos Consumidos no Brasil
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.usda}
                onChange={(e) => setSettings({ ...settings, usda: e.target.checked })}
                className="checkbox-custom"
              />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Tabela USDA</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  USDA National Nutrient Database for Standard Reference
                </p>
              </div>
            </label>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit">Salvar Alterações</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}