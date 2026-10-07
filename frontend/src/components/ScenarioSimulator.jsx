import { useState } from 'react'
import { predictStartup } from '../services/api'
import { formatINR } from '../utils/format'
import { Sliders, RefreshCw, ArrowRight, TrendingUp, TrendingDown, Sparkles } from 'lucide-react'

const ScenarioSimulator = ({ initialData, initialProbability }) => {
  const [formData, setFormData] = useState({ ...initialData })
  const [newProbability, setNewProbability] = useState(initialProbability)
  const [newHealthScore, setNewHealthScore] = useState(null)
  const [loading, setLoading] = useState(false)
  const [hasRecalculated, setHasRecalculated] = useState(false)

  const handleSliderChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: Number(value) }))
  }

  const handleRecalculate = async () => {
    setLoading(true)
    try {
      const res = await predictStartup(formData)
      if (res.data) {
        setNewProbability(res.data.success_probability)
        setNewHealthScore(res.data.health_score)
        setHasRecalculated(true)
      }
    } catch (error) {
      console.error("Scenario simulation error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFormData({ ...initialData })
    setNewProbability(initialProbability)
    setNewHealthScore(null)
    setHasRecalculated(false)
  }

  const currentPct = Math.round(initialProbability * 100)
  const newPct = Math.round(newProbability * 100)
  const delta = newPct - currentPct
  const isPositive = delta > 0
  const isNegative = delta < 0

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-gray-100 gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Sliders className="w-5 h-5 text-indigo-600" />
            <h3 className="text-xl font-bold text-gray-900">"What-If" Scenario Simulator</h3>
          </div>
          <p className="text-xs text-gray-500">
            Simulate operational adjustments in real-time. Changes are evaluated directly by the live Machine Learning model.
          </p>
        </div>

        {/* Live Probability Comparison Result */}
        <div className="flex items-center space-x-3 bg-gray-50 p-3 px-5 rounded-xl border border-gray-200">
          <div className="text-center">
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Baseline</span>
            <span className="text-lg font-bold text-gray-700">{currentPct}%</span>
          </div>

          <ArrowRight className="w-4 h-4 text-gray-400" />

          <div className="text-center">
            <span className="text-[10px] uppercase font-bold text-indigo-500 block">Simulated</span>
            <span className="text-2xl font-extrabold text-indigo-600">{newPct}%</span>
          </div>

          {hasRecalculated && (
            <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-md ml-2 ${
              isPositive ? 'bg-green-100 text-green-700' : isNegative ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-700'
            }`}>
              {isPositive ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : isNegative ? <TrendingDown className="w-3.5 h-3.5 mr-1" /> : null}
              {isPositive ? `+${delta}%` : isNegative ? `${delta}%` : '0%'}
            </div>
          )}
        </div>
      </div>

      {/* Simulator Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* 1. Monthly Revenue */}
        <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-100">
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-semibold text-gray-700">Monthly Revenue (₹)</label>
            <span className="text-xs font-bold text-indigo-600">{formatINR(formData.monthly_revenue)}</span>
          </div>
          <input 
            type="range" 
            name="monthly_revenue" 
            min="0" 
            max={Math.max(initialData.monthly_revenue * 3, 20000000)} 
            step="50000" 
            value={formData.monthly_revenue} 
            onChange={handleSliderChange} 
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
          />
          <div className="flex justify-between text-[10px] text-gray-400 mt-1">
            <span>₹0</span>
            <span>{formatINR(Math.max(initialData.monthly_revenue * 3, 20000000))}</span>
          </div>
        </div>

        {/* 2. Monthly Burn Rate */}
        <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-100">
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-semibold text-gray-700">Monthly Burn Rate (₹)</label>
            <span className="text-xs font-bold text-red-600">{formatINR(formData.monthly_burn_rate)}</span>
          </div>
          <input 
            type="range" 
            name="monthly_burn_rate" 
            min="50000" 
            max={Math.max(initialData.monthly_burn_rate * 3, 15000000)} 
            step="50000" 
            value={formData.monthly_burn_rate} 
            onChange={handleSliderChange} 
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500" 
          />
          <div className="flex justify-between text-[10px] text-gray-400 mt-1">
            <span>₹50K</span>
            <span>{formatINR(Math.max(initialData.monthly_burn_rate * 3, 15000000))}</span>
          </div>
        </div>

        {/* 3. Customer Growth % */}
        <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-100">
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-semibold text-gray-700">Customer Growth (MoM)</label>
            <span className="text-xs font-bold text-green-600">{formData.customer_growth}%</span>
          </div>
          <input 
            type="range" 
            name="customer_growth" 
            min="-10" 
            max="100" 
            step="1" 
            value={formData.customer_growth} 
            onChange={handleSliderChange} 
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600" 
          />
          <div className="flex justify-between text-[10px] text-gray-400 mt-1">
            <span>-10%</span>
            <span>100%</span>
          </div>
        </div>

        {/* 4. Customer Retention % */}
        <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-100">
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-semibold text-gray-700">Customer Retention (%)</label>
            <span className="text-xs font-bold text-blue-600">{formData.customer_retention}%</span>
          </div>
          <input 
            type="range" 
            name="customer_retention" 
            min="20" 
            max="99" 
            step="1" 
            value={formData.customer_retention} 
            onChange={handleSliderChange} 
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" 
          />
          <div className="flex justify-between text-[10px] text-gray-400 mt-1">
            <span>20%</span>
            <span>99%</span>
          </div>
        </div>

        {/* 5. Total Funding */}
        <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-100">
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-semibold text-gray-700">Total Funding (₹)</label>
            <span className="text-xs font-bold text-indigo-600">{formatINR(formData.funding)}</span>
          </div>
          <input 
            type="range" 
            name="funding" 
            min="0" 
            max={Math.max(initialData.funding * 3, 100000000)} 
            step="500000" 
            value={formData.funding} 
            onChange={handleSliderChange} 
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
          />
          <div className="flex justify-between text-[10px] text-gray-400 mt-1">
            <span>₹0</span>
            <span>{formatINR(Math.max(initialData.funding * 3, 100000000))}</span>
          </div>
        </div>

        {/* 6. Employees */}
        <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-100">
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-semibold text-gray-700">Total Employees</label>
            <span className="text-xs font-bold text-gray-900">{formData.employees} members</span>
          </div>
          <input 
            type="range" 
            name="employees" 
            min="1" 
            max={Math.max(initialData.employees * 3, 150)} 
            step="1" 
            value={formData.employees} 
            onChange={handleSliderChange} 
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-700" 
          />
          <div className="flex justify-between text-[10px] text-gray-400 mt-1">
            <span>1</span>
            <span>{Math.max(initialData.employees * 3, 150)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          Adjust sliders above to test growth and burn scenarios against the trained Decision Tree model.
        </p>
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          {hasRecalculated && (
            <button
              onClick={handleReset}
              className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Reset to Baseline
            </button>
          )}
          <button
            onClick={handleRecalculate}
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            Recalculate Probability
          </button>
        </div>
      </div>
    </div>
  )
}

export default ScenarioSimulator
