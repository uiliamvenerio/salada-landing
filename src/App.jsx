import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import { LoginPage } from './components/auth/LoginPage';
import { Header } from './components/ui/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import { ClientsPage } from './components/clients/ClientsPage';
import { AddClientPage } from './components/clients/AddClientPage';
import { IngredientsPage } from './components/ingredients/IngredientsPage';
import { RecipesPage } from './components/recipes/RecipesPage';
import { ReportingPage } from './components/reporting/ReportingPage';
import { ProfilePage } from './components/profile/ProfilePage';
import { SettingsPage } from './components/settings/SettingsPage';
import { MobileMenu } from './components/ui/MobileMenu';

export default function App() {
  const { user, loading, isAuthenticated } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isAddingClient, setIsAddingClient] = useState(false);

  const handleMenuItemClick = (page) => {
    setCurrentPage(page);
    setIsSidebarOpen(false);
    setIsAddingClient(false);
  };

  const handleAddClient = () => {
    setIsAddingClient(true);
  };

  const handleBackToClients = () => {
    setIsAddingClient(false);
  };

  const handleLogin = (userData) => {
    // O hook useAuth já gerencia o estado do usuário
    console.log('Usuário logado:', userData);
  };

  const renderPage = () => {
    if (currentPage === 'clients' && isAddingClient) {
      return <AddClientPage onBack={handleBackToClients} />;
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'clients':
        return <ClientsPage onAddClient={handleAddClient} />;
      case 'ingredients':
        return <IngredientsPage />;
      case 'recipes':
        return <RecipesPage />;
      case 'reporting':
        return <ReportingPage />;
      case 'profile':
        return <ProfilePage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  // Mostrar tela de login se não estiver autenticado
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Mostrar aplicação principal se estiver autenticado
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg dark:text-gray-100 transition-colors duration-200">
      <Header 
        onMenuClick={() => setIsSidebarOpen(true)} 
        onNavigate={setCurrentPage}
      />
      <div className="max-w-[1440px] mx-auto">
        <div className="flex">
          <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)}
            currentPage={currentPage}
            onMenuItemClick={handleMenuItemClick}
          />
          {renderPage()}
        </div>
      </div>
      <MobileMenu 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        currentPage={currentPage}
        onNavigate={handleMenuItemClick}
      />
      <Toaster position="top-right" />
    </div>
  );
}