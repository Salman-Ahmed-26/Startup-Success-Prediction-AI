import { useEffect, useState } from 'react'
import { getAnalytics } from '../services/api'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'
import { formatINR } from '../utils/format'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area 
} from 'recharts'
import { Activity, Users, DollarSign, TrendingUp, ShieldCheck, Layers, Award } from 'lucide-react'

const Insights = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAnalytics()
        setData(res.data)
      } catch (err) {
        console.error('Error fetching analytics:', err)
        setError('Failed to load insights from backend. Please ensure the API is running.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <div className="p-12"><LoadingState message="Loading startup ecosystem insights..." /></div>
  if (error) return <div className="p-12"><ErrorState message={error} onRetry={() => window.location.reload()} /></div>
  if (!data) return null

  const SEGMENT_COLORS = {
    'High Growth': '#6366f1',
    'Growth Stage': '#10b981',
    'Early Stage': '#3b82f6',
    'High Risk': '#ef4444'
  }

  // Format segment distribution data for Pie Chart
  const segmentData = Object.entries(data.startups_by_category || {}).map(([name, value]) => ({
    name,
    value,
    color: SEGMENT_COLORS[name] || '#6b7280'
  }))

  // Industry benchmark data
  const industryData = (data.industry_stats || []).map(ind => ({
    industry: ind.industry,
    avgRevenue: Math.round(ind.avg_revenue),
    avgFunding: Math.round(ind.avg_funding),
    avgGrowth: ind.avg_growth,
    successRate: Math.round(ind.success_rate * 100)
  }))

  // Model comparison table data
  const dtMetrics = data.decision_tree || {}
  const knnMetrics = data.knn || {}
  const lrMetrics = data.linear_regression || {}
  const kmMetrics = data.kmeans || {}

  const modelComparisonRows = [
    { metric: 'Accuracy', dt: `${((dtMetrics.accuracy || 0) * 100).toFixed(1)}%`, knn: `${((knnMetrics.accuracy || 0) * 100).toFixed(1)}%` },
    { metric: 'Precision', dt: `${((dtMetrics.precision || 0) * 100).toFixed(1)}%`, knn: `${((knnMetrics.precision || 0) * 100).toFixed(1)}%` },
    { metric: 'Recall', dt: `${((dtMetrics.recall || 0) * 100).toFixed(1)}%`, knn: `${((knnMetrics.recall || 0) * 100).toFixed(1)}%` },
    { metric: 'F1 Score', dt: `${((dtMetrics.f1 || 0) * 100).toFixed(1)}%`, knn: `${((knnMetrics.f1 || 0) * 100).toFixed(1)}%` },
    { metric: 'Algorithm Type', dt: 'Decision Tree Classifier', knn: `K-Nearest Neighbors (k=${knnMetrics.best_k || 7})` },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Ecosystem Intelligence & Analytics</h1>
        <p className="text-gray-500 mt-2 text-base">
          Aggregated insights, model benchmarks, and industry distributions derived from {data.total_analyses.toLocaleString()} startup profiles.
        </p>
      </div>

      {/* Top Level Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Startups Trained</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{data.total_analyses.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Average Health Score</p>
            <p className="text-3xl font-bold text-green-600 mt-1">{data.avg_health_score} / 100</p>
          </div>
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">DT Model Accuracy</p>
            <p className="text-3xl font-bold text-indigo-600 mt-1">{((dtMetrics.accuracy || 0) * 100).toFixed(1)}%</p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Revenue Model R²</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">{((lrMetrics.r2 || 0) * 100).toFixed(1)}%</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Chart Section 1: Segment Distribution & Industry Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Startup Segmentation Breakdown */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Startup Segmentation Breakdown</h3>
              <p className="text-xs text-gray-500">Unsupervised K-Means clustering (k={kmMetrics.n_clusters || 4})</p>
            </div>
            <Layers className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={segmentData} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={60} 
                  outerRadius={95} 
                  paddingAngle={4}
                  dataKey="value" 
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {segmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} startups`, 'Volume']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Average Monthly Growth by Industry */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Average Customer Growth by Industry</h3>
              <p className="text-xs text-gray-500">Month-over-month customer expansion rate %</p>
            </div>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={industryData} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="industry" angle={-30} textAnchor="end" interval={0} tick={{ fontSize: 11 }} />
                <YAxis unit="%" tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value) => [`${value}%`, 'Avg Monthly Growth']} />
                <Bar dataKey="avgGrowth" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Chart Section 2: Industry Revenue & Success Rate */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Industry Economics & Success Benchmark</h3>
            <p className="text-xs text-gray-500">Average monthly revenue (₹) vs. Historical success rate (%) across sectors</p>
          </div>
          <DollarSign className="w-5 h-5 text-gray-400" />
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={industryData} margin={{ top: 10, right: 30, left: 20, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="industry" angle={-25} textAnchor="end" interval={0} tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" tickFormatter={(v) => formatINR(v)} tick={{ fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" unit="%" domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'avgRevenue' ? formatINR(value) : `${value}%`, 
                  name === 'avgRevenue' ? 'Avg Monthly Revenue' : 'Success Rate'
                ]} 
              />
              <Legend verticalAlign="top" height={36} />
              <Bar yAxisId="left" name="Avg Monthly Revenue" dataKey="avgRevenue" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" name="Success Rate" dataKey="successRate" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Section 3: Machine Learning Model Benchmarking Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Machine Learning Model Performance Matrix</h3>
            <p className="text-xs text-gray-500">Ground-truth validation metrics evaluated against out-of-sample test splits</p>
          </div>
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500 border-b border-gray-100">
              <tr>
                <th className="py-3 px-6">Evaluation Metric</th>
                <th className="py-3 px-6 text-indigo-700 font-bold">Decision Tree (Primary)</th>
                <th className="py-3 px-6 text-green-700 font-bold">k-NN Classifier</th>
                <th className="py-3 px-6 text-gray-600">Model Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {modelComparisonRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-6 font-medium text-gray-900">{row.metric}</td>
                  <td className="py-3 px-6 font-semibold text-indigo-600">{row.dt}</td>
                  <td className="py-3 px-6 font-semibold text-green-600">{row.knn}</td>
                  <td className="py-3 px-6 text-gray-500">
                    {row.metric === 'Accuracy' && 'Overall classification correctness on test split'}
                    {row.metric === 'Precision' && 'True positive rate among predicted successes'}
                    {row.metric === 'Recall' && 'Ability to identify all truly successful startups'}
                    {row.metric === 'F1 Score' && 'Harmonic mean of precision and recall'}
                    {row.metric === 'Algorithm Type' && 'Model architecture and chosen hyperparameter'}
                  </td>
                </tr>
              ))}
              <tr className="bg-blue-50/50">
                <td className="py-3 px-6 font-medium text-gray-900">Linear Regression</td>
                <td colSpan={2} className="py-3 px-6 text-gray-800">
                  <span className="font-semibold text-blue-700">R² = {((lrMetrics.r2 || 0) * 100).toFixed(1)}%</span> | 
                  <span className="ml-3 font-semibold text-gray-700">MAE = {formatINR(lrMetrics.mae || 0)}</span> | 
                  <span className="ml-3 font-semibold text-gray-700">RMSE = {formatINR(lrMetrics.rmse || 0)}</span>
                </td>
                <td className="py-3 px-6 text-gray-500">Annual recurring revenue (ARR) forecast engine</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Insights
