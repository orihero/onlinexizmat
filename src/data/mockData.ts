import { DollarSign, Users, ShoppingBag, Clock } from 'lucide-react';
import { StatCardData } from '../types/dashboard';

export const stats: StatCardData[] = [
  {
    title: 'Total Order',
    value: '40,689',
    change: '+6.5%',
    trend: 'up',
    icon: ShoppingBag,
    color: 'blue'
  },
  {
    title: 'Total Sales',
    value: '10293',
    change: '+1.5%',
    trend: 'up',
    icon: Users,
    color: 'yellow'
  },
  {
    title: 'Total Sales',
    value: '$89,000',
    change: '-4.1%',
    trend: 'down',
    icon: DollarSign,
    color: 'green'
  },
  {
    title: 'Total Pending',
    value: '2040',
    change: '+1.8%',
    trend: 'up',
    icon: Clock,
    color: 'red'
  }
];

export const chartData = Array.from({ length: 12 }, (_, i) => ({
  name: `Day ${i + 1}`,
  value: Math.floor(Math.random() * (1000 - 200) + 200)
}));