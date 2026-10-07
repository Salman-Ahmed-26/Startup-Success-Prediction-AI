import { useState } from 'react'
import ProgressSteps from '../components/ProgressSteps'
import StartupForm from '../components/StartupForm'

const Analyze = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const steps = ['Startup Info', 'Team', 'Financials', 'Market & Growth']

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Analyze Your Startup</h1>
        <p className="mt-2 text-gray-500">Provide your metrics to get AI-driven insights.</p>
      </div>

      <div className="mb-8">
        <ProgressSteps currentStep={currentStep} steps={steps} />
      </div>

      <StartupForm currentStep={currentStep} setCurrentStep={setCurrentStep} />
    </div>
  )
}

export default Analyze
