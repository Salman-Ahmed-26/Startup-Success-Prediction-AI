import { CheckCircle2 } from 'lucide-react'

const StrengthsCard = ({ strengths }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-green-50 flex items-center text-green-800">
        <CheckCircle2 className="w-6 h-6 mr-3 text-green-600" />
        <h3 className="text-lg font-semibold">Key Strengths</h3>
      </div>
      <div className="p-6">
        {strengths && strengths.length > 0 ? (
          <ul className="space-y-3">
            {strengths.map((strength, idx) => (
              <li key={idx} className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-700 text-sm">{strength}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">More data needed to identify strengths.</p>
        )}
      </div>
    </div>
  )
}

export default StrengthsCard
