import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const HealthScore = ({ score }) => {
  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score }
  ]
  
  let color = '#ef4444' // red
  if (score >= 70) color = '#10b981' // green
  else if (score >= 40) color = '#f59e0b' // yellow

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Health Score</h3>
      <div className="h-48 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
            >
              <Cell fill={color} />
              <Cell fill="#f3f4f6" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-4">
          <span className="text-4xl font-bold" style={{ color }}>{score}</span>
          <span className="text-sm text-gray-500">/ 100</span>
        </div>
      </div>
    </div>
  )
}

export default HealthScore
