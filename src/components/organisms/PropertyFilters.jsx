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
    <div className="bg-white border-b border-surface-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Search and Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
{/* Search Bar */}
          <div className="flex-1 max-w-2xl">
            <SearchBar onSearch={onSearch} initialValue={searchTerm} />
          </div>
          {/* View Controls */}
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setIsFilterPanelOpen(true)}
              className="relative lg:hidden"
            >
              <ApperIcon name="Filter" className="w-4 h-4 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <Badge 
                  variant="primary" 
                  size="sm"
                  className="absolute -top-2 -right-2 min-w-[20px] h-5 flex items-center justify-center p-1"
                >
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
            
            <ViewToggle currentView={currentView} onViewChange={onViewChange} />
          </div>
        </div>

        {/* Results Count and Active Filters */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-surface-600">
            {resultCount} {resultCount === 1 ? 'property' : 'properties'} found
            {searchTerm && (
              <span> for "{searchTerm}"</span>
            )}
          </p>

          {/* Active Filters Desktop */}
          {activeFilterCount > 0 && (
            <div className="hidden lg:flex items-center space-x-2">
              <span className="text-sm text-surface-600">Filters:</span>
              {(filters.priceMin > 0 || filters.priceMax < 2000000) && (
                <Badge variant="primary" size="sm">
                  ${(filters.priceMin/1000).toFixed(0)}K - ${(filters.priceMax/1000).toFixed(0)}K
                </Badge>
              )}
              {filters.bedrooms > 0 && (
                <Badge variant="primary" size="sm">{filters.bedrooms}+ Beds</Badge>
              )}
              {filters.bathrooms > 0 && (
                <Badge variant="primary" size="sm">{filters.bathrooms}+ Baths</Badge>
              )}
              {filters.propertyTypes && filters.propertyTypes.map(type => (
                <Badge key={type} variant="primary" size="sm">{type}</Badge>
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
  )
}

export default PropertyFilters