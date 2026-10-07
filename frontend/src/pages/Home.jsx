import { Link } from 'react-router-dom'
import { 
  Activity, BarChart2, ShieldAlert, Target, ArrowRight, 
  CheckCircle2, Sparkles, TrendingUp, Layers, Cpu, ShieldCheck 
} from 'lucide-react'
import { formatINR } from '../utils/format'

const Home = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Next-Gen Machine Learning for Startup Founders</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
          Know your startup's <span className="text-indigo-600">potential</span><br /> before you scale.
        </h1>
        
        <p className="mt-4 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
          Analyze your startup's financial, market and growth signals with machine learning and get actionable insights.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-5">
          <Link 
            to="/analyze" 
            className="px-8 py-4 text-base font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all hover:shadow-md w-full sm:w-auto flex items-center justify-center"
          >
            Analyze My Startup
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <a 
            href="#how-it-works" 
            className="px-8 py-4 text-base font-semibold rounded-xl text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-all w-full sm:w-auto"
          >
            How It Works
          </a>
        </div>

        {/* Live Interactive Analytics Dashboard Preview */}
        <div className="mt-16 max-w-5xl mx-auto bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-xl text-left">
          <div className="flex flex-wrap items-center justify-between pb-4 mb-6 border-b border-gray-100 gap-2">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="text-xs font-semibold text-gray-400 ml-2">Startup Intelligence Report Preview</span>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Live Model Diagnostics
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
              <span className="text-xs text-indigo-600 font-semibold uppercase">Success Probability</span>
              <p className="text-2xl font-extrabold text-indigo-950 mt-1">88%</p>
              <span className="text-[11px] text-indigo-700 font-medium">High Success Potential</span>
            </div>
            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
              <span className="text-xs text-emerald-600 font-semibold uppercase">Health Score</span>
              <p className="text-2xl font-extrabold text-emerald-950 mt-1">87 / 100</p>
              <span className="text-[11px] text-emerald-700 font-medium">Strong Capital Efficiency</span>
            </div>
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
              <span className="text-xs text-blue-600 font-semibold uppercase">Est. Annual Revenue</span>
              <p className="text-2xl font-extrabold text-blue-950 mt-1">₹5.08 Cr</p>
              <span className="text-[11px] text-blue-700 font-medium">+51.3% Projected Growth</span>
            </div>
            <div className="bg-green-50/50 p-4 rounded-xl border border-green-100">
              <span className="text-xs text-green-600 font-semibold uppercase">Risk Level</span>
              <p className="text-2xl font-extrabold text-green-950 mt-1">Low Risk</p>
              <span className="text-[11px] text-green-700 font-medium">Sustainable Unit Economics</span>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-600 gap-3">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Multi-Algorithm Voting: Decision Tree (81.8% Acc) + k-NN (87.8% Acc)</span>
            </div>
            <Link to="/analyze" className="text-indigo-600 font-bold hover:underline flex items-center">
              Generate for your startup <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section id="features" className="py-20 bg-gray-50/70 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Core Machine Learning Engines</h2>
            <p className="mt-3 text-base text-gray-500 max-w-2xl mx-auto">
              Four specialized algorithms trained on comprehensive startup indicators working together to evaluate your business fundamentals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={Activity}
              title="Success Prediction"
              badge="Decision Tree"
              description="Evaluates operational and growth signals to predict startup success probability with exact feature importance attribution."
            />
            <FeatureCard 
              icon={BarChart2}
              title="Revenue Forecast"
              badge="Linear Regression"
              description="Forecasts 12-month forward annual recurring revenue (ARR) with high R² precision based on current monetization velocity."
            />
            <FeatureCard 
              icon={ShieldAlert}
              title="Risk Analysis"
              badge="Multi-Factor Metric"
              description="Identifies operational vulnerabilities in cash runway, customer churn, and customer acquisition efficiency before they compound."
            />
            <FeatureCard 
              icon={Target}
              title="Startup Segmentation"
              badge="K-Means Clustering"
              description="Groups companies into Early Stage, Growth Stage, High Growth, and High Risk segments using unsupervised vector clustering."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Simple 4-Step Process</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-2">How StartupAI Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-gray-50/70 p-6 rounded-2xl border border-gray-100 text-center">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center mx-auto mb-4 text-sm">1</div>
              <h4 className="font-bold text-gray-900 mb-2">Enter Startup Metrics</h4>
              <p className="text-xs text-gray-500 leading-relaxed">Provide basic details regarding your industry, team composition, funding, revenue, and retention.</p>
            </div>

            <div className="bg-gray-50/70 p-6 rounded-2xl border border-gray-100 text-center">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center mx-auto mb-4 text-sm">2</div>
              <h4 className="font-bold text-gray-900 mb-2">ML Pipeline Execution</h4>
              <p className="text-xs text-gray-500 leading-relaxed">FastAPI feeds normalized metrics through trained Decision Tree, KNN, Linear Regression, and K-Means models.</p>
            </div>

            <div className="bg-gray-50/70 p-6 rounded-2xl border border-gray-100 text-center">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center mx-auto mb-4 text-sm">3</div>
              <h4 className="font-bold text-gray-900 mb-2">Instant Health Report</h4>
              <p className="text-xs text-gray-500 leading-relaxed">Receive your calculated health score, ARR forecast, risk level, strengths, and prioritized recommendations.</p>
            </div>

            <div className="bg-gray-50/70 p-6 rounded-2xl border border-gray-100 text-center">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center mx-auto mb-4 text-sm">4</div>
              <h4 className="font-bold text-gray-900 mb-2">What-If Simulation</h4>
              <p className="text-xs text-gray-500 leading-relaxed">Adjust revenue, burn rate, and customer growth sliders to immediately see live model probability updates.</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link 
              to="/analyze" 
              className="inline-flex items-center px-8 py-3.5 text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all"
            >
              Start Free Assessment Now <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

const FeatureCard = ({ icon: Icon, title, badge, description }) => (
  <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
    <div>
      <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      </div>
      <span className="inline-block text-[11px] font-semibold text-indigo-600 bg-indigo-50/70 px-2 py-0.5 rounded-md mb-3">
        {badge}
      </span>
      <p className="text-gray-500 text-xs leading-relaxed">{description}</p>
    </div>
  </div>
)

export default Home
