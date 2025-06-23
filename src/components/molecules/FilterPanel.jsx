import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import PriceSlider from '@/components/atoms/PriceSlider'

const FilterPanel = ({ isOpen, onClose, onFilterChange, currentFilters = {} }) => {
  const [filters, setFilters] = useState({
    priceMin: 0,
    priceMax: 2000000,
    bedrooms: 0,
    bathrooms: 0,
    propertyTypes: [],
    ...currentFilters
  })

  const propertyTypes = ['House', 'Condo', 'Townhouse', 'Apartment']

  const handlePriceChange = (priceRange) => {
    setFilters(prev => ({
      ...prev,
      priceMin: priceRange[0],
      priceMax: priceRange[1]
    }))
  }

  const handleBedroomChange = (bedrooms) => {
    setFilters(prev => ({ ...prev, bedrooms }))
  }

  const handleBathroomChange = (bathrooms) => {
    setFilters(prev => ({ ...prev, bathrooms }))
  }

  const handlePropertyTypeToggle = (type) => {
    setFilters(prev => ({
      ...prev,
      propertyTypes: prev.propertyTypes.includes(type)
        ? prev.propertyTypes.filter(t => t !== type)
        : [...prev.propertyTypes, type]
    }))
  }

  const handleApplyFilters = () => {
    onFilterChange(filters)
    onClose()
  }

  const handleClearFilters = () => {
    const clearedFilters = {
      priceMin: 0,
      priceMax: 2000000,
      bedrooms: 0,
      bathrooms: 0,
      propertyTypes: []
    }
    setFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.priceMin > 0 || filters.priceMax < 2000000) count++
    if (filters.bedrooms > 0) count++
    if (filters.bathrooms > 0) count++
    if (filters.propertyTypes.length > 0) count++
    return count
  }

return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Enhanced Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm z-40 lg:hidden"
          />

          {/* Modern Filter Panel */}
          <motion.div
            initial={{ x: -350, opacity: 0, scale: 0.95 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: -350, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-80 glass-panel shadow-2xl z-50 lg:relative lg:w-full lg:h-auto lg:shadow-lg lg:rounded-2xl lg:border lg:border-surface-200/50"
          >
            <div className="p-6 h-full overflow-y-auto custom-scrollbar filter-panel-enter">
{/* Modern Header */}
              <div className="flex items-center justify-between mb-8 lg:hidden">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                    <ApperIcon name="Filter" className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">Filters</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-surface-100/80 rounded-xl transition-all duration-200 modern-button"
                >
                  <ApperIcon name="X" className="w-5 h-5 text-surface-600" />
                </button>
              </div>

              <div className="space-y-8">
{/* Modern Price Range */}
                <div className="filter-item-enter bg-gradient-to-r from-surface-50/50 to-surface-100/50 p-5 rounded-2xl border border-surface-200/50">
                  <div className="flex items-center space-x-2 mb-4">
                    <ApperIcon name="DollarSign" className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold text-surface-900">Price Range</h3>
                  </div>
                  <PriceSlider
                    value={[filters.priceMin, filters.priceMax]}
                    onChange={handlePriceChange}
                  />
                </div>

                {/* Modern Bedrooms */}
                <div className="filter-item-enter bg-gradient-to-r from-surface-50/50 to-surface-100/50 p-5 rounded-2xl border border-surface-200/50">
                  <div className="flex items-center space-x-2 mb-4">
                    <ApperIcon name="Bed" className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold text-surface-900">Bedrooms</h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
{[0, 1, 2, 3, 4, 5].map(num => (
                      <button
                        key={num}
                        onClick={() => handleBedroomChange(num)}
                        className={`px-5 py-3 rounded-xl border-2 transition-all duration-200 modern-button font-medium ${
                          filters.bedrooms === num
                            ? 'bg-gradient-primary text-white border-transparent shadow-lg'
                            : 'bg-white/80 text-surface-700 border-surface-300 hover:border-primary hover:bg-primary/5'
                        }`}
                      >
                        {num === 0 ? 'Any' : `${num}+`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Modern Bathrooms */}
                <div className="filter-item-enter bg-gradient-to-r from-surface-50/50 to-surface-100/50 p-5 rounded-2xl border border-surface-200/50">
                  <div className="flex items-center space-x-2 mb-4">
                    <ApperIcon name="Bath" className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold text-surface-900">Bathrooms</h3>
                  </div>
<div className="flex flex-wrap gap-3">
                    {[0, 1, 2, 3, 4].map(num => (
                      <button
                        key={num}
                        onClick={() => handleBathroomChange(num)}
                        className={`px-5 py-3 rounded-xl border-2 transition-all duration-200 modern-button font-medium ${
                          filters.bathrooms === num
                            ? 'bg-gradient-primary text-white border-transparent shadow-lg'
                            : 'bg-white/80 text-surface-700 border-surface-300 hover:border-primary hover:bg-primary/5'
                        }`}
                      >
                        {num === 0 ? 'Any' : `${num}+`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Modern Property Type */}
                <div className="filter-item-enter bg-gradient-to-r from-surface-50/50 to-surface-100/50 p-5 rounded-2xl border border-surface-200/50">
                  <div className="flex items-center space-x-2 mb-4">
                    <ApperIcon name="Home" className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold text-surface-900">Property Type</h3>
                  </div>
                  <div className="space-y-3">
{propertyTypes.map(type => (
                      <label
                        key={type}
                        className="flex items-center cursor-pointer p-3 rounded-xl hover:bg-surface-50/80 transition-all duration-200"
                      >
                        <input
                          type="checkbox"
                          checked={filters.propertyTypes.includes(type)}
                          onChange={() => handlePropertyTypeToggle(type)}
                          className="sr-only"
                        />
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center mr-4 transition-all duration-200 ${
                          filters.propertyTypes.includes(type)
                            ? 'bg-gradient-primary border-transparent shadow-md'
                            : 'border-surface-300 hover:border-primary bg-white'
                        }`}>
                          {filters.propertyTypes.includes(type) && (
                            <ApperIcon name="Check" className="w-3.5 h-3.5 text-white" />
                          )}
                        </div>
                        <span className="text-surface-700 font-medium">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

{/* Modern Active Filters */}
                {getActiveFilterCount() > 0 && (
                  <div className="filter-item-enter bg-gradient-to-r from-primary/5 to-accent/5 p-5 rounded-2xl border border-primary/20">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="Filter" className="w-4 h-4 text-primary" />
                        <h3 className="font-semibold text-surface-900">Active Filters</h3>
                      </div>
                      <button
                        onClick={handleClearFilters}
                        className="text-sm text-primary hover:text-primary/80 transition-colors px-3 py-1 rounded-lg hover:bg-primary/10"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(filters.priceMin > 0 || filters.priceMax < 2000000) && (
                        <Badge variant="primary" className="badge-pulse">
                          ${(filters.priceMin/1000).toFixed(0)}K - ${(filters.priceMax/1000).toFixed(0)}K
                        </Badge>
                      )}
                      {filters.bedrooms > 0 && (
                        <Badge variant="primary" className="badge-pulse">{filters.bedrooms}+ Bedrooms</Badge>
                      )}
                      {filters.bathrooms > 0 && (
                        <Badge variant="primary" className="badge-pulse">{filters.bathrooms}+ Bathrooms</Badge>
                      )}
                      {filters.propertyTypes.map(type => (
                        <Badge key={type} variant="primary" className="badge-pulse">{type}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Modern Action Buttons */}
                <div className="flex space-x-4 pt-8 lg:hidden">
                  <Button
                    variant="outline"
                    onClick={handleClearFilters}
                    className="flex-1 modern-button border-2 border-surface-300 hover:border-primary text-surface-700 hover:text-primary"
                  >
                    <ApperIcon name="RotateCcw" className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                  <Button
                    onClick={handleApplyFilters}
                    className="flex-1 modern-button bg-gradient-primary hover:shadow-xl"
                  >
                    <ApperIcon name="Check" className="w-4 h-4 mr-2" />
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default FilterPanel