import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Card } from '../ui/Card';
import { db } from '../../lib/supabase';
import toast from 'react-hot-toast';

const DetailItem = ({ label, value }) => (
  <div className="space-y-1">
    <dt className="text-sm text-gray-500 dark:text-gray-400">{label}</dt>
    <dd className="text-sm font-medium text-gray-900 dark:text-white">{value || 'Não informado'}</dd>
  </div>
);

export function ClientDetailsModal({ client, onClose, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(client || {});
  const [loading, setLoading] = useState(false);

  if (!client) return null;

  const handleEdit = () => {
    setFormData(client);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(client);
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.email) {
      toast.error('Por favor, preencha os campos obrigatórios');
      return;
    }

    setLoading(true);

    try {
      const updatedClient = await db.clients.update(client.id, formData);
      onUpdate(updatedClient);
      setIsEditing(false);
      toast.success('Cliente atualizado com sucesso!');
    } catch (error) {
      console.error('Error updating client:', error);
      toast.error('Erro ao atualizar cliente');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, logotipo_imagem: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

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
                {(isEditing ? formData.logotipo_imagem : client.logotipo_imagem) ? (
                  <img
                    src={isEditing ? formData.logotipo_imagem : client.logotipo_imagem}
                    alt={isEditing ? formData.nome : client.nome}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary text-lg font-medium">
                      {(isEditing ? formData.nome : client.nome).charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
                    {isEditing ? 'Editar Cliente' : client.nome}
                  </Dialog.Title>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {isEditing ? 'Atualize as informações do cliente' : client.email}
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
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-6">
                  {/* Informações Básicas */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Informações Básicas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Nome *
                        </label>
                        <input
                          type="text"
                          value={formData.nome || ''}
                          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          CNPJ
                        </label>
                        <input
                          type="text"
                          value={formData.cnpj || ''}
                          onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={formData.email || ''}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Telefone Principal *
                        </label>
                        <input
                          type="tel"
                          value={formData.fone_1 || ''}
                          onChange={(e) => setFormData({ ...formData, fone_1: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Telefone Secundário
                        </label>
                        <input
                          type="tel"
                          value={formData.fone_2 || ''}
                          onChange={(e) => setFormData({ ...formData, fone_2: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Status
                        </label>
                        <select
                          value={formData.status || 'active'}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        >
                          <option value="active">Ativo</option>
                          <option value="inactive">Inativo</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Endereço */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Endereço</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Logradouro
                        </label>
                        <input
                          type="text"
                          value={formData.endereco_logradouro || ''}
                          onChange={(e) => setFormData({ ...formData, endereco_logradouro: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Número
                        </label>
                        <input
                          type="text"
                          value={formData.endereco_numero || ''}
                          onChange={(e) => setFormData({ ...formData, endereco_numero: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Complemento
                        </label>
                        <input
                          type="text"
                          value={formData.endereco_complemento || ''}
                          onChange={(e) => setFormData({ ...formData, endereco_complemento: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Bairro
                        </label>
                        <input
                          type="text"
                          value={formData.endereco_bairro || ''}
                          onChange={(e) => setFormData({ ...formData, endereco_bairro: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Cidade
                        </label>
                        <input
                          type="text"
                          value={formData.endereco_cidade || ''}
                          onChange={(e) => setFormData({ ...formData, endereco_cidade: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          UF
                        </label>
                        <input
                          type="text"
                          value={formData.endereco_uf || ''}
                          onChange={(e) => setFormData({ ...formData, endereco_uf: e.target.value })}
                          maxLength={2}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          País
                        </label>
                        <input
                          type="text"
                          value={formData.endereco_pais || ''}
                          onChange={(e) => setFormData({ ...formData, endereco_pais: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Responsável Legal */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Responsável Legal</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Nome
                        </label>
                        <input
                          type="text"
                          value={formData.responsavel_legal_nome || ''}
                          onChange={(e) => setFormData({ ...formData, responsavel_legal_nome: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          CPF
                        </label>
                        <input
                          type="text"
                          value={formData.responsavel_legal_cpf || ''}
                          onChange={(e) => setFormData({ ...formData, responsavel_legal_cpf: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.responsavel_legal_email || ''}
                          onChange={(e) => setFormData({ ...formData, responsavel_legal_email: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Telefone
                        </label>
                        <input
                          type="tel"
                          value={formData.responsavel_legal_fone || ''}
                          onChange={(e) => setFormData({ ...formData, responsavel_legal_fone: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Responsável Técnico */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Responsável Técnico</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Nome
                        </label>
                        <input
                          type="text"
                          value={formData.responsavel_tecnico_nome || ''}
                          onChange={(e) => setFormData({ ...formData, responsavel_tecnico_nome: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          CPF
                        </label>
                        <input
                          type="text"
                          value={formData.responsavel_tecnico_cpf || ''}
                          onChange={(e) => setFormData({ ...formData, responsavel_tecnico_cpf: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.responsavel_tecnico_email || ''}
                          onChange={(e) => setFormData({ ...formData, responsavel_tecnico_email: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Telefone
                        </label>
                        <input
                          type="tel"
                          value={formData.responsavel_tecnico_fone || ''}
                          onChange={(e) => setFormData({ ...formData, responsavel_tecnico_fone: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Observações e Logotipo */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Observações
                      </label>
                      <textarea
                        value={formData.observacoes || ''}
                        onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Logotipo
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-hover text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer - Edit Mode */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-hover rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-light disabled:opacity-50 rounded-lg transition-colors"
                  >
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="p-6 space-y-6">
                  {/* Informações Básicas */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Informações Básicas</h3>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <DetailItem label="Nome" value={client.nome} />
                      <DetailItem label="CNPJ" value={client.cnpj} />
                      <DetailItem label="Email" value={client.email} />
                      <DetailItem label="Telefone Principal" value={client.fone_1} />
                      <DetailItem label="Telefone Secundário" value={client.fone_2} />
                      <DetailItem 
                        label="Status" 
                        value={client.status === 'active' ? 'Ativo' : 'Inativo'} 
                      />
                    </dl>
                  </div>

                  {/* Endereço */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Endereço</h3>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <DetailItem label="Logradouro" value={client.endereco_logradouro} />
                      <DetailItem label="Número" value={client.endereco_numero} />
                      <DetailItem label="Complemento" value={client.endereco_complemento} />
                      <DetailItem label="Bairro" value={client.endereco_bairro} />
                      <DetailItem label="Cidade" value={client.endereco_cidade} />
                      <DetailItem label="UF" value={client.endereco_uf} />
                      <DetailItem label="País" value={client.endereco_pais} />
                    </dl>
                  </div>

                  {/* Responsável Legal */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Responsável Legal</h3>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <DetailItem label="Nome" value={client.responsavel_legal_nome} />
                      <DetailItem label="CPF" value={client.responsavel_legal_cpf} />
                      <DetailItem label="Email" value={client.responsavel_legal_email} />
                      <DetailItem label="Telefone" value={client.responsavel_legal_fone} />
                    </dl>
                  </div>

                  {/* Responsável Técnico */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Responsável Técnico</h3>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <DetailItem label="Nome" value={client.responsavel_tecnico_nome} />
                      <DetailItem label="CPF" value={client.responsavel_tecnico_cpf} />
                      <DetailItem label="Email" value={client.responsavel_tecnico_email} />
                      <DetailItem label="Telefone" value={client.responsavel_tecnico_fone} />
                    </dl>
                  </div>

                  {/* Observações */}
                  {client.observacoes && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Observações</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-dark-hover p-4 rounded-lg">
                        {client.observacoes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer - View Mode */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 dark:border-gray-800">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-hover rounded-lg transition-colors"
                  >
                    Fechar
                  </button>
                  <button
                    onClick={handleEdit}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-light rounded-lg transition-colors"
                  >
                    Editar Cliente
                  </button>
                </div>
              </>
            )}
          </Card>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}