import React from 'react';
import { TrendingUp, Package, DollarSign, Users, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const FinanceSpecificDashboard: React.FC = () => {
  const router = useRouter();

  const dashboardCards = [
    {
      title: 'Finance Dashboard',
      description: 'ภาพรวมการเงินและบัญชีของฉัน',
      icon: DollarSign,
      color: 'bg-purple-500',
      path: '/finance/dashboard',
      stats: { pending: 25, revenue: '3.2M', profit: '1.1M' }
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Finance Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">ภาพรวมการเงินและบัญชีของฉัน</p>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dashboardCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(card.path)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`p-3 rounded-full ${card.color}`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{card.title}</h3>
                      <p className="text-sm text-gray-500">{card.description}</p>
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {Object.entries(card.stats).map(([key, value], statIndex) => (
                      <div key={statIndex} className="text-center">
                        <div className="text-xl font-bold text-gray-900">{value}</div>
                        <div className="text-xs text-gray-500 capitalize">{key}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">สรุปภาพรวมของฉัน</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">25</div>
            <div className="text-sm text-gray-500">รอดำเนินการ</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">฿3.2M</div>
            <div className="text-sm text-gray-500">รายได้</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">฿1.1M</div>
            <div className="text-sm text-gray-500">กำไร</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">34%</div>
            <div className="text-sm text-gray-500">อัตรากำไร</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceSpecificDashboard;
