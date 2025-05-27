'use client';

import React from 'react';

import HRDashboardComponent from '@/components/hr/dashboard/DashboardComponent';
import { Metadata } from 'next';



export default function HRDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">HR Dashboard</h1>
      <div className="p-6 bg-white rounded-lg shadow-md">
        <HRDashboardComponent />
      </div>
    </div>
  );
}
