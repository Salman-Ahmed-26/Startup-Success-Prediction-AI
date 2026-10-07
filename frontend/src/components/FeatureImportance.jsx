import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Sparkles, TrendingUp, Info } from 'lucide-react'

const FeatureImportance = ({ data }) => {
  if (!data) return null

  // Normalize data into array format
  let list = []
  if (Array.isArray(data)) {
    list = data
  } else if (typeof data === 'object') {
    list = Object.entries(data).map(([feature, importance]) => ({ feature, importance }))
  }

  if (list.length === 0) return null

  // Take top 6 factors
  const chartData = list.slice(0, 6).map(item => {
    const rawName = item.feature || item.name || 'Factor'
    const cleanName = rawName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    return {
      name: cleanName,
      importance: Number(((item.importance || 0) * 100).toFixed(1)),
      rawFeature: rawName
    }
  })

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-gray-900">What is Driving Your Result?</h3>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full">
            Decision Tree Feature Importance
          </span>
        </div>
        <p className="text-xs text-gray-500 mb-6">
          Relative weight and influence of each fundamental metric in determining your startup's success classification.
        </p>

        {/* Feature Importance Bar Chart */}
        <div className="h-64 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 35, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
              <XAxis type="number" unit="%" domain={[0, 'dataMax + 5']} tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 12, fill: '#374151' }} />
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Decision Weight']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="importance" fill="#4f46e5" radius={[0, 6, 6, 0]} barSize={20}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#4338ca' : index === 1 ? '#6366f1' : '#818cf8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-gray-50 p-3.5 rounded-lg border border-gray-100 flex items-start space-x-2.5">
        <Info className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-gray-600 leading-relaxed">
          <strong>Key Insight:</strong> Top decision drivers represent the highest information gain nodes in the model. Improving these metrics delivers the fastest boost to your overall health score and success probability.
        </p>
      </div>
    </div>
  )
}

export default FeatureImportance
