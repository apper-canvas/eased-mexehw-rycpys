import { useState, useEffect } from 'react'

const PriceSlider = ({ 
  min = 0, 
  max = 2000000, 
  value = [0, 2000000], 
  onChange,
  step = 10000,
  className = '' 
}) => {
  const [localValue, setLocalValue] = useState(value)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleMinChange = (e) => {
    const newMin = parseInt(e.target.value)
    const newValue = [newMin, Math.max(newMin, localValue[1])]
    setLocalValue(newValue)
    onChange?.(newValue)
  }

  const handleMaxChange = (e) => {
    const newMax = parseInt(e.target.value)
    const newValue = [Math.min(localValue[0], newMax), newMax]
    setLocalValue(newValue)
    onChange?.(newValue)
  }

  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`
    }
    if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K`
    }
    return `$${price.toLocaleString()}`
  }

return (
    <div className={`space-y-5 ${className}`}>
      <div className="flex justify-between items-center">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-3 py-2 rounded-lg">
          <span className="text-sm font-bold text-primary">{formatPrice(localValue[0])}</span>
        </div>
        <div className="h-px bg-gradient-to-r from-surface-200 via-primary/30 to-surface-200 flex-1 mx-3"></div>
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 px-3 py-2 rounded-lg">
          <span className="text-sm font-bold text-primary">{formatPrice(localValue[1])}</span>
        </div>
      </div>
      
<div className="relative py-2">
        {/* Modern Track */}
        <div className="h-3 modern-slider-track rounded-full shadow-inner relative">
          <div 
            className="h-3 modern-slider-fill rounded-full shadow-md absolute top-0"
            style={{
              left: `${(localValue[0] / max) * 100}%`,
              width: `${((localValue[1] - localValue[0]) / max) * 100}%`
            }}
          />
        </div>
        
        {/* Min slider - lower z-index */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue[0]}
          onChange={handleMinChange}
          className="absolute top-0 left-0 w-full h-7 bg-transparent appearance-none cursor-pointer slider-thumb z-10"
          style={{ pointerEvents: 'all' }}
        />
        
        {/* Max slider - higher z-index when values are close */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue[1]}
          onChange={handleMaxChange}
          className="absolute top-0 left-0 w-full h-7 bg-transparent appearance-none cursor-pointer slider-thumb z-20"
          style={{ pointerEvents: 'all' }}
        />
      </div>
      
<style jsx>{`
        .slider-thumb {
          pointer-events: all;
        }
        
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          cursor: grab;
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3), 0 1px 3px rgba(0,0,0,0.1);
          transition: all 0.15s ease;
          pointer-events: auto;
        }
        
        .slider-thumb:active::-webkit-slider-thumb {
          cursor: grabbing;
          transform: scale(1.05);
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.5), 0 2px 6px rgba(0,0,0,0.15);
        }
        
        .slider-thumb:hover::-webkit-slider-thumb {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4), 0 2px 4px rgba(0,0,0,0.12);
        }
        
        .slider-thumb::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          cursor: grab;
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3), 0 1px 3px rgba(0,0,0,0.1);
          transition: all 0.15s ease;
          pointer-events: auto;
        }
        
        .slider-thumb:active::-moz-range-thumb {
          cursor: grabbing;
          transform: scale(1.05);
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.5), 0 2px 6px rgba(0,0,0,0.15);
        }
        
        .slider-thumb:hover::-moz-range-thumb {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4), 0 2px 4px rgba(0,0,0,0.12);
        }
        
        .slider-thumb::-moz-range-track {
          background: transparent;
          border: none;
        }
      `}</style>
    </div>
  )
}

export default PriceSlider