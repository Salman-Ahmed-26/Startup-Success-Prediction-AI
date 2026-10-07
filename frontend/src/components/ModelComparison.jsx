import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Scale, CheckCircle2 } from 'lucide-react'

const ModelComparison = ({ performanceData }) => {
  const dt = performanceData?.decision_tree || { accuracy: 0.818, precision: 0.884, recall: 0.912, f1: 0.898 }
  const knn = performanceData?.knn || { accuracy: 0.878, precision: 0.879, recall: 0.997, f1: 0.935, best_k: 21 }

  const chartData = [
    {
      metric: 'Accuracy',
      'Decision Tree': Number(((dt.accuracy || 0) * 100).toFixed(1)),
      'k-NN': Number(((knn.accuracy || 0) * 100).toFixed(1)),
    },
    {
      metric: 'Precision',
      'Decision Tree': Number(((dt.precision || 0) * 100).toFixed(1)),
      'k-NN': Number(((knn.precision || 0) * 100).toFixed(1)),
    },
    {
      metric: 'Recall',
      'Decision Tree': Number(((dt.recall || 0) * 100).toFixed(1)),
      'k-NN': Number(((knn.recall || 0) * 100).toFixed(1)),
    },
    {
      metric: 'F1 Score',
      'Decision Tree': Number(((dt.f1 || 0) * 100).toFixed(1)),
      'k-NN': Number(((knn.f1 || 0) * 100).toFixed(1)),
    }
  ]

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-gray-100 gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Scale className="w-5 h-5 text-indigo-600" />
            <h3 className="text-xl font-bold text-gray-900">Model Performance & Comparison</h3>
          </div>
          <p className="text-xs text-gray-500">
            Side-by-side evaluation of Decision Tree (Primary) vs. K-Nearest Neighbors on held-out test data.
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-indigo-600"></span>
            <span className="text-xs font-semibold text-gray-700">Decision Tree</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-semibold text-gray-700">k-NN (k={knn.best_k || 21})</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Radar Chart */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: '#4b5563', fontSize: 12, fontWeight: 600 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Radar name="Decision Tree" dataKey="Decision Tree" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.4} />
              <Radar name="k-NN" dataKey="k-NN" stroke="#10b981" fill="#10b981" fillOpacity={0.35} />
              <Tooltip formatter={(value) => [`${value}%`, '']} />
              <Legend verticalAlign="bottom" height={24} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Metrics Grid Cards */}
        <div className="grid grid-cols-2 gap-4">
          {chartData.map((item, idx) => (
            <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{item.metric}</span>
              <div className="mt-2 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Decision Tree:</span>
                  <span className="text-sm font-bold text-indigo-700">{item['Decision Tree']}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">k-NN:</span>
                  <span className="text-sm font-bold text-emerald-600">{item['k-NN']}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ModelComparison
