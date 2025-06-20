import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { ClientFilters } from './ClientFilters';
import { ClientTable } from './ClientTable';
import { AddClientModal } from './AddClientModal';
import { db } from '../../lib/supabase';
import toast from 'react-hot-toast';

export function ClientsPage({ onAddClient }) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    sortBy: 'name'
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await db.clients.getAll();
      setClients(data);
    } catch (error) {
      console.error('Error loading clients:', error);
      toast.error('Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = async (newClient) => {
    try {
      const client = await db.clients.create(newClient);
      setClients([client, ...clients]);
      setIsModalOpen(false);
      toast.success('Cliente adicionado com sucesso!');
    } catch (error) {
      console.error('Error adding client:', error);
      toast.error('Erro ao adicionar cliente');
    }
  };

  const handleUpdateClient = (updatedClient) => {
    setClients(clients.map(client => 
      client.id === updatedClient.id ? updatedClient : client
    ));
  };

  const handleDeleteClient = async (id) => {
    try {
      await db.clients.delete(id);
      setClients(clients.filter(client => client.id !== id));
      toast.success('Cliente excluído com sucesso!');
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error('Erro ao excluir cliente');
    }
  };

  const filteredClients = clients.filter(client => {
    if (filters.search) {
      const search = filters.search.toLowerCase();
      return (
        client.nome.toLowerCase().includes(search) ||
        client.email.toLowerCase().includes(search) ||
        client.responsavel_legal_nome?.toLowerCase().includes(search)
      );
    }
    if (filters.status !== 'all' && client.status !== filters.status) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    return a.nome.localeCompare(b.nome);
  });

  if (loading) {
    return (
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="max-w-[1440px] mx-auto animate-fade-in">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500 dark:text-gray-400">Carregando clientes...</div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 min-w-0 overflow-auto">
      <div className="max-w-[1440px] mx-auto animate-fade-in">
        <div className="flex flex-wrap items-center justify-between gap-4 p-4">
          <h1 className="text-gray-900 dark:text-white text-2xl md:text-3xl font-bold">Clientes</h1>
          <Button onClick={() => setIsModalOpen(true)}>
            Novo Cliente
          </Button>
        </div>

        <div className="p-4">
          <Card>
            <CardHeader>
              <ClientFilters filters={filters} onChange={setFilters} />
            </CardHeader>
            <CardContent>
              <ClientTable 
                clients={filteredClients} 
                onUpdate={handleUpdateClient}
                onDelete={handleDeleteClient}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <AddClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddClient}
      />
    </main>
  );
}