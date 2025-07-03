import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, AlertCircle, DollarSign, Calendar, Droplets, Thermometer } from "lucide-react";

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

interface EnhancedFertilizerRecommendationsProps {
  recommendations: EnhancedRecommendation | null;
  formData: FormData | null;
}

const EnhancedFertilizerRecommendations = ({ recommendations, formData }: EnhancedFertilizerRecommendationsProps) => {
  if (!recommendations || !formData) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Recommendations Yet</h3>
          <p className="text-gray-600 text-center">
            Please complete the enhanced fertilizer form to get detailed recommendations.
          </p>
        </CardContent>
      </Card>
    );
  }

  const convertToHectares = (size: number, unit: string): number => {
    switch (unit) {
      case 'acres': return size * 0.404686;
      case 'bigha': return size * 0.1338;
      case 'hectares':
      default: return size;
    }
  };

  const fieldSizeInHectares = convertToHectares(parseFloat(formData.fieldSize), formData.sizeUnit);

  return (
    <div className="space-y-6">
      {/* Field Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Leaf className="h-5 w-5 text-grass-600" />
            <span>Field Analysis Summary</span>
          </CardTitle>
          <CardDescription>
            Recommendations for {formData.fieldName} - {formData.fieldSize} {formData.sizeUnit} ({fieldSizeInHectares.toFixed(2)} hectares)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-grass-50 rounded-lg">
              <div className="text-sm text-gray-600">Crop Type</div>
              <div className="font-semibold capitalize">{formData.cropType}</div>
            </div>
            <div className="text-center p-3 bg-earth-50 rounded-lg">
              <div className="text-sm text-gray-600">Soil Type</div>
              <div className="font-semibold capitalize">{formData.soilType} Soil</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-600">Soil pH</div>
              <div className="font-semibold">{formData.soilPH}</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-sm text-gray-600">Temperature</div>
              <div className="font-semibold">{formData.temperature}°C</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Soil Condition Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Soil Condition Analysis</CardTitle>
          <CardDescription>Detailed analysis of your soil conditions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Current Status</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>pH Status:</span>
                  <Badge variant="secondary">{recommendations.soilConditionAnalysis.phStatus}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Moisture Status:</span>
                  <Badge variant="secondary">{recommendations.soilConditionAnalysis.moistureStatus}</Badge>
                </div>
                <div>
                  <span className="font-medium">Nutrient Deficiencies:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {recommendations.soilConditionAnalysis.nutrientDeficiency.map((nutrient, index) => (
                      <Badge key={index} variant="destructive" className="text-xs">
                        {nutrient}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Recommendations</h4>
              <ul className="space-y-1 text-sm">
                {recommendations.soilConditionAnalysis.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-grass-600 mt-1">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fertilizer Recommendations */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Leaf className="h-5 w-5 text-grass-600" />
              <span>Primary Fertilizer</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{recommendations.primaryFertilizer.name}</h3>
                <p className="text-grass-600 font-medium">{recommendations.primaryFertilizer.amount}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-gray-600">Reason:</h4>
                <p className="text-sm">{recommendations.primaryFertilizer.reason}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-gray-600">Application Method:</h4>
                <p className="text-sm">{recommendations.primaryFertilizer.applicationMethod}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Leaf className="h-5 w-5 text-blue-600" />
              <span>Secondary Fertilizer</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{recommendations.secondaryFertilizer.name}</h3>
                <p className="text-blue-600 font-medium">{recommendations.secondaryFertilizer.amount}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-gray-600">Reason:</h4>
                <p className="text-sm">{recommendations.secondaryFertilizer.reason}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-gray-600">Application Method:</h4>
                <p className="text-sm">{recommendations.secondaryFertilizer.applicationMethod}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Organic Alternatives */}
      <Card>
        <CardHeader>
          <CardTitle>Organic Alternatives</CardTitle>
          <CardDescription>
            Sustainable options for long-term soil health improvement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.organicOptions.map((option, index) => (
              <div key={index} className="p-4 border rounded-lg bg-green-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{option.name}</h4>
                  <Badge variant="secondary">{option.amount}</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{option.benefits}</p>
                <div className="text-xs text-green-700">
                  <strong>Timing:</strong> {option.applicationTiming}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Application Timing and Cost */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-grass-600" />
              <span>Application Timing</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-sm text-gray-600">Primary Fertilizer:</h4>
                <p className="text-sm">{recommendations.applicationTiming.primary}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-gray-600">Secondary Fertilizer:</h4>
                <p className="text-sm">{recommendations.applicationTiming.secondary}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-gray-600">Organic Options:</h4>
                <p className="text-sm">{recommendations.applicationTiming.organic}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-grass-600" />
              <span>Cost Estimate</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Primary Fertilizer:</span>
                <span className="font-medium">{recommendations.costEstimate.primary}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Secondary Fertilizer:</span>
                <span className="font-medium">{recommendations.costEstimate.secondary}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Organic Options:</span>
                <span className="font-medium">{recommendations.costEstimate.organic}</span>
              </div>
              <hr />
              <div className="flex justify-between">
                <span className="font-semibold">Total Estimate:</span>
                <span className="font-bold text-grass-600">{recommendations.costEstimate.total}</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                For {fieldSizeInHectares.toFixed(2)} hectares ({formData.fieldSize} {formData.sizeUnit})
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedFertilizerRecommendations;