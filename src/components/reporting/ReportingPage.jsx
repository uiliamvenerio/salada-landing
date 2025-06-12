import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { RevenueOverview } from './graphs/RevenueOverview';
import { ClientMetrics } from './graphs/ClientMetrics';
import { RecipePerformance } from './graphs/RecipePerformance';
import { SalesBreakdown } from './graphs/SalesBreakdown';
import { DateRangePicker } from './DateRangePicker';

export function ReportingPage() {
  const [dateRange, setDateRange] = useState('7d');

  return (
    <main className="flex-1 min-w-0 overflow-auto">
      <div className="max-w-[1440px] mx-auto animate-fade-in">
        <div className="flex flex-wrap items-center justify-between gap-4 p-4">
          <h1 className="text-gray-900 dark:text-white text-2xl md:text-3xl font-bold">Reporting</h1>
          <DateRangePicker value={dateRange} onChange={setDateRange} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
          {/* Revenue Overview */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <h2 className="text-gray-900 dark:text-white text-lg font-semibold">Revenue Overview</h2>
            </CardHeader>
            <CardContent>
              <RevenueOverview dateRange={dateRange} />
            </CardContent>
          </Card>

          {/* Client Metrics */}
          <Card>
            <CardHeader>
              <h2 className="text-gray-900 dark:text-white text-lg font-semibold">Client Metrics</h2>
            </CardHeader>
            <CardContent>
              <ClientMetrics dateRange={dateRange} />
            </CardContent>
          </Card>

          {/* Recipe Performance */}
          <Card>
            <CardHeader>
              <h2 className="text-gray-900 dark:text-white text-lg font-semibold">Recipe Performance</h2>
            </CardHeader>
            <CardContent>
              <RecipePerformance dateRange={dateRange} />
            </CardContent>
          </Card>

          {/* Sales Breakdown */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <h2 className="text-gray-900 dark:text-white text-lg font-semibold">Sales Breakdown</h2>
            </CardHeader>
            <CardContent>
              <SalesBreakdown dateRange={dateRange} />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}