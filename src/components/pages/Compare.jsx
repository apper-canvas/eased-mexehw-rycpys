import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import SkeletonLoader from '@/components/atoms/SkeletonLoader'
import ErrorState from '@/components/atoms/ErrorState'
import EmptyState from '@/components/atoms/EmptyState'
import compareService from '@/services/api/compareService'
import propertyService from '@/services/api/propertyService'
import favoriteService from '@/services/api/favoriteService'

const Compare = () => {
  const [compareList, setCompareList] = useState([])
  const [properties, setProperties] = useState([])
  const [favorites, setFavorites] = useState([])
  const [availableProperties, setAvailableProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadCompareData()
  }, [])

const loadCompareData = async () => {
    setLoading(true)
    setError(null)
    try {
      // Load compare list and favorites
      const [compareItems, favs] = await Promise.all([
        compareService.getCompareList(),
        favoriteService.getAll()
      ])
      
      setCompareList(compareItems || [])
      setFavorites(favs || [])
      
      // Load favorite properties for selection
      if (favs && favs.length > 0) {
        const propertyIds = favs.map(fav => fav.propertyId)
        const availableProps = await propertyService.getMultiple(propertyIds)
        setAvailableProperties(availableProps || [])
      } else {
        setAvailableProperties([])
      }
      
      // Load properties for comparison
      if (compareItems && compareItems.length > 0) {
        const comparePropertyIds = compareItems.map(item => item.propertyId)
        const compareProps = await propertyService.getMultiple(comparePropertyIds)
        setProperties(compareProps || [])
      } else {
        setProperties([])
      }
    } catch (err) {
      console.error('Error loading comparison data:', err)
      setError(err.message || 'Failed to load comparison data')
      setCompareList([])
      setFavorites([])
      setAvailableProperties([])
      setProperties([])
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCompare = async (propertyId) => {
    try {
      await compareService.addToCompare(propertyId)
      toast.success('Property added to comparison')
      loadCompareData()
    } catch (error) {
      toast.error(error.message || 'Failed to add property to comparison')
    }
  }

  const handleRemoveFromCompare = async (propertyId) => {
    try {
      await compareService.removeFromCompare(propertyId)
      toast.success('Property removed from comparison')
      loadCompareData()
    } catch (error) {
      toast.error('Failed to remove property from comparison')
    }
  }

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear the comparison?')) {
      try {
        await compareService.clearCompare()
        toast.success('Comparison cleared')
        loadCompareData()
      } catch (error) {
        toast.error('Failed to clear comparison')
      }
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const isInCompare = (propertyId) => {
    return compareList.some(item => item.propertyId === propertyId)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <SkeletonLoader width="w-64" height="h-8" className="mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonLoader key={index} variant="card" height={400} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <ErrorState
          title="Failed to load comparison"
          message={error}
          onRetry={loadCompareData}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-display font-bold text-surface-900 mb-2">
              Compare Properties
            </h1>
            <p className="text-surface-600">
              {properties.length > 0 
                ? `Comparing ${properties.length} ${properties.length === 1 ? 'property' : 'properties'}`
                : 'Select properties from your favorites to compare'
              }
            </p>
          </div>
          
          {properties.length > 0 && (
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <Button
                onClick={handleClearAll}
                variant="outline"
                size="sm"
              >
                <ApperIcon name="Trash2" className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
          )}
        </motion.div>

        {/* Property Selection */}
        {availableProperties.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-white rounded-lg shadow-sm border border-surface-200 p-6"
          >
            <h2 className="text-lg font-semibold text-surface-900 mb-4">
              Add Properties to Compare ({compareList.length}/4)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {availableProperties.map((property) => (
                <div
                  key={property.Id}
                  className={`relative border rounded-lg p-4 transition-all ${
                    isInCompare(property.Id)
                      ? 'border-primary bg-primary/5'
                      : 'border-surface-200 hover:border-surface-300'
                  }`}
                >
                  <div className="aspect-w-16 aspect-h-9 mb-3">
                    <img
                      src={property.images?.[0] || '/placeholder.jpg'}
                      alt={property.title}
                      className="w-full h-24 object-cover rounded"
                    />
                  </div>
                  <h3 className="font-medium text-surface-900 text-sm mb-1 line-clamp-2">
                    {property.title}
                  </h3>
                  <p className="text-primary font-semibold text-sm mb-2">
                    {formatPrice(property.price)}
                  </p>
                  <Button
                    onClick={() => 
                      isInCompare(property.Id)
                        ? handleRemoveFromCompare(property.Id)
                        : handleAddToCompare(property.Id)
                    }
                    variant={isInCompare(property.Id) ? "outline" : "primary"}
                    size="xs"
                    className="w-full"
                    disabled={!isInCompare(property.Id) && compareList.length >= 4}
                  >
                    {isInCompare(property.Id) ? 'Remove' : 'Add to Compare'}
                  </Button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Comparison Table */}
        {properties.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-surface-200 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-surface-900 sticky left-0 bg-surface-50 z-10">
                      Property Details
                    </th>
                    {properties.map((property) => (
                      <th key={property.Id} className="px-6 py-4 text-center min-w-64">
                        <div className="space-y-2">
                          <img
                            src={property.images?.[0] || '/placeholder.jpg'}
                            alt={property.title}
                            className="w-full h-32 object-cover rounded"
                          />
                          <Link
                            to={`/properties/${property.Id}`}
                            className="text-sm font-medium text-surface-900 hover:text-primary line-clamp-2"
                          >
                            {property.title}
                          </Link>
                          <Button
                            onClick={() => handleRemoveFromCompare(property.Id)}
                            variant="outline"
                            size="xs"
                          >
                            <ApperIcon name="X" className="w-3 h-3" />
                          </Button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-200">
                  {/* Price */}
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-surface-900 sticky left-0 bg-white border-r border-surface-200">
                      Price
                    </td>
                    {properties.map((property) => (
                      <td key={property.Id} className="px-6 py-4 text-center text-sm text-primary font-semibold">
                        {formatPrice(property.price)}
                      </td>
                    ))}
                  </tr>
                  
                  {/* Bedrooms */}
                  <tr className="bg-surface-50">
                    <td className="px-6 py-4 text-sm font-medium text-surface-900 sticky left-0 bg-surface-50 border-r border-surface-200">
                      Bedrooms
                    </td>
                    {properties.map((property) => (
                      <td key={property.Id} className="px-6 py-4 text-center text-sm text-surface-700">
                        {property.bedrooms}
                      </td>
                    ))}
                  </tr>
                  
                  {/* Bathrooms */}
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-surface-900 sticky left-0 bg-white border-r border-surface-200">
                      Bathrooms
                    </td>
                    {properties.map((property) => (
                      <td key={property.Id} className="px-6 py-4 text-center text-sm text-surface-700">
                        {property.bathrooms}
                      </td>
                    ))}
                  </tr>
                  
                  {/* Square Feet */}
                  <tr className="bg-surface-50">
                    <td className="px-6 py-4 text-sm font-medium text-surface-900 sticky left-0 bg-surface-50 border-r border-surface-200">
                      Square Feet
                    </td>
{properties.map((property) => (
                      <td key={property.Id} className="px-6 py-4 text-center text-sm text-surface-700">
                        {property.square_feet?.toLocaleString() || 'N/A'}
                      </td>
                    ))}
                  </tr>
                  
                  {/* Property Type */}
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-surface-900 sticky left-0 bg-white border-r border-surface-200">
                      Type
                    </td>
{properties.map((property) => (
                      <td key={property.Id} className="px-6 py-4 text-center text-sm text-surface-700 capitalize">
                        {property.property_type}
                      </td>
                    ))}
                  </tr>
                  
                  {/* Location */}
                  <tr className="bg-surface-50">
                    <td className="px-6 py-4 text-sm font-medium text-surface-900 sticky left-0 bg-surface-50 border-r border-surface-200">
                      Location
                    </td>
                    {properties.map((property) => (
                      <td key={property.Id} className="px-6 py-4 text-center text-sm text-surface-700">
                        {property.city}, {property.state}
                      </td>
                    ))}
                  </tr>
                  
                  {/* Year Built */}
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-surface-900 sticky left-0 bg-white border-r border-surface-200">
                      Year Built
                    </td>
                    {properties.map((property) => (
                      <td key={property.Id} className="px-6 py-4 text-center text-sm text-surface-700">
                        {property.yearBuilt || 'N/A'}
                      </td>
                    ))}
                  </tr>
                  
                  {/* Actions */}
                  <tr className="bg-surface-50">
                    <td className="px-6 py-4 text-sm font-medium text-surface-900 sticky left-0 bg-surface-50 border-r border-surface-200">
                      Actions
                    </td>
                    {properties.map((property) => (
                      <td key={property.Id} className="px-6 py-4 text-center">
                        <div className="space-y-2">
                          <Link to={`/properties/${property.Id}`}>
                            <Button size="sm" className="w-full">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          <EmptyState
            icon="BarChart3"
            title="No properties to compare"
            message={
              availableProperties.length > 0
                ? "Select properties from your favorites above to start comparing."
                : "You need to add some properties to your favorites first."
            }
            actionLabel={availableProperties.length > 0 ? null : "Browse Properties"}
            onAction={availableProperties.length > 0 ? null : () => window.location.href = '/properties'}
          />
        )}
      </div>
    </div>
  )
}

export default Compare