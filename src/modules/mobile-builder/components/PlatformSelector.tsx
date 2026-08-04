"use client";

import { Smartphone, Tablet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";

export type PlatformSelectorValue = "BOTH" | "ANDROID" | "IOS";

interface PlatformSelectorProps {
  value: PlatformSelectorValue;
  onChange: (value: PlatformSelectorValue) => void;
  includeDebug?: boolean;
  onDebugChange?: (enabled: boolean) => void;
}

export function PlatformSelector({
  value,
  onChange,
  includeDebug = false,
  onDebugChange,
}: PlatformSelectorProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <RadioGroup value={value} onValueChange={onChange} className="space-y-4">
          <div className="flex items-center space-y-0 space-x-3">
            <RadioGroupItem value="BOTH" id="both" />
            <Label htmlFor="both" className="flex items-center gap-2 text-base">
              <Smartphone className="text-primary h-5 w-5" />
              Android + iOS
            </Label>
          </div>
          <div className="flex items-center space-y-0 space-x-3">
            <RadioGroupItem value="ANDROID" id="android" />
            <Label htmlFor="android" className="flex items-center gap-2 text-base">
              <Smartphone className="text-primary h-5 w-5" />
              Android uniquement (APK / AAB)
            </Label>
          </div>
          <div className="flex items-center space-y-0 space-x-3">
            <RadioGroupItem value="IOS" id="ios" />
            <Label htmlFor="ios" className="flex items-center gap-2 text-base">
              <Tablet className="text-primary h-5 w-5" />
              iOS uniquement (IPA)
            </Label>
          </div>
        </RadioGroup>

        {includeDebug && onDebugChange && (
          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
            <Label htmlFor="debug" className="text-base">
              Générer APK debug (installeur direct)
            </Label>
            <Switch id="debug" checked={includeDebug} onCheckedChange={onDebugChange} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
