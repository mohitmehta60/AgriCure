import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Droplets, Thermometer, Activity, Leaf, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchThingSpeakData, getMockThingSpeakData, ThingSpeakData } from "@/services/thingSpeakService";

interface Farm {
  id: string;
  name: string;
  size: number;
  unit: string;
  lastUpdated: string;
  soilHealth: number;
}

interface RecommendationLog {
  id: string;
  farmName: string;
  timestamp: string;
  primaryFertilizer: string;
  secondaryFertilizer: string;
  status: 'applied' | 'pending' | 'scheduled';
}

const EnhancedFarmOverview = () => {
  const [realTimeData, setRealTimeData] = useState<ThingSpeakData | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock farms data
  const farms: Farm[] = [
    { id: '1', name: 'North Field', size: 5.2, unit: 'hectares', lastUpdated: '2 hours ago', soilHealth: 85 },
    { id: '2', name: 'South Field', size: 3.8, unit: 'hectares', lastUpdated: '4 hours ago', soilHealth: 78 },
    { id: '3', name: 'East Field', size: 2.1, unit: 'hectares', lastUpdated: '1 hour ago', soilHealth: 92 }
  ];

  // Mock recommendation logs
  const recommendationLogs: RecommendationLog[] = [
    {
      id: '1',
      farmName: 'North Field',
      timestamp: '2025-01-27 14:30',
      primaryFertilizer: 'NPK 20-10-10',
      secondaryFertilizer: 'Phosphate Rock',
      status: 'applied'
    },
    {
      id: '2',
      farmName: 'South Field',
      timestamp: '2025-01-26 09:15',
      primaryFertilizer: 'Urea 46%',
      secondaryFertilizer: 'Compost',
      status: 'pending'
    },
    {
      id: '3',
      farmName: 'East Field',
      timestamp: '2025-01-25 16:45',
      primaryFertilizer: 'DAP 18-46-0',
      secondaryFertilizer: 'Bone Meal',
      status: 'scheduled'
    }
  ];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchThingSpeakData();
        if (data) {
          setRealTimeData(data);
        } else {
          // Fallback to mock data
          setRealTimeData(getMockThingSpeakData());
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setRealTimeData(getMockThingSpeakData());
      } finally {
        setLoading(false);
      }
    };

    loadData();
    // Refresh data every 5 minutes
    const interval = setInterval(loadData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getHealthScore = (data: ThingSpeakData) => {
    if (!data) return 0;
    
    let score = 0;
    const { soilPH, nitrogen, phosphorus, potassium, soilMoisture } = data;
    
    // pH scoring (optimal 6.0-7.5)
    if (soilPH >= 6.0 && soilPH <= 7.5) score += 20;
    else if (soilPH >= 5.5 && soilPH <= 8.0) score += 15;
    else score += 5;
    
    // Nutrient scoring
    if (nitrogen >= 40) score += 20;
    else if (nitrogen >= 20) score += 15;
    else score += 5;
    
    if (phosphorus >= 20) score += 20;
    else if (phosphorus >= 10) score += 15;
    else score += 5;
    
    if (potassium >= 150) score += 20;
    else if (potassium >= 100) score += 15;
    else score += 5;
    
    if (soilMoisture >= 60 && soilMoisture <= 80) score += 20;
    else if (soilMoisture >= 40 && soilMoisture <= 90) score += 15;
    else score += 5;
    
    return Math.min(score, 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const healthScore = realTimeData ? getHealthScore(realTimeData) : 0;

  return (
    <div className="space-y-6">
      {/* Real-time Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Overall Soil Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-grass-600" />
              <span className="text-2xl font-bold">{healthScore}%</span>
            </div>
            <Progress value={healthScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Soil Moisture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Droplets className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold">{realTimeData?.soilMoisture.toFixed(1)}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Temperature</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Thermometer className="h-5 w-5 text-orange-600" />
              <span className="text-2xl font-bold">{realTimeData?.temperature.toFixed(1)}°C</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Humidity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Droplets className="h-5 w-5 text-cyan-600" />
              <span className="text-2xl font-bold">{realTimeData?.humidity.toFixed(1)}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* NPK Levels */}
      <Card>
        <CardHeader>
          <CardTitle>NPK Levels (Real-time)</CardTitle>
          <CardDescription>Current nutrient levels from sensors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Nitrogen (N)</span>
                <span className="text-sm text-gray-600">{realTimeData?.nitrogen.toFixed(1)} mg/kg</span>
              </div>
              <Progress value={(realTimeData?.nitrogen || 0) / 100 * 100} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Phosphorus (P)</span>
                <span className="text-sm text-gray-600">{realTimeData?.phosphorus.toFixed(1)} mg/kg</span>
              </div>
              <Progress value={(realTimeData?.phosphorus || 0) / 50 * 100} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Potassium (K)</span>
                <span className="text-sm text-gray-600">{realTimeData?.potassium.toFixed(1)} ppm</span>
              </div>
              <Progress value={(realTimeData?.potassium || 0) / 200 * 100} className="h-2" />
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            Last updated: {realTimeData ? new Date(realTimeData.timestamp).toLocaleString() : 'N/A'}
          </div>
        </CardContent>
      </Card>

      {/* Registered Farms */}
      <Card>
        <CardHeader>
          <CardTitle>Registered Farms</CardTitle>
          <CardDescription>Overview of all your farm properties</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {farms.map((farm) => (
              <div key={farm.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{farm.name}</h4>
                  <Badge variant="secondary">{farm.soilHealth}% Health</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  Size: {farm.size} {farm.unit}
                </p>
                <p className="text-xs text-gray-500">
                  Last updated: {farm.lastUpdated}
                </p>
                <Progress value={farm.soilHealth} className="mt-2 h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendation History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Fertilizer Recommendation History</span>
          </CardTitle>
          <CardDescription>Past recommendations and their application status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendationLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold">{log.farmName}</h4>
                    <Badge className={getStatusColor(log.status)}>
                      {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    Primary: {log.primaryFertilizer} | Secondary: {log.secondaryFertilizer}
                  </p>
                  <p className="text-xs text-gray-500">{log.timestamp}</p>
                </div>
                <Leaf className="h-5 w-5 text-grass-600" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedFarmOverview;