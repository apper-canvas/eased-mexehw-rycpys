import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import AgentCard from '@/components/molecules/AgentCard'
import SearchBar from '@/components/molecules/SearchBar'
import ErrorState from '@/components/atoms/ErrorState'
import SkeletonLoader from '@/components/atoms/SkeletonLoader'
import EmptyState from '@/components/atoms/EmptyState'
import ApperIcon from '@/components/ApperIcon'
import agentService from '@/services/api/agentService'

const Agents = () => {
  const [agents, setAgents] = useState([])
  const [filteredAgents, setFilteredAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('')
  const [specialties, setSpecialties] = useState([])
  const [minRating, setMinRating] = useState(0)

  useEffect(() => {
    loadAgents()
    loadSpecialties()
  }, [])

  useEffect(() => {
    filterAgents()
  }, [agents, searchTerm, selectedSpecialty, minRating])

  const loadAgents = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await agentService.getAll()
      setAgents(data)
    } catch (err) {
      setError(err.message || 'Failed to load agents')
    } finally {
      setLoading(false)
    }
  }

  const loadSpecialties = async () => {
    try {
      const data = await agentService.getSpecialties()
      setSpecialties(data)
    } catch (err) {
      console.error('Failed to load specialties:', err)
    }
  }

  const filterAgents = () => {
    let filtered = [...agents]

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim()
      filtered = filtered.filter(agent =>
        agent.name.toLowerCase().includes(term) ||
        agent.company.toLowerCase().includes(term) ||
        agent.specialties.some(specialty => 
          specialty.toLowerCase().includes(term)
        )
      )
    }

    // Apply specialty filter
    if (selectedSpecialty) {
      filtered = filtered.filter(agent =>
        agent.specialties.some(s => 
          s.toLowerCase().includes(selectedSpecialty.toLowerCase())
        )
      )
    }

    // Apply rating filter
    if (minRating > 0) {
      filtered = filtered.filter(agent => agent.rating >= minRating)
    }

    setFilteredAgents(filtered)
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const handleSpecialtyChange = (specialty) => {
    setSelectedSpecialty(specialty)
  }

  const handleRatingChange = (rating) => {
    setMinRating(rating)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedSpecialty('')
    setMinRating(0)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 space-y-4">
            <SkeletonLoader className="h-8 w-48" />
            <SkeletonLoader className="h-12 w-full max-w-md" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="space-y-4">
                <SkeletonLoader className="aspect-square w-full rounded-xl" />
                <div className="space-y-2">
                  <SkeletonLoader className="h-6 w-3/4" />
                  <SkeletonLoader className="h-4 w-1/2" />
                  <SkeletonLoader className="h-4 w-2/3" />
                </div>
              </div>
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
          title="Failed to Load Agents"
          message={error}
          onRetry={loadAgents}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-surface-900 mb-2">
            Find Your Perfect Agent
          </h1>
          <p className="text-surface-600">
            Connect with experienced real estate professionals in your area
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="max-w-md">
            <SearchBar
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search agents, companies, or specialties..."
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-4 items-center">
            {/* Specialty Filter */}
            <div className="relative">
              <select
                value={selectedSpecialty}
                onChange={(e) => handleSpecialtyChange(e.target.value)}
                className="appearance-none bg-white border border-surface-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="">All Specialties</option>
                {specialties.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
              <ApperIcon 
                name="ChevronDown" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" 
              />
            </div>

            {/* Rating Filter */}
            <div className="relative">
              <select
                value={minRating}
                onChange={(e) => handleRatingChange(parseFloat(e.target.value))}
                className="appearance-none bg-white border border-surface-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value={0}>All Ratings</option>
                <option value={4.5}>4.5+ Stars</option>
                <option value={4.0}>4.0+ Stars</option>
                <option value={3.5}>3.5+ Stars</option>
              </select>
              <ApperIcon 
                name="ChevronDown" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" 
              />
            </div>

            {/* Clear Filters */}
            {(searchTerm || selectedSpecialty || minRating > 0) && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-3 py-2 text-sm text-surface-600 hover:text-primary transition-colors"
              >
                <ApperIcon name="X" className="w-4 h-4" />
                Clear Filters
              </button>
            )}
          </div>

          {/* Results Count */}
          <div className="text-sm text-surface-600">
            Showing {filteredAgents.length} of {agents.length} agents
          </div>
        </div>

        {/* Agents Grid */}
        {filteredAgents.length === 0 ? (
          <EmptyState
            icon="Users"
            title="No Agents Found"
            message={
              searchTerm || selectedSpecialty || minRating > 0
                ? "Try adjusting your search criteria or clearing filters"
                : "No agents are currently available"
            }
            action={
              (searchTerm || selectedSpecialty || minRating > 0) && (
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Clear Filters
                </button>
              )
            }
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredAgents.map((agent) => (
              <AgentCard key={agent.Id} agent={agent} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Agents