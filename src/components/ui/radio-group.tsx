"use client";

import { type RadioGroupProps } from "@radix-ui/react-radio-group";
import { RadioGroup as RadixRadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import { cn } from "@/lib/utils";

function RadioGroup({ className, ...props }: RadioGroupProps) {
  return <RadixRadioGroup className={cn("grid gap-2", className)} {...props} />;
}

export { RadioGroup, RadioGroupItem };
