import { Lightbulb } from 'lucide-react'

const Recommendations = ({ recommendations }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center mb-6">
        <div className="p-2 bg-indigo-50 rounded-lg mr-3">
          <Lightbulb className="w-6 h-6 text-indigo-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Actionable Recommendations</h3>
      </div>
      
      <div className="space-y-4">
        {recommendations && recommendations.length > 0 ? (
          recommendations.map((rec, idx) => {
            const isHighPriority = rec.toLowerCase().includes('critical') || rec.toLowerCase().includes('urgent') || rec.toLowerCase().includes('high priority');
            return (
              <div key={idx} className="flex items-start p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className={`mt-1 mr-4 px-2 py-1 text-xs font-bold rounded-full ${isHighPriority ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                  {isHighPriority ? 'HIGH' : 'MED'}
                </div>
                <p className="text-gray-700 text-sm">{rec}</p>
              </div>
            )
          })
        ) : (
          <p className="text-gray-500 text-sm italic">Keep up the good work!</p>
        )}
      </div>
    </div>
  )
}

export default Recommendations
