import { AlertOctagon } from 'lucide-react'

const RiskCard = ({ riskLevel, risks }) => {
  let headerClass = 'bg-red-50 text-red-700'
  let iconClass = 'text-red-500'
  
  if (riskLevel === 'Low') {
    headerClass = 'bg-green-50 text-green-700'
    iconClass = 'text-green-500'
  } else if (riskLevel === 'Medium') {
    headerClass = 'bg-yellow-50 text-yellow-700'
    iconClass = 'text-yellow-500'
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className={`p-4 border-b border-gray-100 flex items-center ${headerClass}`}>
        <AlertOctagon className={`w-6 h-6 mr-3 ${iconClass}`} />
        <h3 className="text-lg font-semibold">Risk Level: {riskLevel}</h3>
      </div>
      <div className="p-6">
        {risks && risks.length > 0 ? (
          <ul className="space-y-3">
            {risks.map((risk, idx) => (
              <li key={idx} className="flex items-start">
                <span className={`inline-block w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 ${iconClass.replace('text', 'bg')}`}></span>
                <span className="text-gray-700 text-sm">{risk}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No significant risks identified.</p>
        )}
      </div>
    </div>
  )
}

export default RiskCard
