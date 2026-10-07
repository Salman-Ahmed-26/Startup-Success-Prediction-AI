import { Target } from 'lucide-react'

const StartupSegment = ({ segment, characteristics }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 border-b border-gray-100 pb-6">
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Market Position</p>
          <h3 className="text-2xl font-bold text-gray-900">{segment}</h3>
        </div>
        <div className="mt-4 md:mt-0 p-4 bg-primary-50 rounded-full">
          <Target className="w-8 h-8 text-primary-600" />
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Segment Characteristics</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {characteristics && Object.entries(characteristics).map(([key, value], idx) => (
            <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 capitalize">{key.replace(/_/g, ' ')}</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StartupSegment
