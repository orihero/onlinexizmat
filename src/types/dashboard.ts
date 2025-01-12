import { LucideIcon } from 'lucide-react';

export type TrendType = 'up' | 'down';
export type ColorType = 'blue' | 'yellow' | 'green' | 'red';

export interface StatCardData {
  title: string;
  value: string;
  change: string;
  trend: TrendType;
  icon: LucideIcon;
  color: ColorType;
}