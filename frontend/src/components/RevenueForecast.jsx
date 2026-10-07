import { formatINR } from '../utils/format'
import { TrendingUp } from 'lucide-react'

const RevenueForecast = ({ currentRevenue, predictedRevenue }) => {
  const currentAnnual = currentRevenue * 12
  const growth = ((predictedRevenue - currentAnnual) / currentAnnual) * 100

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Revenue Forecast</h3>
        <TrendingUp className="w-6 h-6 text-primary-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-500 mb-1">Current Run Rate (ARR)</p>
          <p className="text-2xl font-bold text-gray-900">{formatINR(currentAnnual)}</p>
        </div>
        
        <div className="p-4 bg-primary-50 rounded-lg border border-primary-100">
          <p className="text-sm font-medium text-primary-700 mb-1">Predicted Next 12 Months</p>
          <p className="text-2xl font-bold text-primary-900">{formatINR(predictedRevenue)}</p>
        </div>
      </div>

      {growth > 0 && (
        <div className="mt-6 flex items-center justify-center p-3 bg-green-50 rounded-lg text-green-700 text-sm font-medium">
          <span className="mr-2">Projected Growth:</span>
          <span className="text-lg">+{growth.toFixed(1)}%</span>
        </div>
      )}
    </div>
  )
}

export default RevenueForecast
