import { Database, Network, LineChart, PieChart } from 'lucide-react'

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About StartupAI</h1>
        <p className="text-xl text-gray-500">Understanding the intelligence behind the platform.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">The Platform</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          StartupAI leverages advanced machine learning models to analyze early-stage startup data and predict outcomes. 
          By examining hundreds of historical data points from successful and failed startups, our system identifies 
          patterns that human investors might miss.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Our goal is to provide founders with objective, data-driven feedback on their business fundamentals, 
          highlighting potential risks before they become critical and identifying key strengths to double down on.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Our Machine Learning Models</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ModelCard 
          icon={Network}
          title="Decision Tree & KNN"
          subtitle="Classification Models"
          description="We use an ensemble of Decision Trees and K-Nearest Neighbors to classify your startup's success probability. These models evaluate your input against historical startup profiles."
        />
        <ModelCard 
          icon={LineChart}
          title="Linear Regression"
          subtitle="Revenue Forecasting"
          description="Our regression model analyzes financial trajectories to predict your Annual Recurring Revenue (ARR) 12 months into the future based on your current metrics and growth rates."
        />
        <ModelCard 
          icon={PieChart}
          title="K-Means Clustering"
          subtitle="Startup Segmentation"
          description="We segment your startup into distinct clusters based on shared characteristics. This helps identify your market position and compares you to relevant peers, not just the general market."
        />
        <ModelCard 
          icon={Database}
          title="Feature Importance"
          subtitle="Insight Generation"
          description="By analyzing which variables have the most weight in our models' decisions, we generate specific, actionable recommendations tailored to your unique situation."
        />
      </div>
    </div>
  )
}

const ModelCard = ({ icon: Icon, title, subtitle, description }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center mb-4">
      <div className="p-3 bg-primary-50 rounded-lg mr-4">
        <Icon className="w-6 h-6 text-primary-600" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <p className="text-sm font-medium text-gray-500">{subtitle}</p>
      </div>
    </div>
    <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
  </div>
)

export default About
