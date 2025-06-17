import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#6366f1', '#f59e42', '#ef4444'];

export default function StatsPieChart({
  stats,
}: {
  stats: { facture: number; devis: number; proforma: number; autre: number };
}) {
  const data = [
    { name: 'Factures', value: stats.facture },
    { name: 'Devis', value: stats.devis },
    { name: 'Proformas', value: stats.proforma },
    { name: 'Autres', value: stats.autre },
  ];

  return (
    <div className="w-full h-96 bg-white rounded-lg shadow flex flex-1 items-center justify-center my-8">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            outerRadius="80%"
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((_, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}