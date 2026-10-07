const SuccessProbability = ({ probability, label }) => {
  const percentage = (probability * 100).toFixed(1)
  
  let colorClass = 'bg-red-500'
  if (probability >= 0.7) colorClass = 'bg-green-500'
  else if (probability >= 0.4) colorClass = 'bg-yellow-500'

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-end mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Success Probability</h3>
        <span className="text-3xl font-bold text-gray-900">{percentage}%</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
        <div className={`h-4 rounded-full ${colorClass}`} style={{ width: `${percentage}%` }}></div>
      </div>
      
      <p className="text-sm font-medium text-gray-600 text-center">{label}</p>
    </div>
  )
}

export default SuccessProbability
