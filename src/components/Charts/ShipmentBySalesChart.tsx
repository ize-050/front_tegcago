import React, { useEffect, useState } from 'react';
import { ResponsiveLine } from '@nivo/line';
import axios from 'axios';

interface ShipmentData {
  sales_id: string;
  d_route: string;
  d_transport: string;
  d_term: string;
  shipment_count: number;
  month_year: string;
}

interface ChartData {
  id: string;
  color: string;
  data: {
    x: string;
    y: number;
  }[];
}

const ShipmentBySalesChart: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedShipmentType, setSelectedShipmentType] = useState<'route' | 'transport' | 'term'>('route');

  // สีสำหรับแต่ละเซลล์
  const salesColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];

  useEffect(() => {
    fetchShipmentData();
  }, [selectedShipmentType]);

  const fetchShipmentData = async () => {
    try {
      setLoading(true);
      
      // Call the actual API endpoint
      const response = await axios.get('/api/dashboard/sale/shipment-chart', {
        params: {
          year: new Date().getFullYear(),
          salespersonId: undefined // ดึงข้อมูลทุกเซลล์
        }
      });

      if (response.data.statusCode === 200) {
        const apiData = response.data.data;
        const processedData = processDataForChart(apiData);
        setChartData(processedData);
      } else {
        console.error('API Error:', response.data.message);
        // Fallback to mock data if API fails
        const mockData: ShipmentData[] = [
          { sales_id: "", d_route: "import", d_transport: "SEA", d_term: "ALL IN", shipment_count: 1, month_year: "2025-03" },
          { sales_id: "b594a33b-04e8-4292-9284-87c52c6572d6", d_route: "import", d_transport: "SEA", d_term: "ALL IN", shipment_count: 3, month_year: "2025-03" },
          { sales_id: "", d_route: "import", d_transport: "SEA", d_term: "EXW", shipment_count: 15, month_year: "2025-05" },
          { sales_id: "b594a33b-04e8-4292-9284-87c52c6572d6", d_route: "import", d_transport: "SEA", d_term: "EXW", shipment_count: 8, month_year: "2025-05" }
        ];
        const processedData = processDataForChart(mockData);
        setChartData(processedData);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching shipment data:', error);
      
      // Fallback to mock data
      const mockData: ShipmentData[] = [
        { sales_id: "", d_route: "import", d_transport: "SEA", d_term: "ALL IN", shipment_count: 1, month_year: "2025-03" },
        { sales_id: "b594a33b-04e8-4292-9284-87c52c6572d6", d_route: "import", d_transport: "SEA", d_term: "ALL IN", shipment_count: 3, month_year: "2025-03" },
        { sales_id: "", d_route: "import", d_transport: "SEA", d_term: "EXW", shipment_count: 15, month_year: "2025-05" },
        { sales_id: "b594a33b-04e8-4292-9284-87c52c6572d6", d_route: "import", d_transport: "SEA", d_term: "EXW", shipment_count: 8, month_year: "2025-05" }
      ];
      const processedData = processDataForChart(mockData);
      setChartData(processedData);
      setLoading(false);
    }
  };

  const processDataForChart = (data: ShipmentData[]): ChartData[] => {
    // Group data by sales and shipment type
    const groupedData: { [key: string]: { [key: string]: number } } = {};

    data.forEach(item => {
      const salesKey = item.sales_id || 'ไม่ระบุเซลล์';
      const shipmentTypeValue = getShipmentTypeValue(item);
      const key = `${salesKey}_${shipmentTypeValue}`;

      if (!groupedData[key]) {
        groupedData[key] = {};
      }

      if (!groupedData[key][item.month_year]) {
        groupedData[key][item.month_year] = 0;
      }

      groupedData[key][item.month_year] += item.shipment_count;
    });

    // Convert to chart format
    const chartData: ChartData[] = [];
    let colorIndex = 0;

    Object.keys(groupedData).forEach(key => {
      const [salesId, shipmentType] = key.split('_');
      const salesName = getSalesName(salesId);
      
      const lineData = {
        id: `${salesName} - ${shipmentType}`,
        color: salesColors[colorIndex % salesColors.length],
        data: Object.keys(groupedData[key])
          .sort()
          .map(month => ({
            x: formatMonthYear(month),
            y: groupedData[key][month]
          }))
      };

      chartData.push(lineData);
      colorIndex++;
    });

    return chartData;
  };

  const getShipmentTypeValue = (item: ShipmentData): string => {
    switch (selectedShipmentType) {
      case 'route':
        return item.d_route;
      case 'transport':
        return item.d_transport;
      case 'term':
        return item.d_term;
      default:
        return item.d_route;
    }
  };

  const getSalesName = (salesId: string): string => {
    if (!salesId) return 'ไม่ระบุเซลล์';
    
    // Mock sales names - ในการใช้งานจริงควรดึงจากฐานข้อมูล
    const salesNames: { [key: string]: string } = {
      'ac735f65-b476-4e4b-9b96-fd0094bc2005': 'เซลล์ A',
      'b594a33b-04e8-4292-9284-87c52c6572d6': 'เซลล์ B'
    };

    return salesNames[salesId] || `เซลล์ ${salesId.substring(0, 8)}`;
  };

  const formatMonthYear = (monthYear: string): string => {
    const [year, month] = monthYear.split('-');
    const monthNames = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">
          ปริมาณ Shipment ที่ดูแลโดยแต่ละเซลล์ (แยกตามประเภท {selectedShipmentType.toUpperCase()})
        </h3>
        
        {/* Shipment Type Selector */}
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setSelectedShipmentType('route')}
            className={`px-4 py-2 rounded-lg ${
              selectedShipmentType === 'route'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Route
          </button>
          <button
            onClick={() => setSelectedShipmentType('transport')}
            className={`px-4 py-2 rounded-lg ${
              selectedShipmentType === 'transport'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Transport
          </button>
          <button
            onClick={() => setSelectedShipmentType('term')}
            className={`px-4 py-2 rounded-lg ${
              selectedShipmentType === 'term'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Term
          </button>
        </div>
      </div>

      <div style={{ height: '400px' }}>
        <ResponsiveLine
          data={chartData}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: false,
            reverse: false
          }}
          yFormat=" >-.2f"
          curve="catmullRom"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            legend: 'เดือน',
            legendOffset: 36,
            legendPosition: 'middle'
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'จำนวน Shipment',
            legendOffset: -40,
            legendPosition: 'middle'
          }}
          pointSize={8}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabelYOffset={-12}
          enableSlices="x"
          useMesh={true}
          legends={[
            {
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: 'left-to-right',
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: 'circle',
              symbolBorderColor: 'rgba(0, 0, 0, .5)',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemBackground: 'rgba(0, 0, 0, .03)',
                    itemOpacity: 1
                  }
                }
              ]
            }
          ]}
          theme={{
            axis: {
              ticks: {
                text: {
                  fontSize: 12,
                  fill: '#666'
                }
              },
              legend: {
                text: {
                  fontSize: 14,
                  fill: '#333',
                  fontWeight: 600
                }
              }
            },
            grid: {
              line: {
                stroke: '#e0e0e0',
                strokeWidth: 1
              }
            },
            legends: {
              text: {
                fontSize: 12,
                fill: '#333'
              }
            }
          }}
        />
      </div>

      {/* Summary Statistics */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800">Total Shipments</h4>
          <p className="text-2xl font-bold text-blue-600">
            {chartData.reduce((total, line) => 
              total + line.data.reduce((sum, point) => sum + point.y, 0), 0
            )}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-800">Active Sales</h4>
          <p className="text-2xl font-bold text-green-600">
            {new Set(chartData.map(line => line.id.split(' - ')[0])).size}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-semibold text-purple-800">Shipment Types</h4>
          <p className="text-2xl font-bold text-purple-600">
            {new Set(chartData.map(line => line.id.split(' - ')[1])).size}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShipmentBySalesChart;
