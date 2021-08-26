import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from 'src/layouts/DashboardLayout';
import MainLayout from 'src/layouts/MainLayout';
import ChargerView from 'src/views/charger/CreateCharger';
import CustomerListView from 'src/views/customer/CustomerListView';
import DashboardView from 'src/views/reports/DashboardView';
import TarifView from 'src/views/tarif/TarifView';

const routes = [
  {
    path: 'app',
    element: <DashboardLayout />,
    children: [
      { path: 'charger', element: <ChargerView /> },
      { path: 'customers', element: <CustomerListView /> },
      { path: 'dashboard', element: <DashboardView /> },
      { path: 'tarif', element: <TarifView /> },
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/', element: <Navigate to="/app/dashboard" /> },
    ]
  }
];

export default routes;
