import { useEffect } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import MetricCard from '../components/MetricCard'
import HealthScore from '../components/HealthScore'
import SuccessProbability from '../components/SuccessProbability'
import RiskCard from '../components/RiskCard'
import StrengthsCard from '../components/StrengthsCard'
import Recommendations from '../components/Recommendations'
import RevenueForecast from '../components/RevenueForecast'
import StartupSegment from '../components/StartupSegment'
import FeatureImportance from '../components/FeatureImportance'
import ModelComparison from '../components/ModelComparison'
import ScenarioSimulator from '../components/ScenarioSimulator'
import { formatINR } from '../utils/format'
import { Target, Activity, DollarSign, AlertTriangle, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react'

const Results = () => {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!location.state || !location.state.prediction) {
      navigate('/analyze')
    }
  }, [location, navigate])

  if (!location.state || !location.state.prediction) return null

  const { formData, prediction, revenue, cluster } = location.state

  const healthScore = prediction.health_score || 75
  const successProb = prediction.success_probability || 0.8
  const riskLevel = prediction.risk_level || (prediction.risk_assessment && prediction.risk_assessment.risk_level) || 'Low'
  const predictedRev = (revenue && (revenue.predicted_annual_revenue || revenue.predicted_revenue_12m)) || (formData.monthly_revenue * 12)
  const risksList = prediction.risks || (prediction.risk_assessment && prediction.risk_assessment.identified_risks) || []

  // Risk styling
  let riskColorClass = 'text-green-600'
  let riskBgClass = 'bg-green-50'
  if (riskLevel === 'Moderate') {
    riskColorClass = 'text-amber-600'
    riskBgClass = 'bg-amber-50'
  } else if (riskLevel === 'High') {
    riskColorClass = 'text-red-600'
    riskBgClass = 'bg-red-50'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Navigation Breadcrumb & Back */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
        <Link to="/analyze" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Edit Assessment Details
        </Link>
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
            {formData.industry} • {formData.location}
          </span>
          <span className="text-xs text-gray-400">
            Age: {formData.startup_age} {formData.startup_age === 1 ? 'Year' : 'Years'}
          </span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-gray-900 to-indigo-950 text-white rounded-2xl p-8 mb-8 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-extrabold tracking-tight text-white">{formData.startup_name || 'Your Startup'}</h1>
              <span className="px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                {prediction.prediction_label || 'Analysis Complete'}
              </span>
            </div>
            <p className="text-indigo-200 text-sm max-w-2xl">
              Comprehensive diagnostic generated from trained Decision Tree, KNN, Linear Regression, and K-Means models.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 px-6 border border-white/15 text-center min-w-[180px]">
            <span className="text-xs uppercase tracking-wider text-indigo-200 font-semibold block mb-1">Overall Health Score</span>
            <div className="flex items-baseline justify-center space-x-1">
              <span className="text-4xl font-extrabold text-white">{healthScore}</span>
              <span className="text-indigo-300 text-sm font-medium">/ 100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Four Main Summary Cards (Section 14) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <MetricCard 
          title="Success Probability" 
          value={`${(successProb * 100).toFixed(0)}%`}
          subtitle="Decision Tree Model Estimate"
          icon={Target}
          colorClass="text-indigo-600"
          bgClass="bg-indigo-50"
        />
        <MetricCard 
          title="Health Score" 
          value={`${healthScore} / 100`}
          subtitle="Holistic Viability Index"
          icon={Activity}
          colorClass="text-green-600"
          bgClass="bg-green-50"
        />
        <MetricCard 
          title="Estimated Annual Revenue" 
          value={formatINR(predictedRev)}
          subtitle="12-Month Forward Projection"
          icon={DollarSign}
          colorClass="text-blue-600"
          bgClass="bg-blue-50"
        />
        <MetricCard 
          title="Risk Level" 
          value={riskLevel}
          subtitle="Based on Financial Runway & Churn"
          icon={AlertTriangle}
          colorClass={riskColorClass}
          bgClass={riskBgClass}
        />
      </div>

      {/* Primary Analytics Grid: Health Gauge + Key Factors Driver */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-1 space-y-6">
          <HealthScore score={healthScore} />
          <SuccessProbability probability={successProb} label={prediction.prediction_label} />
        </div>
        <div className="lg:col-span-2">
          <FeatureImportance data={prediction.feature_importance} />
        </div>
      </div>

      {/* Strengths & Risks Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <StrengthsCard strengths={prediction.strengths} />
        <RiskCard riskLevel={riskLevel} risks={risksList} />
      </div>

      {/* Actionable Recommendations */}
      <div className="mb-10">
        <Recommendations recommendations={prediction.recommendations} />
      </div>

      {/* Revenue Forecast & Startup Profile / Segmentation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <RevenueForecast 
          currentRevenue={formData.monthly_revenue} 
          predictedRevenue={predictedRev} 
        />
        <StartupSegment 
          segment={cluster.cluster_name || cluster.segment || 'Growth Stage'} 
          characteristics={cluster.cluster_characteristics || cluster.characteristics} 
        />
      </div>

      {/* Model Benchmark Comparison (Decision Tree vs KNN) */}
      <div className="mb-10">
        <ModelComparison performanceData={prediction.model_performance} />
      </div>

      {/* Interactive What-If Scenario Simulator (Section 23) */}
      <div className="mb-10">
        <ScenarioSimulator 
          initialData={formData} 
          initialProbability={successProb} 
        />
      </div>
    </div>
  )
}

export default Results
