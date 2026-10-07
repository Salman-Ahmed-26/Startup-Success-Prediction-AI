import { Check } from 'lucide-react'

const ProgressSteps = ({ currentStep, steps }) => {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 z-0"></div>
        
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep

          return (
            <div key={index} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm border-2 transition-colors duration-200 ${
                  isCompleted 
                    ? 'bg-primary-600 border-primary-600 text-white' 
                    : isCurrent 
                      ? 'bg-white border-primary-600 text-primary-600' 
                      : 'bg-white border-gray-300 text-gray-400'
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
              </div>
              <div className="absolute top-12 whitespace-nowrap text-xs font-medium text-center">
                <span className={isCurrent ? 'text-primary-600' : 'text-gray-500'}>
                  {step}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ProgressSteps
