import { Loader2 } from 'lucide-react'

const LoadingState = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-sm border border-gray-100 min-h-[400px]">
      <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
      <h3 className="text-xl font-medium text-gray-900">{message}</h3>
      <p className="text-gray-500 mt-2 text-center max-w-sm">
        Please wait while our machine learning models analyze the data and generate insights.
      </p>
    </div>
  )
}

export default LoadingState
