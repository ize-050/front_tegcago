import React, { useEffect, useState } from 'react';
import { ResponsiveLine } from '@nivo/line';
import axios from '../../../axios';


interface ChartData {
  id: string;
  color: string;
  data: {
    x: string;
    y: number;
  }[];
}

interface ShipmentBySalesChartProps {
  selectedYear: number;
  selectedMonth: string | number;
  selectedSalesperson: string;
}

const ShipmentBySalesChart: React.FC<ShipmentBySalesChartProps> = ({
  selectedYear,
  selectedMonth,
  selectedSalesperson
}) => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShipmentData();
  }, [selectedYear, selectedMonth, selectedSalesperson]);

  const fetchShipmentData = async () => {
    try {
      setLoading(true);
      
      // Use the same token as other working services

      const baseURL = process.env.NEXT_PUBLIC_URL_API || 'http://localhost:3000';
      
      console.log('=== ShipmentBySalesChart Debug ===');
      console.log('Filters:', { selectedYear, selectedMonth, selectedSalesperson });
      console.log('API URL:', `${baseURL}/manager/dashboard/sale/sales-chart`);
   
      // Call the correct API endpoint for sales revenue data
      const response = await axios.get(`${baseURL}/manager/dashboard/sale/sales-chart`, {
        headers: {
          'Content-Type': 'application/json'
        },
        params: {
          year: parseInt(selectedYear.toString()),
          startDate: `${selectedYear}-01-01`,
          endDate: `${selectedYear}-12-31`
        }
      });

      console.log('Full API Response:', response.data);
      
      if (response.data.success && response.data.data) {
        const apiData = response.data.data.chartData || [];
        console.log('Chart Data from API:', apiData);
        console.log('Chart Data Length:', apiData.length);
        
        if (Array.isArray(apiData)) {
          apiData.forEach((series: any, index: number) => {
            console.log(`Series ${index}:`, series);
            if (series.data) {
              console.log(`Series ${index} data points:`, series.data.length);
              series.data.forEach((point: any, pointIndex: number) => {
                console.log(`  Point ${pointIndex}:`, point);
              });
            }
          });
        }
        
        setChartData(apiData);
      } else {
        console.error('API Error - Success:', response.data.success);
        console.error('API Error - Message:', response.data.message);
        console.error('API Error - Data:', response.data.data);
        setChartData([]);
      }
    } catch (error: any) {
      console.error('Error fetching shipment data:', error);
      if (error.response) {
        console.error('Error Response:', error.response.data);
        console.error('Error Status:', error.response.status);
      }
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate summary statistics
  const totalShipments = chartData.reduce((total, series) => {
    return total + series.data.reduce((seriesTotal, point) => seriesTotal + point.y, 0);
  }, 0);

  const totalDataPoints = chartData.reduce((total, series) => total + series.data.length, 0);
  const averageShipments = totalDataPoints > 0 ? Math.round(totalShipments / totalDataPoints) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  // Show no data message if no chart data
  if (!loading && (!chartData || chartData.length === 0)) {
    return (
      <div className="w-full">
        <h3 className="text-xl font-semibold mb-4">
          ยอดขายแยกตามเซลล์
        </h3>
        <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-gray-500 text-lg mb-2">ไม่มีข้อมูลยอดขาย</div>
            <div className="text-gray-400 text-sm">ลองเปลี่ยนตัวกรองหรือช่วงเวลาที่เลือก</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">
          ยอดขายแยกตามเซลล์
        </h3>
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
          <h4 className="font-semibold text-blue-800">รวม Shipments</h4>
          <p className="text-2xl font-bold text-blue-600">
            {totalShipments.toLocaleString()}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-800">เซลล์ที่มีข้อมูล</h4>
          <p className="text-2xl font-bold text-green-600">
            {chartData.length}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-semibold text-purple-800">เฉลี่ยต่อเดือน</h4>
          <p className="text-2xl font-bold text-purple-600">
            {averageShipments.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShipmentBySalesChart;
