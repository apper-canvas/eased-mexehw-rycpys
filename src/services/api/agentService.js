import mockData from '@/services/mockData/agents.json'

// Mock service for agent data
class AgentService {
  constructor() {
    this.agents = [...mockData]
    this.lastId = Math.max(...this.agents.map(agent => agent.Id))
  }

  // Get all agents
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...this.agents]
  }

  // Get agent by ID
  async getById(id) {
    const agentId = parseInt(id)
    if (isNaN(agentId)) {
      throw new Error('Invalid agent ID')
    }
    
    await new Promise(resolve => setTimeout(resolve, 200))
    const agent = this.agents.find(agent => agent.Id === agentId)
    
    if (!agent) {
      throw new Error('Agent not found')
    }
    
    return { ...agent }
  }

  // Create new agent
  async create(agentData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const newAgent = {
      ...agentData,
      Id: ++this.lastId,
      rating: agentData.rating || 0,
      reviewCount: agentData.reviewCount || 0,
      yearsExperience: agentData.yearsExperience || 0,
      salesVolume: agentData.salesVolume || "$0",
      propertiesSold: agentData.propertiesSold || 0,
      specialties: agentData.specialties || [],
      languages: agentData.languages || ["English"],
      certifications: agentData.certifications || [],
      socialMedia: agentData.socialMedia || {}
    }
    
    this.agents.push(newAgent)
    return { ...newAgent }
  }

  // Update agent
  async update(id, agentData) {
    const agentId = parseInt(id)
    if (isNaN(agentId)) {
      throw new Error('Invalid agent ID')
    }
    
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const index = this.agents.findIndex(agent => agent.Id === agentId)
    if (index === -1) {
      throw new Error('Agent not found')
    }
    
    // Prevent updating the Id field
    const { Id, ...updateData } = agentData
    
    this.agents[index] = {
      ...this.agents[index],
      ...updateData
    }
    
    return { ...this.agents[index] }
  }

  // Delete agent
  async delete(id) {
    const agentId = parseInt(id)
    if (isNaN(agentId)) {
      throw new Error('Invalid agent ID')
    }
    
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = this.agents.findIndex(agent => agent.Id === agentId)
    if (index === -1) {
      throw new Error('Agent not found')
    }
    
    const deletedAgent = this.agents.splice(index, 1)[0]
    return { ...deletedAgent }
  }

  // Search agents
  async search(query) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    if (!query || query.trim() === '') {
      return [...this.agents]
    }
    
    const searchTerm = query.toLowerCase().trim()
    return this.agents.filter(agent =>
      agent.name.toLowerCase().includes(searchTerm) ||
      agent.company.toLowerCase().includes(searchTerm) ||
      agent.specialties.some(specialty => 
        specialty.toLowerCase().includes(searchTerm)
      )
    )
  }

  // Filter agents by specialty
  async filterBySpecialty(specialty) {
    await new Promise(resolve => setTimeout(resolve, 250))
    
    if (!specialty) {
      return [...this.agents]
    }
    
    return this.agents.filter(agent =>
      agent.specialties.some(s => 
        s.toLowerCase().includes(specialty.toLowerCase())
      )
    )
  }

  // Get agents by rating range
  async filterByRating(minRating = 0) {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    return this.agents.filter(agent => agent.rating >= minRating)
  }

  // Get all specialties
  async getSpecialties() {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const allSpecialties = this.agents.flatMap(agent => agent.specialties)
    return [...new Set(allSpecialties)].sort()
  }
}

// Export singleton instance
const agentService = new AgentService()
export default agentService