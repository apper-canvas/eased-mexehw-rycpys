import { useState } from 'react'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import SearchBar from '@/components/molecules/SearchBar'
import FilterPanel from '@/components/molecules/FilterPanel'
import ViewToggle from '@/components/molecules/ViewToggle'
import Badge from '@/components/atoms/Badge'

const PropertyFilters = ({ 
  onSearch, 
  onFilterChange, 
  onViewChange, 
  currentView = 'grid',
  searchTerm = '',
  filters = {},
  resultCount = 0 
}) => {
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false)

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.priceMin > 0 || filters.priceMax < 2000000) count++
    if (filters.bedrooms > 0) count++
    if (filters.bathrooms > 0) count++
    if (filters.propertyTypes && filters.propertyTypes.length > 0) count++
    return count
  }

  const activeFilterCount = getActiveFilterCount()

return (
    <>
      {/* Modern Sticky Search Bar Section */}
      <div className="bg-gradient-to-r from-white via-surface-50/50 to-white border-b border-surface-200/80 backdrop-blur-sm sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="w-full">
            <SearchBar onSearch={onSearch} initialValue={searchTerm} />
          </div>
        </div>
      </div>

      {/* Modern Filter Controls Section */}
      <div className="bg-gradient-to-r from-white via-surface-50/30 to-white border-b border-surface-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
{/* Modern View Controls */}
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setIsFilterPanelOpen(true)}
                className="relative lg:hidden modern-button border-2 border-surface-300 hover:border-primary bg-white/80 backdrop-blur-sm shadow-sm"
              >
                <ApperIcon name="Filter" className="w-4 h-4 mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge 
                    variant="primary" 
                    size="sm"
                    className="absolute -top-2 -right-2 min-w-[22px] h-6 flex items-center justify-center p-1 bg-gradient-primary shadow-lg badge-pulse"
                  >
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </div>
            
            <ViewToggle currentView={currentView} onViewChange={onViewChange} />
          </div>

{/* Modern Results Count and Active Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gradient-primary rounded-full"></div>
              <p className="text-sm font-medium text-surface-700">
                {resultCount} {resultCount === 1 ? 'property' : 'properties'} found
                {searchTerm && (
                  <span className="text-primary font-semibold"> for "{searchTerm}"</span>
                )}
              </p>
            </div>

            {/* Modern Active Filters Desktop */}
            {activeFilterCount > 0 && (
              <div className="hidden lg:flex items-center space-x-3 bg-gradient-to-r from-surface-50/80 to-surface-100/50 px-4 py-2 rounded-xl border border-surface-200/50">
                <div className="flex items-center space-x-1">
                  <ApperIcon name="Filter" className="w-3 h-3 text-primary" />
                  <span className="text-sm font-medium text-surface-600">Active:</span>
                </div>
                {(filters.priceMin > 0 || filters.priceMax < 2000000) && (
                  <Badge variant="primary" size="sm" className="shadow-sm">
                    ${(filters.priceMin/1000).toFixed(0)}K - ${(filters.priceMax/1000).toFixed(0)}K
                  </Badge>
                )}
                {filters.bedrooms > 0 && (
                  <Badge variant="primary" size="sm" className="shadow-sm">{filters.bedrooms}+ Beds</Badge>
                )}
                {filters.bathrooms > 0 && (
                  <Badge variant="primary" size="sm" className="shadow-sm">{filters.bathrooms}+ Baths</Badge>
                )}
                {filters.propertyTypes && filters.propertyTypes.map(type => (
                  <Badge key={type} variant="primary" size="sm" className="shadow-sm">{type}</Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filter Panel */}
        <FilterPanel
          isOpen={isFilterPanelOpen}
          onClose={() => setIsFilterPanelOpen(false)}
          onFilterChange={onFilterChange}
          currentFilters={filters}
        />
      </div>
    </>
  )
}

export default PropertyFilters