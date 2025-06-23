import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import PropertyCard from '@/components/molecules/PropertyCard'
import SkeletonLoader from '@/components/atoms/SkeletonLoader'
import ErrorState from '@/components/atoms/ErrorState'
import EmptyState from '@/components/atoms/EmptyState'
import favoriteService from '@/services/api/favoriteService'
import propertyService from '@/services/api/propertyService'

const Favorites = () => {
  const [favorites, setFavorites] = useState([])
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = async () => {
    setLoading(true)
    setError(null)
    try {
      const favs = await favoriteService.getAll()
      setFavorites(favs)
      
      // Load property details for each favorite
      if (favs.length > 0) {
        const propertyPromises = favs.map(fav => 
          propertyService.getById(fav.propertyId).catch(err => {
            console.error(`Failed to load property ${fav.propertyId}:`, err)
            return null
          })
        )
        
        const propertyResults = await Promise.all(propertyPromises)
        const validProperties = propertyResults.filter(prop => prop !== null)
        setProperties(validProperties)
      } else {
        setProperties([])
      }
    } catch (err) {
      setError(err.message || 'Failed to load favorites')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFromFavorites = async (propertyId) => {
    try {
      await favoriteService.deleteByPropertyId(propertyId)
      
      // Update local state
      setFavorites(prev => prev.filter(fav => fav.propertyId !== propertyId))
      setProperties(prev => prev.filter(prop => prop.Id !== propertyId))
      
      toast.success('Removed from favorites')
    } catch (error) {
      toast.error('Failed to remove from favorites')
    }
  }

  const handleClearAllFavorites = async () => {
    if (window.confirm('Are you sure you want to remove all favorites?')) {
      try {
        // Remove all favorites
        const deletePromises = favorites.map(fav => favoriteService.delete(fav.Id))
        await Promise.all(deletePromises)
        
        setFavorites([])
        setProperties([])
        toast.success('All favorites cleared')
      } catch (error) {
        toast.error('Failed to clear favorites')
      }
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-8">
            <SkeletonLoader width="w-64" height="h-8" className="mb-2" />
            <SkeletonLoader width="w-96" height="h-5" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonLoader key={index} variant="card" height={320} />
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
          title="Failed to load favorites"
          message={error}
          onRetry={loadFavorites}
        />
      </div>
    )
  }

  if (properties.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <EmptyState
          icon="Heart"
          title="No favorites yet"
          message="Start exploring properties and save your favorites to see them here."
          actionLabel="Browse Properties"
          onAction={() => window.location.href = '/properties'}
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
              My Favorites
            </h1>
            <p className="text-surface-600">
              {properties.length} {properties.length === 1 ? 'property' : 'properties'} saved
            </p>
          </div>
          
          {properties.length > 0 && (
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <Button
                onClick={handleClearAllFavorites}
                variant="outline"
                size="sm"
              >
                <ApperIcon name="Trash2" className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
          )}
        </motion.div>

        {/* Favorites Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {properties.map((property) => (
            <motion.div key={property.Id} variants={itemVariants}>
              <div className="relative">
                <PropertyCard
                  property={property}
                  isFavorite={true}
                  onFavoriteChange={() => handleRemoveFromFavorites(property.Id)}
                />
                
                {/* Favorite Badge */}
                <div className="absolute top-2 left-2 bg-error text-white px-2 py-1 rounded-md text-xs font-medium">
                  <ApperIcon name="Heart" className="w-3 h-3 inline mr-1 fill-current" />
                  Favorite
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-8">
            <h2 className="text-xl font-semibold text-surface-900 mb-4">
              Ready to take the next step?
            </h2>
            <p className="text-surface-600 mb-6">
              Compare your favorite properties or continue browsing to find more options.
            </p>
<div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => window.location.href = '/compare'}>
                <ApperIcon name="BarChart3" className="w-4 h-4 mr-2" />
                Compare Properties
              </Button>
              <Button variant="outline" size="lg" onClick={() => window.location.href = '/properties'}>
                <ApperIcon name="Search" className="w-4 h-4 mr-2" />
                Find More Properties
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Favorites