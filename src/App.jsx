import { useState } from "react"
import data from "./data.json"

const states = [...new Set(data.properties.map(p => p.state))]
  .sort()
  .map(code => ({
    code,
    name: data.properties.find(p => p.state === code).stateName
  }))

const propertyTypes = [...new Set(data.properties.map(p => p.propertyType))].sort()

function ResultCard({ property, showState }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            {showState ? property.stateName : property.propertyType}
          </h2>
          {showState && (
            <span className="text-sm text-gray-400">{property.propertyType}</span>
          )}
        </div>
        <span className="text-2xl font-bold text-blue-700">
          {property.dormancyPeriod} {property.dormancyUnit}
        </span>
      </div>
      <div className="space-y-2 text-sm text-gray-600">
        <div>
          <span className="font-medium text-gray-700">Trigger: </span>
          {property.triggerDescription}
        </div>
        {property.rpoApplies && (
          <div className="text-amber-600 font-medium">
            ⚠ RPO (Returned Post Office mail) applies to this property type
          </div>
        )}
        <div>
          <span className="font-medium text-gray-700">Due Diligence: </span>
          {property.dueDiligenceRequired
            ? `Required for amounts over $${property.dueDiligenceThreshold}`
            : "Not required"}
        </div>
        {property.notes && (
          <div>
            <span className="font-medium text-gray-700">Notes: </span>
            {property.notes}
          </div>
        )}
        <div className="pt-2 border-t border-gray-100">
          <span className="font-medium text-gray-700">Statute: </span>
          <span className="font-mono text-blue-600">{property.statute}</span>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [mode, setMode] = useState("by-state")
  const [selectedState, setSelectedState] = useState("")
  const [selectedType, setSelectedType] = useState("")

  const results = data.properties.filter(p => {
    if (mode === "by-state") {
      return p.state === selectedState
    } else {
      return p.propertyType === selectedType
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900">Unclaimed Property Dormancy Requirements</h1>
          <p className="text-gray-500 mt-1">Dormancy requirements by state and property type</p>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setMode("by-state"); setSelectedState(""); setSelectedType("") }}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              mode === "by-state"
                ? "bg-blue-700 text-white"
                : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Search by State
          </button>
          <button
            onClick={() => { setMode("by-type"); setSelectedState(""); setSelectedType("") }}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              mode === "by-type"
                ? "bg-blue-700 text-white"
                : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Search by Property Type
          </button>
        </div>

        {/* Selector */}
        <div className="mb-8">
          {mode === "by-state" ? (
            <select
              value={selectedState}
              onChange={e => setSelectedState(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a state...</option>
              {states.map(s => (
                <option key={s.code} value={s.code}>{s.name}</option>
              ))}
            </select>
          ) : (
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a property type...</option>
              {propertyTypes.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          )}
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            {results.map((p, i) => (
              <ResultCard key={i} property={p} showState={mode === "by-type"} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {(selectedState || selectedType) && results.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            No data available for this selection yet.
          </div>
        )}

      </div>
    </div>
  )
}