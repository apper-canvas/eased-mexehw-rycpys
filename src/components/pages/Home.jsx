import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import SearchBar from '@/components/molecules/SearchBar'
import PropertyCard from '@/components/molecules/PropertyCard'
import SkeletonLoader from '@/components/atoms/SkeletonLoader'
import ErrorState from '@/components/atoms/ErrorState'
import propertyService from '@/services/api/propertyService'

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

useEffect(() => {
    const loadFeaturedProperties = async () => {
      setLoading(true)
      setError(null)
      try {
        const properties = await propertyService.getFeatured()
        setFeaturedProperties(properties || [])
      } catch (err) {
        console.error('Error loading featured properties:', err)
        setError(err.message || 'Failed to load featured properties')
        setFeaturedProperties([])
      } finally {
        setLoading(false)
      }
    }
    loadFeaturedProperties()
  }, [])

  const handleSearch = (searchTerm) => {
    // Navigate to properties page with search term
    window.location.href = `/properties?search=${encodeURIComponent(searchTerm)}`
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              Find Your Perfect Home
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Discover beautiful properties in your ideal location. From modern condos to charming family homes, we have the perfect place for you.
            </p>
            
            {/* Hero Search */}
            <div className="max-w-2xl mx-auto">
              <SearchBar 
                onSearch={handleSearch}
                placeholder="Search by city, neighborhood, or address..."
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { icon: 'Home', value: '500+', label: 'Properties Listed' },
              { icon: 'Users', value: '1,200+', label: 'Happy Customers' },
              { icon: 'MapPin', value: '50+', label: 'Cities Covered' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <ApperIcon name={stat.icon} className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-3xl font-bold text-surface-900 mb-2">
                  {stat.value}
                </h3>
                <p className="text-surface-600">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-surface-900 mb-4">
              Featured Properties
            </h2>
            <p className="text-lg text-surface-600 max-w-2xl mx-auto">
              Handpicked properties that offer exceptional value and unique features
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <SkeletonLoader key={index} variant="card" height={320} />
              ))}
            </div>
          ) : error ? (
            <ErrorState
              title="Failed to load featured properties"
              message={error}
              onRetry={() => window.location.reload()}
            />
          ) : (
            <>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
              >
                {featuredProperties.map((property, index) => (
                  <motion.div key={property.Id} variants={itemVariants}>
                    <PropertyCard property={property} />
                  </motion.div>
                ))}
              </motion.div>

              <div className="text-center">
                <Link to="/properties">
                  <Button size="lg">
                    View All Properties
                    <ApperIcon name="ArrowRight" className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-surface-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-surface-900 mb-4">
              Ready to Find Your Dream Home?
            </h2>
            <p className="text-lg text-surface-600 mb-8 max-w-2xl mx-auto">
              Start your search today and discover properties that match your lifestyle and budget
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/properties">
                <Button size="lg">
                  Browse Properties
                </Button>
              </Link>
              <Link to="/map">
                <Button variant="outline" size="lg">
                  <ApperIcon name="Map" className="w-5 h-5 mr-2" />
                  Explore Map
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home