import { Building2, FileCheck2, Gavel, KeyRound, LandPlot, LineChart, type LucideProps } from "lucide-react";
import type { Service } from "@/lib/content";

const icons = {
  valuation: FileCheck2,
  facility: Building2,
  agency: KeyRound,
  feasibility: LineChart,
  land: LandPlot,
  auction: Gavel,
} as const;

export function ServiceIcon({ icon, ...props }: { icon: Service["icon"] } & LucideProps) {
  const Icon = icons[icon];
  return <Icon {...props} />;
}
