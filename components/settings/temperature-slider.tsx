import { Slider } from "@/components/ui/slider";

interface TemperatureSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function TemperatureSlider({ value, onChange }: TemperatureSliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm text-muted-foreground">Temperature</label>
        <span className="text-sm text-muted-foreground">{value}</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([newValue]) => onChange(newValue)}
        min={0}
        max={2}
        step={0.1}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>More deterministic</span>
        <span>More creative</span>
      </div>
    </div>
  );
}
