import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import PropertyImageGallery from '@/components/organisms/PropertyImageGallery'
import NeighborhoodStats from '@/components/organisms/NeighborhoodStats'
import SkeletonLoader from '@/components/atoms/SkeletonLoader'
import ErrorState from '@/components/atoms/ErrorState'
import propertyService from '@/services/api/propertyService'
import favoriteService from '@/services/api/favoriteService'
import agentService from '@/services/api/agentService'

const PropertyDetail = () => {
  const { id } = useParams()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)

  useEffect(() => {
    const loadProperty = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await propertyService.getById(id)
        setProperty(result)
        
        // Check if property is favorited
        try {
          const favorite = await favoriteService.getByPropertyId(result.Id)
          setIsFavorite(!!favorite)
        } catch (favError) {
          // Property not in favorites, which is fine
          setIsFavorite(false)
        }
      } catch (err) {
        setError(err.message || 'Failed to load property')
      } finally {
        setLoading(false)
      }
    }
    
    if (id) {
      loadProperty()
    }
  }, [id])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const handleFavoriteToggle = async () => {
    setFavoriteLoading(true)
    try {
      if (isFavorite) {
        await favoriteService.deleteByPropertyId(property.Id)
        setIsFavorite(false)
        toast.success('Removed from favorites')
      } else {
        await favoriteService.create({ propertyId: property.Id })
        setIsFavorite(true)
        toast.success('Added to favorites')
      }
    } catch (error) {
      toast.error('Failed to update favorites')
    } finally {
      setFavoriteLoading(false)
    }
  }

const handleContactAgent = async () => {
    if (!property || !property.agentId) {
      toast.error('Agent information not available for this property')
      return
    }

    try {
      setLoading(true)
      
      // Get agent contact methods
      const contactMethods = await agentService.getContactMethods(property.agentId)
      
      if (contactMethods.length === 0) {
        toast.error('No contact methods available for this agent')
        return
      }

      // Prefer email, fallback to phone
      const preferredMethod = contactMethods.includes('email') ? 'email' : 'phone'
      
      const result = await agentService.contactAgent(
        property.agentId, 
        preferredMethod, 
        `I'm interested in the property at ${property.address}, ${property.city}. Please contact me to discuss this listing.`,
        {
          name: 'Property Inquirer',
          email: '',
          phone: ''
        }
      )

      if (result.success) {
        if (preferredMethod === 'email') {
          // Open email client with pre-filled content
          const subject = encodeURIComponent(`Inquiry about ${property.title}`)
          const body = encodeURIComponent(`Hello ${result.agentInfo.name},\n\nI'm interested in the property listed at ${property.address}, ${property.city}. Could you please provide more information and schedule a viewing?\n\nProperty ID: #${property.Id}\nListing: ${property.title}\n\nThank you for your time.\n\nBest regards`)
          window.location.href = `mailto:${result.agentInfo.email}?subject=${subject}&body=${body}`
        } else if (preferredMethod === 'phone') {
          window.location.href = `tel:${result.agentInfo.phone}`
        }
        
        toast.success(`Contacting ${result.agentInfo.name} from ${result.agentInfo.company}`)
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      console.error('Contact agent error:', error)
      toast.error(error.message || 'Failed to contact agent. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleScheduleViewing = () => {
    toast.success('Viewing scheduler would open here')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Back Button Skeleton */}
          <div className="mb-6">
            <SkeletonLoader width="w-32" height="h-10" />
          </div>
          
          {/* Image Gallery Skeleton */}
          <div className="mb-8">
            <SkeletonLoader height="h-96" />
          </div>
          
          {/* Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <SkeletonLoader count={3} height="h-6" />
              <SkeletonLoader count={5} height="h-4" />
            </div>
            <div className="space-y-4">
              <SkeletonLoader height="h-32" />
              <SkeletonLoader height="h-12" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <ErrorState
          title="Property not found"
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    )
  }

  if (!property) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link
            to="/properties"
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
            Back to Properties
          </Link>
        </motion.div>

        {/* Image Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
className="mb-8"
        >
          <PropertyImageGallery images={property.images} title={property.title} />
        </motion.div>

        {/* Neighborhood Stats */}
        <NeighborhoodStats propertyId={property.Id} />

        {/* Property Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-display font-bold text-surface-900 mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center text-surface-600 mb-4">
                    <ApperIcon name="MapPin" className="w-5 h-5 mr-2" />
                    <span>{property.address}, {property.city}, {property.state} {property.zipCode}</span>
                  </div>
                  <div className="text-3xl font-bold text-primary mb-4">
                    {formatPrice(property.price)}
                  </div>
                </div>
                
                <Button
                  onClick={handleFavoriteToggle}
                  loading={favoriteLoading}
                  variant={isFavorite ? 'primary' : 'outline'}
                  className="mt-4 sm:mt-0"
                >
                  <ApperIcon 
                    name="Heart" 
                    className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} 
                  />
                  {isFavorite ? 'Favorited' : 'Add to Favorites'}
                </Button>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-4 bg-surface-50 rounded-lg">
                <div className="text-center">
                  <ApperIcon name="Bed" className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <div className="font-semibold text-surface-900">{property.bedrooms}</div>
                  <div className="text-sm text-surface-600">Bedroom{property.bedrooms !== 1 ? 's' : ''}</div>
                </div>
                <div className="text-center">
                  <ApperIcon name="Bath" className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <div className="font-semibold text-surface-900">{property.bathrooms}</div>
                  <div className="text-sm text-surface-600">Bathroom{property.bathrooms !== 1 ? 's' : ''}</div>
                </div>
                <div className="text-center">
                  <ApperIcon name="Square" className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <div className="font-semibold text-surface-900">{property.squareFeet?.toLocaleString()}</div>
                  <div className="text-sm text-surface-600">Square Feet</div>
                </div>
                <div className="text-center">
                  <ApperIcon name="Calendar" className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <div className="font-semibold text-surface-900">{new Date(property.listingDate).getFullYear()}</div>
                  <div className="text-sm text-surface-600">Listed</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-surface-900 mb-4">Description</h2>
                <p className="text-surface-700 leading-relaxed">
                  {property.description}
                </p>
              </div>

              {/* Features */}
              {property.features && property.features.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-surface-900 mb-4">Features & Amenities</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <ApperIcon name="Check" className="w-4 h-4 text-success mr-3" />
                        <span className="text-surface-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Property Type */}
              <div>
                <Badge variant="primary" size="lg">
                  {property.propertyType}
                </Badge>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-surface-900 mb-4">
                Interested in this property?
              </h3>
              
              <div className="space-y-4">
                <Button
                  onClick={handleScheduleViewing}
                  size="lg"
                  className="w-full"
                >
                  <ApperIcon name="Calendar" className="w-4 h-4 mr-2" />
                  Schedule Viewing
                </Button>
                
                <Button
                  onClick={handleContactAgent}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  <ApperIcon name="Phone" className="w-4 h-4 mr-2" />
                  Contact Agent
                </Button>
              </div>

              {/* Property Info */}
              <div className="mt-8 pt-6 border-t border-surface-200">
                <h4 className="font-medium text-surface-900 mb-3">Property Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-surface-600">Property ID:</span>
                    <span className="text-surface-900">#{property.Id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-600">Status:</span>
                    <Badge variant="success" size="sm">
                      {property.status || 'Active'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-600">Listed:</span>
                    <span className="text-surface-900">
                      {new Date(property.listingDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetail