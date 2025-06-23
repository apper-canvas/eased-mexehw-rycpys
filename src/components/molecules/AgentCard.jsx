import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const AgentCard = ({ agent }) => {
  const [isContacting, setIsContacting] = useState(false)

  const handleContact = async (type, value) => {
    setIsContacting(true)
    
    try {
      // Simulate contact action
      await new Promise(resolve => setTimeout(resolve, 500))
      
      if (type === 'email') {
        window.location.href = `mailto:${value}`
        toast.success('Opening email client...')
      } else if (type === 'phone') {
        window.location.href = `tel:${value}`
        toast.success('Initiating phone call...')
      }
    } catch (error) {
      toast.error('Unable to initiate contact. Please try again.')
    } finally {
      setIsContacting(false)
    }
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <ApperIcon
        key={index}
        name="Star"
        className={`w-4 h-4 ${
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-surface-300'
        }`}
      />
    ))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-surface-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
    >
      {/* Agent Image */}
      <div className="aspect-square w-full overflow-hidden bg-surface-100">
        <img
          src={agent.image}
          alt={agent.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face&auto=format'
          }}
        />
      </div>

      {/* Agent Info */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-surface-900 mb-1">
            {agent.name}
          </h3>
          <p className="text-sm text-surface-600 mb-1">{agent.title}</p>
          <p className="text-sm font-medium text-primary">{agent.company}</p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center">
            {renderStars(agent.rating)}
          </div>
          <span className="text-sm text-surface-600">
            {agent.rating} ({agent.reviewCount} reviews)
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4 text-center">
          <div>
            <div className="text-sm font-semibold text-surface-900">
              {agent.yearsExperience}
            </div>
            <div className="text-xs text-surface-600">Years Exp.</div>
          </div>
          <div>
            <div className="text-sm font-semibold text-surface-900">
              {agent.propertiesSold}
            </div>
            <div className="text-xs text-surface-600">Properties</div>
          </div>
          <div>
            <div className="text-sm font-semibold text-surface-900">
              {agent.salesVolume}
            </div>
            <div className="text-xs text-surface-600">Volume</div>
          </div>
        </div>

        {/* Specialties */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {agent.specialties.slice(0, 2).map((specialty, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 text-xs bg-primary/10 text-primary rounded-full"
              >
                {specialty}
              </span>
            ))}
            {agent.specialties.length > 2 && (
              <span className="inline-block px-2 py-1 text-xs bg-surface-100 text-surface-600 rounded-full">
                +{agent.specialties.length - 2} more
              </span>
            )}
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm text-surface-600 mb-4 line-clamp-3">
          {agent.bio}
        </p>

        {/* Contact Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleContact('email', agent.email)}
            disabled={isContacting}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <ApperIcon name="Mail" className="w-4 h-4" />
            Email
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleContact('phone', agent.phone)}
            disabled={isContacting}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <ApperIcon name="Phone" className="w-4 h-4" />
            Call
          </Button>
        </div>

        {/* Languages & Certifications */}
        <div className="mt-4 pt-4 border-t border-surface-100">
          <div className="flex items-center justify-between text-xs text-surface-500">
            <div className="flex items-center gap-1">
              <ApperIcon name="Globe" className="w-3 h-3" />
              <span>{agent.languages.join(', ')}</span>
            </div>
            <div className="flex items-center gap-1">
              <ApperIcon name="Award" className="w-3 h-3" />
              <span>{agent.certifications.join(', ')}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default AgentCard