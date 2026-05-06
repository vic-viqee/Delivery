"use client";

// fallow-ignore-next-line complexity
import { useState } from "react";
import { MapPin, Camera, Navigation, Check, X, Plus, Trash2, Home, Building, Warehouse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EMBU_CENTER = { lat: -0.5389, lng: 37.4586 };

const EMBU_STAGES = [
  "Embu Main Stage",
  "Kiritiri Stage",
  "Siakago Stage",
  "Dallas Stage",
  "Blue Valley Stage",
  "Kamuketha Stage",
  "NENO Booking Office",
  "2NK Booking Office",
  "ENA Coach Office",
  "University of Embu Gate",
  "Kangaru School Gate",
  "Embu Level 5 Hospital",
  "Izaak Walton Inn",
  "Nokras Silver Oak",
  "Naivas Pearl Centre",
];

const LANDMARKS = [
  "Near market",
  "Near bus station",
  "Near hospital",
  "Near school",
  "Near church",
  "Near mosque",
  "Near supermarket",
  "Near petrol station",
  "Residential area",
  "Commercial area",
];

const GATE_COLOURS = ["Red", "Green", "Black", "Brown", "Blue", "White", "Grey"];
const FLOOR_LEVELS = ["Ground", "1st", "2nd", "3rd", "4th", "5th+"];
const TURN_DIRECTIONS = ["Right", "Left", "Straight"];

type AddressType = "house" | "apartment" | "compound" | "pickup_point";

interface TurnInstruction {
  turnNumber: number;
  direction: string;
  atLandmark: string;
}

interface AddressFormProps {
  initialData?: Partial<AddressFormData>;
  onSubmit: (data: AddressFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export interface AddressFormData {
  name: string;
  latitude: number;
  longitude: number;
  landmark: string;
  instructions: string;
  neighborhood: string;
  photoUrl?: string;
  isDefault: boolean;
  addressType?: AddressType;
  apartmentName?: string;
  gateColour?: string;
  floorLevel?: string;
  turnInstructions?: TurnInstruction[];
  leaveAtNeighbour?: boolean;
  neighbourName?: string;
  callBeforeDelivery?: boolean;
  specialNotes?: string;
  // HYPER-LOCAL
  nearestStage?: string;
  plusCode?: string;
  voiceNoteUrl?: string;
}

export function AddressForm({ initialData, onSubmit, onCancel, isLoading }: AddressFormProps) {
  const [formData, setFormData] = useState<AddressFormData>({
    name: initialData?.name || "",
    latitude: initialData?.latitude || EMBU_CENTER.lat,
    longitude: initialData?.longitude || EMBU_CENTER.lng,
    landmark: initialData?.landmark || "",
    instructions: initialData?.instructions || "",
    neighborhood: initialData?.neighborhood || "",
    photoUrl: initialData?.photoUrl || "",
    isDefault: initialData?.isDefault || false,
    addressType: initialData?.addressType || "house",
    apartmentName: initialData?.apartmentName || "",
    gateColour: initialData?.gateColour || "",
    floorLevel: initialData?.floorLevel || "",
    turnInstructions: initialData?.turnInstructions || [],
    leaveAtNeighbour: initialData?.leaveAtNeighbour || false,
    neighbourName: initialData?.neighbourName || "",
    callBeforeDelivery: initialData?.callBeforeDelivery || false,
    specialNotes: initialData?.specialNotes || "",
    nearestStage: initialData?.nearestStage || "",
    plusCode: initialData?.plusCode || "",
    voiceNoteUrl: initialData?.voiceNoteUrl || "",
  });
  const [locationLoading, setLocationLoading] = useState(false);
  const [turnCount, setTurnCount] = useState(0);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      setLocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          // Simple Plus Code simulation for Embu
          const plusCode = `6G8V+${Math.abs(Math.floor(lat * 1000)).toString(16).toUpperCase().slice(-2)}${Math.abs(Math.floor(lng * 1000)).toString(16).toUpperCase().slice(-2)} Embu`;
          
          setFormData((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lng,
            plusCode: plusCode,
          }));
          setLocationLoading(false);
        },
        (error) => {
          console.error("Location error:", error);
          setLocationLoading(false);
        }
      );
    }
  };

  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const toggleRecording = () => {
    if (!isRecording) {
      // In a real app, use MediaRecorder
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setAudioUrl("mock-audio-url.webm");
        setFormData(prev => ({ ...prev, voiceNoteUrl: "mock-audio-url.webm" }));
      }, 3000);
    } else {
      setIsRecording(false);
    }
  };

  const addTurnInstruction = () => {
    if (turnCount < 3) {
      const newTurns = [
        ...(formData.turnInstructions || []),
        { turnNumber: turnCount + 1, direction: "Right", atLandmark: "" },
      ];
      setFormData((prev) => ({ ...prev, turnInstructions: newTurns }));
      setTurnCount(turnCount + 1);
    }
  };

  const removeTurnInstruction = (index: number) => {
    const newTurns = (formData.turnInstructions || []).filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, turnInstructions: newTurns }));
    setTurnCount(turnCount - 1);
  };

  const updateTurnInstruction = (index: number, field: string, value: string) => {
    const newTurns = [...(formData.turnInstructions || [])];
    newTurns[index] = { ...newTurns[index], [field]: value };
    setFormData((prev) => ({ ...prev, turnInstructions: newTurns }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">Address Name</Label>
        <Input
          id="name"
          placeholder="Home, Office, etc."
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-3">
        <Label>Address Type</Label>
        <div className="grid grid-cols-4 gap-2">
          <Button
            type="button"
            variant={formData.addressType === "house" ? "default" : "outline"}
            size="sm"
            onClick={() => setFormData((prev) => ({ ...prev, addressType: "house" }))}
            className="flex flex-col gap-1 h-16"
          >
            <Home className="h-4 w-4" />
            <span className="text-[10px]">House</span>
          </Button>
          <Button
            type="button"
            variant={formData.addressType === "apartment" ? "default" : "outline"}
            size="sm"
            onClick={() => setFormData((prev) => ({ ...prev, addressType: "apartment" }))}
            className="flex flex-col gap-1 h-16"
          >
            <Building className="h-4 w-4" />
            <span className="text-[10px]">Apartment</span>
          </Button>
          <Button
            type="button"
            variant={formData.addressType === "compound" ? "default" : "outline"}
            size="sm"
            onClick={() => setFormData((prev) => ({ ...prev, addressType: "compound" }))}
            className="flex flex-col gap-1 h-16"
          >
            <Warehouse className="h-4 w-4" />
            <span className="text-[10px]">Compound</span>
          </Button>
          <Button
            type="button"
            variant={formData.addressType === "pickup_point" ? "default" : "outline"}
            size="sm"
            onClick={() => setFormData((prev) => ({ ...prev, addressType: "pickup_point" }))}
            className="flex flex-col gap-1 h-16"
          >
            <MapPin className="h-4 w-4" />
            <span className="text-[10px]">Pickup</span>
          </Button>
        </div>
      </div>

      {(formData.addressType === "apartment" || formData.addressType === "compound") && (
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="apartmentName">Apartment/Complex Name</Label>
            <Input
              id="apartmentName"
              placeholder="e.g., Kamuyu Apartments"
              value={formData.apartmentName}
              onChange={(e) => setFormData((prev) => ({ ...prev, apartmentName: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gateColour">Gate/Door Colour</Label>
            <Select
              value={formData.gateColour}
              onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, gateColour: value || undefined }))
            }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select colour" />
              </SelectTrigger>
              <SelectContent>
                {GATE_COLOURS.map((colour) => (
                  <SelectItem key={colour} value={colour.toLowerCase()}>
                    {colour}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {formData.addressType === "apartment" && (
        <div className="space-y-2">
          <Label htmlFor="floorLevel">Floor Level (optional)</Label>
          <Select
            value={formData.floorLevel}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, floorLevel: value || undefined }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select floor" />
            </SelectTrigger>
            <SelectContent>
              {FLOOR_LEVELS.map((floor) => (
                <SelectItem key={floor} value={floor}>
                  {floor} Floor
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <Separator />

      <div className="space-y-2">
        <Label>GPS Location</Label>
        <Card className="relative h-24 overflow-hidden">
          <CardContent className="absolute inset-0 flex items-center justify-center bg-muted">
            <div className="relative flex flex-col items-center gap-2 text-center">
              <MapPin className="h-6 w-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleGetLocation}
          disabled={locationLoading}
          className="w-full"
        >
          <Navigation className="mr-2 h-4 w-4" />
          {locationLoading ? "Getting location..." : "Use my current location"}
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="neighborhood">Neighborhood / Estate</Label>
        <Input
          id="neighborhood"
          placeholder="e.g., Kiamuriuki, Ruaka"
          value={formData.neighborhood}
          onChange={(e) => setFormData((prev) => ({ ...prev, neighborhood: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label>Nearest Matatu/Boda Stage (Anchor)</Label>
        <Select
          value={formData.nearestStage}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, nearestStage: value || undefined }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select the nearest stage" />
          </SelectTrigger>
          <SelectContent>
            {EMBU_STAGES.map((stage) => (
              <SelectItem key={stage} value={stage}>
                {stage}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-[10px] text-muted-foreground">Riders will use this as their starting point to find you.</p>
      </div>

      {formData.plusCode && (
        <div className="rounded-lg bg-primary/5 p-3 border border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Plus Code: {formData.plusCode}</span>
            </div>
            <Badge variant="outline" className="text-[10px] uppercase">Precise</Badge>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label>Landmark</Label>
        <div className="flex flex-wrap gap-2">
          {LANDMARKS.map((landmark) => (
            <Button
              key={landmark}
              type="button"
              variant={formData.landmark === landmark ? "default" : "outline"}
              size="sm"
              onClick={() => setFormData((prev) => ({ ...prev, landmark }))}
              className="text-xs"
            >
              {landmark}
            </Button>
          ))}
        </div>
        <Input
          placeholder="Or type a specific landmark"
          value={formData.landmark}
          onChange={(e) => setFormData((prev) => ({ ...prev, landmark: e.target.value }))}
          className="mt-2"
        />
      </div>

      <Separator />

      <div className="space-y-3">
        <Label>Turn-by-Turn Directions (optional)</Label>
        <p className="text-xs text-muted-foreground">
          For areas with multiple turns, help the rider navigate
        </p>
        {(formData.turnInstructions || []).map((turn, index) => (
          <div key={index} className="flex gap-2 items-center">
            <span className="text-sm font-medium w-20">
              {turn.turnNumber}
              {turn.turnNumber === 1 ? "st" : turn.turnNumber === 2 ? "nd" : "rd"} turn
            </span>
            <Select
              value={turn.direction}
              onValueChange={(value) => updateTurnInstruction(index, "direction", value || "right")}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TURN_DIRECTIONS.map((dir) => (
                  <SelectItem key={dir} value={dir.toLowerCase()}>
                    {dir}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm">at</span>
            <Input
              placeholder="e.g., junction, church"
              value={turn.atLandmark}
              onChange={(e) => updateTurnInstruction(index, "atLandmark", e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeTurnInstruction(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {turnCount < 3 && (
          <Button type="button" variant="outline" size="sm" onClick={addTurnInstruction}>
            <Plus className="mr-2 h-4 w-4" />
            Add Turn
          </Button>
        )}
      </div>

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="instructions">Delivery Instructions</Label>
        <Input
          id="instructions"
          placeholder="e.g., Red gate, ring bell twice"
          value={formData.instructions}
          onChange={(e) => setFormData((prev) => ({ ...prev, instructions: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label>Voice Directions (Best for riders)</Label>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant={isRecording ? "destructive" : "outline"}
            className="flex-1 gap-2"
            onClick={toggleRecording}
          >
            <span className={`h-2 w-2 rounded-full ${isRecording ? "animate-ping bg-white" : "bg-red-500"}`} />
            {isRecording ? "Recording... (Stop)" : "Record Verbal Directions"}
          </Button>
          {(audioUrl || formData.voiceNoteUrl) && (
            <Badge className="bg-green-500 text-white gap-1">
              <Check className="h-3 w-3" />
              Recorded
            </Badge>
          )}
        </div>
        <p className="text-[10px] text-muted-foreground">Explain the route as you would to a friend. 15-30s max.</p>
      </div>

      <div className="space-y-3">
        <Label>Delivery Options</Label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.leaveAtNeighbour}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  leaveAtNeighbour: e.target.checked,
                  neighbourName: e.target.checked ? prev.neighbourName : "",
                }))
              }
              className="h-4 w-4"
            />
            <span className="text-sm">Leave with neighbour if not home</span>
          </label>
          {formData.leaveAtNeighbour && (
            <Input
              placeholder="Neighbour's name/apt"
              value={formData.neighbourName}
              onChange={(e) => setFormData((prev) => ({ ...prev, neighbourName: e.target.value }))}
              className="mt-1"
            />
          )}
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.callBeforeDelivery}
              onChange={(e) => setFormData((prev) => ({ ...prev, callBeforeDelivery: e.target.checked }))}
              className="h-4 w-4"
            />
            <span className="text-sm">Call 10 minutes before arrival</span>
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="specialNotes">Special Notes (optional)</Label>
        <Input
          id="specialNotes"
          placeholder="Any other instructions for the rider"
          value={formData.specialNotes}
          onChange={(e) => setFormData((prev) => ({ ...prev, specialNotes: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label>Location Photo (helps rider find you)</Label>
        <Card className="border-dashed">
          <CardContent className="flex h-32 cursor-pointer flex-col items-center justify-center gap-2 p-4 transition-colors hover:bg-muted/50">
            <Camera className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Take a photo of your gate/entrance</p>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div className="flex gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        )}
        <Button type="submit" className="flex-1" disabled={isLoading}>
          {isLoading ? (
            "Saving..."
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Save Address
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

export function AddressCard({
  address,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: {
  address: any;
  isSelected?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const getAddressTypeIcon = (type?: string) => {
    switch (type) {
      case "apartment":
        return <Building className="h-4 w-4" />;
      case "compound":
        return <Warehouse className="h-4 w-4" />;
      case "pickup_point":
        return <MapPin className="h-4 w-4" />;
      default:
        return <Home className="h-4 w-4" />;
    }
  };

  return (
    <Card
      className={`cursor-pointer transition-all ${
        isSelected ? "border-primary bg-primary/5" : "hover:border-primary/50"
      }`}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            {getAddressTypeIcon(address.addressType)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-medium">{address.name}</h4>
              {address.is_default && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                  Default
                </span>
              )}
              {address.addressType && address.addressType !== "house" && (
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium capitalize">
                  {address.addressType}
                </span>
              )}
            </div>
            {address.gateColour && (
              <p className="text-xs text-muted-foreground capitalize">
                {address.gateColour} gate
                {address.floorLevel && `, ${address.floorLevel} floor`}
              </p>
            )}
            
            {address.nearestStage && (
              <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-primary">
                <Warehouse className="h-3 w-3" />
                <span>Stage: {address.nearestStage}</span>
              </div>
            )}

            {address.plusCode && (
              <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                <Navigation className="h-3 w-3" />
                <span>Code: {address.plusCode}</span>
              </div>
            )}

            <p className="mt-1 text-sm text-muted-foreground">{address.landmark}</p>
            {address.neighborhood && (
              <p className="text-xs text-muted-foreground">{address.neighborhood}</p>
            )}
            {address.instructions && (
              <p className="mt-1 text-xs text-muted-foreground italic">
                {address.instructions}
              </p>
            )}
            
            {address.voiceNoteUrl && (
              <div className="mt-2 flex items-center gap-2 rounded-full bg-secondary/50 px-3 py-1 w-fit">
                <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-medium">Verbal Directions Available</span>
              </div>
            )}

            {address.callBeforeDelivery && (
              <p className="mt-2 text-xs text-primary">📞 Call before delivery</p>
            )}
            {address.leaveAtNeighbour && (
              <p className="mt-1 text-xs text-muted-foreground">
                Leave with: {address.neighbourName || "neighbour"}
              </p>
            )}
          </div>
        </div>
      </CardContent>
      {(onEdit || onDelete) && (
        <CardFooter className="flex gap-2 border-t p-3">
          {onEdit && (
            <Button variant="ghost" size="sm" onClick={onEdit} className="flex-1">
              Edit
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="flex-1 text-destructive hover:text-destructive"
            >
              Delete
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}