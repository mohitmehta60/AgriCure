import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

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

interface EnhancedFertilizerFormProps {
  onSubmit: (data: FormData) => void;
}

const EnhancedFertilizerForm = ({ onSubmit }: EnhancedFertilizerFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    fieldName: "",
    fieldSize: "",
    sizeUnit: "hectares",
    cropType: "",
    soilPH: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    soilType: "",
    temperature: "",
    humidity: "",
    soilMoisture: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const convertToHectares = (size: number, unit: string): number => {
    switch (unit) {
      case 'acres': return size * 0.404686;
      case 'bigha': return size * 0.1338; // Approximate conversion
      case 'hectares':
      default: return size;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate processing
    setTimeout(() => {
      onSubmit(formData);
      toast({
        title: "Analysis Complete",
        description: "Your enhanced fertilizer recommendations are ready!",
      });
      setIsLoading(false);
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Enhanced Fertilizer Recommendation Form</span>
        </CardTitle>
        <CardDescription>
          Provide detailed field information for precise fertilizer recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Field Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fieldName">Field Name *</Label>
              <Input
                id="fieldName"
                placeholder="e.g., North Field"
                value={formData.fieldName}
                onChange={(e) => handleChange("fieldName", e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="fieldSize">Field Size *</Label>
                <Input
                  id="fieldSize"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 2.5"
                  value={formData.fieldSize}
                  onChange={(e) => handleChange("fieldSize", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="sizeUnit">Unit</Label>
                <Select onValueChange={(value) => handleChange("sizeUnit", value)} defaultValue="hectares">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hectares">Hectares</SelectItem>
                    <SelectItem value="acres">Acres</SelectItem>
                    <SelectItem value="bigha">Bigha</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Crop and Soil Type */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cropType">Crop Type *</Label>
              <Select onValueChange={(value) => handleChange("cropType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select crop type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wheat">Wheat</SelectItem>
                  <SelectItem value="rice">Rice</SelectItem>
                  <SelectItem value="corn">Corn/Maize</SelectItem>
                  <SelectItem value="soybeans">Soybeans</SelectItem>
                  <SelectItem value="cotton">Cotton</SelectItem>
                  <SelectItem value="sugarcane">Sugarcane</SelectItem>
                  <SelectItem value="vegetables">Vegetables</SelectItem>
                  <SelectItem value="fruits">Fruits</SelectItem>
                  <SelectItem value="pulses">Pulses</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="soilType">Soil Type *</Label>
              <Select onValueChange={(value) => handleChange("soilType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select soil type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="black">Black Soil</SelectItem>
                  <SelectItem value="loamy">Loamy Soil</SelectItem>
                  <SelectItem value="clayey">Clayey Soil</SelectItem>
                  <SelectItem value="red">Red Soil</SelectItem>
                  <SelectItem value="sandy">Sandy Soil</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Soil Chemistry */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Soil Chemistry</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="soilPH">Soil pH *</Label>
                <Input
                  id="soilPH"
                  type="number"
                  step="0.1"
                  min="0"
                  max="14"
                  placeholder="e.g., 6.5"
                  value={formData.soilPH}
                  onChange={(e) => handleChange("soilPH", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="nitrogen">Nitrogen (mg/kg) *</Label>
                <Input
                  id="nitrogen"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 45.2"
                  value={formData.nitrogen}
                  onChange={(e) => handleChange("nitrogen", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phosphorus">Phosphorus (mg/kg) *</Label>
                <Input
                  id="phosphorus"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 23.8"
                  value={formData.phosphorus}
                  onChange={(e) => handleChange("phosphorus", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="potassium">Potassium (ppm) *</Label>
                <Input
                  id="potassium"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 156.4"
                  value={formData.potassium}
                  onChange={(e) => handleChange("potassium", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Environmental Conditions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Environmental Conditions</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="temperature">Temperature (°C) *</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 24.3"
                  value={formData.temperature}
                  onChange={(e) => handleChange("temperature", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="humidity">Humidity (%) *</Label>
                <Input
                  id="humidity"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  placeholder="e.g., 72.1"
                  value={formData.humidity}
                  onChange={(e) => handleChange("humidity", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="soilMoisture">Soil Moisture (%) *</Label>
                <Input
                  id="soilMoisture"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  placeholder="e.g., 68.5"
                  value={formData.soilMoisture}
                  onChange={(e) => handleChange("soilMoisture", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-grass-600 hover:bg-grass-700"
            disabled={isLoading}
          >
            {isLoading ? "Generating Recommendations..." : "Generate Enhanced Recommendations"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EnhancedFertilizerForm;