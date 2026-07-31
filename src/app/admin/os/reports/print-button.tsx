"use client";

import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <Button size="sm" variant="outline" className="h-8" onClick={() => window.print()}>
      <Printer className="mr-1.5 h-3.5 w-3.5" /> Imprimer / PDF
    </Button>
  );
}
