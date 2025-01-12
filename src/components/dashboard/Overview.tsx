import StatsCard from './StatsCard';
import SalesChart from './charts/SalesChart';
import DealsTable from './tables/DealsTable';
import { stats } from '../../data/mockData';

export default function Overview() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <SalesChart />
      <DealsTable />
    </div>
  );
}