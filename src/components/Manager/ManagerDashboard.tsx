import React from 'react';
import { TrendingUp, Package, DollarSign, Users, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ManagerDashboard: React.FC = () => {
  const router = useRouter();

  const dashboardCards = [
    {
      title: 'Sale Dashboard',
      description: 'ภาพรวมยอดขายและผลงานเซลล์',
      icon: TrendingUp,
      color: 'bg-blue-500',
      path: '/manager/sale',
      stats: { contacts: 156, pending: 23, revenue: '3.4M' }
    },
    {
      title: 'CS Dashboard', 
      description: 'ภาพรวมงานฝ่าย Customer Service',
      icon: Package,
      color: 'bg-green-500',
      path: '/manager/cs',
      stats: { requests: 45, quotations: 38, accepted: 28 }
    },
    {
      title: 'Account Dashboard',
      description: 'ภาพรวมการเงินและบัญชี',
      icon: DollarSign,
      color: 'bg-purple-500', 
      path: '/manager/account',
      stats: { pending: 25, revenue: '3.2M', profit: '1.1M' }
    },
    {
      title: 'HR Dashboard',
      description: 'ภาพรวมการจัดการทรัพยากรบุคคล',
      icon: Users,
      color: 'bg-orange-500',
      path: '/manager/hr',
      stats: { commission: '450K', employees: 12, shipments: 156 }
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">ภาพรวมการจัดการทั้ง 4 แผนก</p>
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
               
                </div>
                
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats Overview */}
 
    </div>
  );
};

export default ManagerDashboard;
