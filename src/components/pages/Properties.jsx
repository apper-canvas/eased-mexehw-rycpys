import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import PropertyFilters from '@/components/organisms/PropertyFilters'
import PropertyGrid from '@/components/organisms/PropertyGrid'
import FilterPanel from '@/components/molecules/FilterPanel'
import propertyService from '@/services/api/propertyService'

const Properties = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [viewType, setViewType] = useState('grid')
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false)
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [filters, setFilters] = useState({
    priceMin: 0,
    priceMax: 2000000,
    bedrooms: 0,
    bathrooms: 0,
    propertyTypes: [],
    location: searchParams.get('search') || ''
  })

useEffect(() => {
    // Update URL params when search changes
    if (searchTerm) {
      setSearchParams({ search: searchTerm })
    } else {
      setSearchParams({})
    }
  }, [searchTerm, setSearchParams])

  // Consolidated search function to prevent race conditions
  useEffect(() => {
    const performSearch = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await propertyService.search({
          ...filters,
          location: searchTerm
        })
        setProperties(result)
      } catch (err) {
        setError(err.message || 'Failed to load properties')
      } finally {
        setLoading(false)
      }
    }

    performSearch()
  }, [searchTerm, filters])

const handleSearch = (term) => {
    setSearchTerm(term)
    setFilters(prev => ({ ...prev, location: term }))
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  const handleViewChange = (view) => {
    setViewType(view)
    if (view === 'map') {
      // Navigate to map view
      window.location.href = '/map'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Filters Header */}
      <PropertyFilters
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onViewChange={handleViewChange}
        currentView={viewType}
        searchTerm={searchTerm}
        filters={filters}
        resultCount={properties.length}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
              <h2 className="text-lg font-semibold text-surface-900 mb-4">Filters</h2>
              <FilterPanel
                isOpen={true}
                onClose={() => {}}
                onFilterChange={handleFilterChange}
                currentFilters={filters}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <PropertyGrid
                properties={properties}
                loading={loading}
                error={error}
                viewType={viewType}
onRetry={() => window.location.reload()}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Properties