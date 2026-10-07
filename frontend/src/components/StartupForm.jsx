import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { predictStartup, predictRevenue, predictCluster } from '../services/api'
import LoadingState from './LoadingState'
import { formatINR } from '../utils/format'
import { ArrowRight, ArrowLeft, Sparkles, Building, Users, DollarSign, TrendingUp, HelpCircle } from 'lucide-react'

const INDUSTRIES = ['Technology', 'Healthcare', 'Fintech', 'E-commerce', 'EdTech', 'FoodTech', 'SaaS', 'AI/ML', 'CleanTech', 'Logistics']
const LOCATIONS = ['Mumbai', 'Bangalore', 'Delhi', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata', 'Other']

const DEMO_STARTUPS = {
  highGrowth: {
    startup_name: 'NexusAI Health',
    industry: 'Healthcare',
    location: 'Bangalore',
    startup_age: 2.5,
    founders: 2,
    employees: 28,
    founder_experience: 8,
    technical_team_size: 16,
    business_team_size: 12,
    funding: 45000000,
    investors: 4,
    funding_rounds: 2,
    monthly_revenue: 3200000,
    monthly_burn_rate: 2400000,
    marketing_budget: 700000,
    market_size: 15000000000,
    customers: 4500,
    customer_growth: 32.5,
    customer_retention: 88,
    customer_acquisition_cost: 1400
  },
  earlyStage: {
    startup_name: 'PaySprint Labs',
    industry: 'Fintech',
    location: 'Mumbai',
    startup_age: 1.0,
    founders: 2,
    employees: 6,
    founder_experience: 4,
    technical_team_size: 4,
    business_team_size: 2,
    funding: 5000000,
    investors: 1,
    funding_rounds: 1,
    monthly_revenue: 250000,
    monthly_burn_rate: 450000,
    marketing_budget: 80000,
    market_size: 8000000000,
    customers: 320,
    customer_growth: 14.0,
    customer_retention: 76,
    customer_acquisition_cost: 850
  }
}

const StartupForm = ({ currentStep, setCurrentStep }) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const [formData, setFormData] = useState({
    startup_name: 'NexusAI Health',
    industry: INDUSTRIES[0],
    location: LOCATIONS[1],
    startup_age: 2.5,
    founders: 2,
    employees: 25,
    founder_experience: 7,
    technical_team_size: 14,
    business_team_size: 11,
    funding: 40000000,
    investors: 3,
    funding_rounds: 2,
    monthly_revenue: 2800000,
    monthly_burn_rate: 2100000,
    marketing_budget: 600000,
    market_size: 12000000000,
    customers: 3800,
    customer_growth: 26.5,
    customer_retention: 86.0,
    customer_acquisition_cost: 1200
  })

  const handleChange = (e) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
    }))
  }

  const loadDemo = (type) => {
    if (DEMO_STARTUPS[type]) {
      setFormData(DEMO_STARTUPS[type])
    }
  }

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 3))
  const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 0))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const [startupRes, revenueRes, clusterRes] = await Promise.all([
        predictStartup(formData),
        predictRevenue(formData),
        predictCluster(formData)
      ])
      
      navigate('/results', {
        state: {
          formData,
          prediction: startupRes.data,
          revenue: revenueRes.data,
          cluster: clusterRes.data
        }
      })
    } catch (err) {
      console.error('Error during prediction:', err)
      setError(err.response?.data?.detail || 'Unable to connect to the prediction engine. Ensure FastAPI backend is running.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingState message="Running multi-model AI analysis on your startup metrics..." />

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100 max-w-4xl mx-auto">
      {/* Demo Preset Selector */}
      <div className="flex flex-wrap items-center justify-between pb-6 mb-8 border-b border-gray-100 gap-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Step {currentStep + 1} of 4</span>
          <h2 className="text-2xl font-bold text-gray-900 mt-0.5">
            {currentStep === 0 && "Step 1: General Information"}
            {currentStep === 1 && "Step 2: Founding & Team Composition"}
            {currentStep === 2 && "Step 3: Financial Fundamentals"}
            {currentStep === 3 && "Step 4: Market Dynamics & Growth"}
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500 font-medium mr-1">Quick Demo:</span>
          <button
            type="button"
            onClick={() => loadDemo('highGrowth')}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
          >
            High Growth Demo
          </button>
          <button
            type="button"
            onClick={() => loadDemo('earlyStage')}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Early Stage Demo
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm">
          {error}
        </div>
      )}

      {/* STEP 1: Startup Basics */}
      <div className={currentStep === 0 ? 'block space-y-6' : 'hidden'}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Startup Name *</label>
            <input 
              required 
              type="text" 
              name="startup_name" 
              placeholder="e.g. NexusAI Health" 
              value={formData.startup_name} 
              onChange={handleChange} 
              className="w-full p-3.5 bg-gray-50/60 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Startup Age (Years) *</label>
            <input 
              required 
              type="number" 
              min="0" 
              max="30" 
              step="0.5" 
              name="startup_age" 
              value={formData.startup_age} 
              onChange={handleChange} 
              className="w-full p-3.5 bg-gray-50/60 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Industry Sector *</label>
            <select 
              name="industry" 
              value={formData.industry} 
              onChange={handleChange} 
              className="w-full p-3.5 bg-gray-50/60 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm"
            >
              {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Headquarters Location *</label>
            <select 
              name="location" 
              value={formData.location} 
              onChange={handleChange} 
              className="w-full p-3.5 bg-gray-50/60 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm"
            >
              {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* STEP 2: Team Details */}
      <div className={currentStep === 1 ? 'block space-y-6' : 'hidden'}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Number of Co-Founders *</label>
            <input 
              required 
              type="number" 
              min="1" 
              max="10" 
              name="founders" 
              value={formData.founders} 
              onChange={handleChange} 
              className="w-full p-3.5 bg-gray-50/60 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Total Employees *</label>
            <input 
              required 
              type="number" 
              min="1" 
              max="1000" 
              name="employees" 
              value={formData.employees} 
              onChange={handleChange} 
              className="w-full p-3.5 bg-gray-50/60 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Avg Founder Experience (Years) *</label>
            <input 
              required 
              type="number" 
              min="0" 
              max="40" 
              step="0.5" 
              name="founder_experience" 
              value={formData.founder_experience} 
              onChange={handleChange} 
              className="w-full p-3.5 bg-gray-50/60 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Technical Team Members *</label>
            <input 
              required 
              type="number" 
              min="0" 
              max={formData.employees || 500} 
              name="technical_team_size" 
              value={formData.technical_team_size} 
              onChange={handleChange} 
              className="w-full p-3.5 bg-gray-50/60 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm" 
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Business & Operations Team Members *</label>
            <input 
              required 
              type="number" 
              min="0" 
              max={formData.employees || 500} 
              name="business_team_size" 
              value={formData.business_team_size} 
              onChange={handleChange} 
              className="w-full p-3.5 bg-gray-50/60 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm" 
            />
          </div>
        </div>
      </div>

      {/* STEP 3: Financials */}
      <div className={currentStep === 2 ? 'block space-y-6' : 'hidden'}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Total Funding (INR) *</label>
              <span className="text-xs font-bold text-indigo-600">{formatINR(formData.funding || 0)}</span>
            </div>
            <input 
              required 
              type="number" 
              min="0" 
              step="10000" 
              name="funding" 
              value={formData.funding} 
              onChange={handleChange} 
              className="w-full p-3.5 bg-gray-50/60 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Number of Investors *</label>
            <input 
              required 
              type="number" 
              min="0" 
              max="50" 
              name="investors" 
              value={formData.investors} 
              onChange={handleChange} 
              className="w-full p-3.5 bg-gray-50/60 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Funding Rounds Completed *</label>
            <input 
              required 
              type="number" 
              min="0" 
              max="15" 
              name="funding_rounds" 
              value={formData.funding_rounds} 
              onChange={handleChange} 
              className="w-full p-3.5 bg-gray-50/60 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm" 
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Monthly Revenue (INR) *</label>
              <span className="text-xs font-bold text-indigo-600">{formatINR(formData.monthly_revenue || 0)}</span>
            </div>
            <input 
              required 
              type="number" 
              min="0" 
              step="10000" 
              name="monthly_revenue" 
              value={formData.monthly_revenue} 
              onChange={handleChange} 
              className="w-full p-3.5 bg-gray-50/60 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm" 
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Monthly Burn Rate (INR) *</label>
              <span className="text-xs font-bold text-red-600">{formatINR(formData.monthly_burn_rate || 0)}</span>
            </div>
            <input 
              required 
              type="number" 
              min="0" 
              step="10000" 
              name="monthly_burn_rate" 
              value={formData.monthly_burn_rate} 
              onChange={handleChange} 
              className="w-full p-3.5 bg-gray-50/60 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm" 
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Monthly Marketing Budget (INR) *</label>
              <span className="text-xs font-bold text-gray-700">{formatINR(formData.marketing_budget || 0)}</span>
            </div>
            <input 
              required 
              type="number" 
              min="0" 
              step="10000" 
              name="marketing_budget" 
              value={formData.marketing_budget} 
              onChange={handleChange} 
              className="w-full p-3.5 bg-gray-50/60 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm" 
            />
          </div>
        </div>
      </div>

      {/* STEP 4: Market & Growth */}
      <div className={currentStep === 3 ? 'block space-y-6' : 'hidden'}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Addressable Market Size (INR) *</label>
              <span className="text-xs font-bold text-indigo-600">{formatINR(formData.market_size || 0)}</span>
            </div>
            <input 
              required 
              type="number" 
              min="1000000" 
              name="market_size" 
              value={formData.market_size} 
              onChange={handleChange} 
              className="w-full p-3.5 bg-gray-50/60 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Active Paying Customers *</label>
            <input 
              required 
              type="number" 
              min="0" 
              name="customers" 
              value={formData.customers} 
              onChange={handleChange} 
              className="w-full p-3.5 bg-gray-50/60 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Month-over-Month Customer Growth (%) *</label>
            <input 
              required 
              type="number" 
              min="-10" 
              max="100" 
              step="0.5" 
              name="customer_growth" 
              value={formData.customer_growth} 
              onChange={handleChange} 
              className="w-full p-3.5 bg-gray-50/60 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Customer Retention Rate (%) *</label>
            <input 
              required 
              type="number" 
              min="10" 
              max="99" 
              step="0.5" 
              name="customer_retention" 
              value={formData.customer_retention} 
              onChange={handleChange} 
              className="w-full p-3.5 bg-gray-50/60 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm" 
            />
          </div>
          <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Customer Acquisition Cost / CAC (INR) *</label>
              <span className="text-xs font-bold text-gray-700">{formatINR(formData.customer_acquisition_cost || 0)}</span>
            </div>
            <input 
              required 
              type="number" 
              min="0" 
              step="50" 
              name="customer_acquisition_cost" 
              value={formData.customer_acquisition_cost} 
              onChange={handleChange} 
              className="w-full p-3.5 bg-gray-50/60 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm" 
            />
          </div>
        </div>
      </div>

      {/* Navigation Footer Controls */}
      <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between">
        {currentStep > 0 ? (
          <button 
            type="button" 
            onClick={handlePrev} 
            className="px-6 py-3 border border-gray-200 text-gray-700 text-sm rounded-xl hover:bg-gray-50 font-semibold transition-colors flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous Step
          </button>
        ) : (
          <div></div>
        )}
        
        {currentStep < 3 ? (
          <button 
            type="button" 
            onClick={handleNext} 
            className="px-7 py-3 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-700 font-semibold transition-all shadow-sm flex items-center"
          >
            Next Step
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        ) : (
          <button 
            type="submit" 
            className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Startup Report
          </button>
        )}
      </div>
    </form>
  )
}

export default StartupForm
