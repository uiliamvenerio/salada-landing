import React from 'react';
import { GeneralSettings } from './sections/GeneralSettings';
import { SecuritySettings } from './sections/SecuritySettings';
import { IntegrationSettings } from './sections/IntegrationSettings';
import { NutritionalTablesSettings } from './sections/NutritionalTablesSettings';

export function SettingsPage() {
  return (
    <main className="flex-1 min-w-0 overflow-auto">
      <div className="max-w-[1440px] mx-auto animate-fade-in">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <h1 className="text-gray-900 dark:text-white text-2xl md:text-3xl font-bold">Settings</h1>
        </div>

        <div className="p-4 space-y-4">
          <GeneralSettings />
          <SecuritySettings />
          <NutritionalTablesSettings />
          <IntegrationSettings />
        </div>
      </div>
    </main>
  );
}