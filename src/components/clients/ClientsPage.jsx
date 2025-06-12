import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { ClientFilters } from './ClientFilters';
import { ClientTable } from './ClientTable';

const initialClients = [
  {
    id: 1,
    name: 'Lar Nossa Senhora dos Navegantes',
    phone: '(51) 98765-4321',
    address: 'Rua das Flores, 123',
    responsible: 'João Silva',
    notes: 'Cliente preferencial',
    avatar: 'https://grupolibano.com.br/wp-content/uploads/2023/12/lar-idosos-alto-de-pinheiros-fachada.png'
  },
  {
    id: 2,
    name: 'Escolinha Amigos do Mar',
    phone: '(51) 91234-5678',
    address: 'Av. Principal, 456',
    responsible: 'Maria Santos',
    notes: 'Atendimento especial',
    avatar: 'https://images.tcdn.com.br/img/img_prod/1271663/180_toque_e_sinta_meus_amigos_do_mar_1165_1_5352258a8dad609f58c2c1bf309d95a2.jpg'
  }
];

export function ClientsPage({ onAddClient }) {
  const [clients, setClients] = useState(initialClients);
  const [filters, setFilters] = useState({
    search: '',
    sortBy: 'name'
  });

  const handleAddClient = (newClient) => {
    setClients([...clients, newClient]);
  };

  const filteredClients = clients.filter(client => {
    if (filters.search) {
      const search = filters.search.toLowerCase();
      return (
        client.name.toLowerCase().includes(search) ||
        client.phone.toLowerCase().includes(search) ||
        client.responsible?.toLowerCase().includes(search)
      );
    }
    return true;
  }).sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  return (
    <main className="flex-1 min-w-0 overflow-auto">
      <div className="max-w-[1440px] mx-auto animate-fade-in">
        <div className="flex flex-wrap items-center justify-between gap-4 p-4">
          <h1 className="text-gray-900 dark:text-white text-2xl md:text-3xl font-bold">Clientes</h1>
          <Button onClick={onAddClient}>
            Novo Cliente
          </Button>
        </div>

        <div className="p-4">
          <Card>
            <CardHeader>
              <ClientFilters filters={filters} onChange={setFilters} />
            </CardHeader>
            <CardContent>
              <ClientTable clients={filteredClients} />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}