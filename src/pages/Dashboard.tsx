import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardHeader from "@/components/DashboardHeader";
import EnhancedFarmOverview from "@/components/EnhancedFarmOverview";
import RealTimeSoilAnalysis from "@/components/RealTimeSoilAnalysis";
import EnhancedFertilizerForm from "@/components/EnhancedFertilizerForm";
import EnhancedFertilizerRecommendations from "@/components/EnhancedFertilizerRecommendations";

interface FormData {
  fieldName: string;
  fieldSize: string;
  sizeUnit: string;
  cropType: string;
  soilPH: string;
  nitrogen: string;
  phosphorus: string;
  potassium: string;
  soilType: string;
  temperature: string;
  humidity: string;
  soilMoisture: string;
}

interface EnhancedRecommendation {
  primaryFertilizer: {
    name: string;
    amount: string;
    reason: string;
    applicationMethod: string;
  };
  secondaryFertilizer: {
    name: string;
    amount: string;
    reason: string;
    applicationMethod: string;
  };
  organicOptions: Array<{
    name: string;
    amount: string;
    benefits: string;
    applicationTiming: string;
  }>;
  applicationTiming: {
    primary: string;
    secondary: string;
    organic: string;
  };
  costEstimate: {
    primary: string;
    secondary: string;
    organic: string;
    total: string;
  };
  soilConditionAnalysis: {
    phStatus: string;
    nutrientDeficiency: string[];
    moistureStatus: string;
    recommendations: string[];
  };
}

const Dashboard = () => {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [recommendations, setRecommendations] = useState<EnhancedRecommendation | null>(null);
  
  // Get user name from localStorage or use default
  const userName = localStorage.getItem('userName') || 'John Farmer';

  const generateEnhancedRecommendations = (data: FormData): EnhancedRecommendation => {
    const pH = parseFloat(data.soilPH);
    const nitrogen = parseFloat(data.nitrogen);
    const phosphorus = parseFloat(data.phosphorus);
    const potassium = parseFloat(data.potassium);
    const moisture = parseFloat(data.soilMoisture);
    const fieldSize = parseFloat(data.fieldSize);

    // Convert to hectares for calculations
    const convertToHectares = (size: number, unit: string): number => {
      switch (unit) {
        case 'acres': return size * 0.404686;
        case 'bigha': return size * 0.1338;
        case 'hectares':
        default: return size;
      }
    };

    const hectares = convertToHectares(fieldSize, data.sizeUnit);

    // Analyze soil conditions
    const phStatus = pH < 6.0 ? 'Acidic' : pH > 7.5 ? 'Alkaline' : 'Optimal';
    const moistureStatus = moisture < 40 ? 'Low' : moisture > 80 ? 'High' : 'Optimal';
    
    const nutrientDeficiency = [];
    if (nitrogen < 30) nutrientDeficiency.push('Nitrogen');
    if (phosphorus < 15) nutrientDeficiency.push('Phosphorus');
    if (potassium < 120) nutrientDeficiency.push('Potassium');

    // Generate recommendations based on crop type and soil conditions
    let primaryFertilizer, secondaryFertilizer;
    
    if (data.cropType === 'rice') {
      primaryFertilizer = {
        name: 'NPK 20-10-10',
        amount: `${Math.round(120 * hectares)} kg`,
        reason: 'Rice requires high nitrogen for tillering and grain filling',
        applicationMethod: 'Split application: 50% at transplanting, 25% at tillering, 25% at panicle initiation'
      };
      secondaryFertilizer = {
        name: 'Zinc Sulphate',
        amount: `${Math.round(25 * hectares)} kg`,
        reason: 'Zinc deficiency is common in rice, especially in alkaline soils',
        applicationMethod: 'Apply as basal dose before transplanting'
      };
    } else if (data.cropType === 'wheat') {
      primaryFertilizer = {
        name: 'DAP 18-46-0',
        amount: `${Math.round(100 * hectares)} kg`,
        reason: 'Wheat needs phosphorus for root development and grain formation',
        applicationMethod: 'Apply as basal dose at sowing time'
      };
      secondaryFertilizer = {
        name: 'Urea 46%',
        amount: `${Math.round(80 * hectares)} kg`,
        reason: 'Additional nitrogen for vegetative growth and protein content',
        applicationMethod: 'Split application: 50% at sowing, 50% at crown root initiation'
      };
    } else {
      primaryFertilizer = {
        name: 'NPK 19-19-19',
        amount: `${Math.round(100 * hectares)} kg`,
        reason: 'Balanced nutrition for general crop requirements',
        applicationMethod: 'Apply as basal dose and top dressing as needed'
      };
      secondaryFertilizer = {
        name: 'Organic Compost',
        amount: `${Math.round(2000 * hectares)} kg`,
        reason: 'Improves soil structure and provides slow-release nutrients',
        applicationMethod: 'Apply 2-3 weeks before planting and incorporate into soil'
      };
    }

    // Calculate costs in INR (Indian Rupees)
    const primaryCost = Math.round(hectares * 3750); // ₹3,750 per hectare
    const secondaryCost = Math.round(hectares * 2500); // ₹2,500 per hectare
    const organicCost = Math.round(hectares * 2000); // ₹2,000 per hectare
    const totalCost = primaryCost + secondaryCost + organicCost;

    return {
      primaryFertilizer,
      secondaryFertilizer,
      organicOptions: [
        {
          name: 'Vermicompost',
          amount: `${Math.round(1000 * hectares)} kg`,
          benefits: 'Rich in nutrients, improves soil structure and water retention',
          applicationTiming: 'Apply 3-4 weeks before planting'
        },
        {
          name: 'Neem Cake',
          amount: `${Math.round(200 * hectares)} kg`,
          benefits: 'Natural pest deterrent and slow-release nitrogen source',
          applicationTiming: 'Apply at the time of land preparation'
        },
        {
          name: 'Bone Meal',
          amount: `${Math.round(150 * hectares)} kg`,
          benefits: 'Excellent source of phosphorus and calcium',
          applicationTiming: 'Apply as basal dose before sowing'
        }
      ],
      applicationTiming: {
        primary: 'Apply 1-2 weeks before planting for optimal nutrient availability',
        secondary: 'Apply during active growth phase or as recommended for specific fertilizer',
        organic: 'Apply 3-4 weeks before planting to allow decomposition'
      },
      costEstimate: {
        primary: `₹${primaryCost.toLocaleString('en-IN')}`,
        secondary: `₹${secondaryCost.toLocaleString('en-IN')}`,
        organic: `₹${organicCost.toLocaleString('en-IN')}`,
        total: `₹${totalCost.toLocaleString('en-IN')}`
      },
      soilConditionAnalysis: {
        phStatus,
        nutrientDeficiency,
        moistureStatus,
        recommendations: [
          phStatus !== 'Optimal' ? `Adjust soil pH using ${pH < 6.0 ? 'lime' : 'sulfur'}` : 'Maintain current pH levels',
          moistureStatus === 'Low' ? 'Increase irrigation frequency' : moistureStatus === 'High' ? 'Improve drainage' : 'Maintain current moisture levels',
          nutrientDeficiency.length > 0 ? `Address ${nutrientDeficiency.join(', ')} deficiency` : 'Nutrient levels are adequate',
          'Regular soil testing every 6 months is recommended',
          'Consider crop rotation to maintain soil health'
        ].filter(Boolean)
      }
    };
  };

  const handleFormSubmit = (data: FormData) => {
    setFormData(data);
    const enhancedRecommendations = generateEnhancedRecommendations(data);
    setRecommendations(enhancedRecommendations);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader userName={userName} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Farm Dashboard</h1>
          <p className="text-gray-600">
            Comprehensive soil analysis and fertilizer recommendations powered by real-time data
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="soil-analysis">Soil Analysis</TabsTrigger>
            <TabsTrigger value="recommendations">Fertilizer Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <EnhancedFarmOverview />
          </TabsContent>

          <TabsContent value="soil-analysis" className="space-y-6">
            <RealTimeSoilAnalysis />
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <EnhancedFertilizerForm onSubmit={handleFormSubmit} />
            {recommendations && formData && (
              <EnhancedFertilizerRecommendations 
                recommendations={recommendations}
                formData={formData}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;