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

  // Contact agent via email or phone
  async contactAgent(agentId, contactMethod, message = '', userInfo = {}) {
    const agentIdNum = parseInt(agentId)
    if (isNaN(agentIdNum)) {
      throw new Error('Invalid agent ID')
    }

    await new Promise(resolve => setTimeout(resolve, 400))

    const agent = this.agents.find(agent => agent.Id === agentIdNum)
    if (!agent) {
      throw new Error('Agent not found')
    }

    // Validate contact method
    if (!['email', 'phone'].includes(contactMethod)) {
      throw new Error('Invalid contact method. Use "email" or "phone".')
    }

    // Validate required contact information
    if (contactMethod === 'email' && !agent.email) {
      throw new Error('Agent email not available')
    }
    if (contactMethod === 'phone' && !agent.phone) {
      throw new Error('Agent phone not available')
    }

    try {
      if (contactMethod === 'email') {
        // Prepare email template data
        const emailData = {
          agent_name: agent.name,
          agent_email: agent.email,
          user_name: userInfo.name || 'Potential Client',
          user_email: userInfo.email || '',
          user_phone: userInfo.phone || '',
          message: message || `I'm interested in learning more about your real estate services.`,
          agent_company: agent.company,
          contact_date: new Date().toLocaleDateString()
        }

        // In a real implementation, you would use EmailJS or similar service here
        // For now, we'll simulate the email sending process
        const emailSuccess = Math.random() > 0.1 // 90% success rate simulation

        if (!emailSuccess) {
          throw new Error('Email service temporarily unavailable')
        }

        // Log contact attempt (in real app, this would go to analytics/database)
        console.log(`Contact attempt logged: User contacted ${agent.name} via email`)

        return {
          success: true,
          message: `Email sent successfully to ${agent.name}`,
          contactMethod: 'email',
          agentInfo: {
            name: agent.name,
            company: agent.company,
            email: agent.email
          }
        }
      } else if (contactMethod === 'phone') {
        // Validate phone number format
        const phoneRegex = /^[\+]?[1-9]?[\d\s\-\(\)\.]{10,}$/
        if (!phoneRegex.test(agent.phone)) {
          throw new Error('Invalid agent phone number format')
        }

        // Log contact attempt
        console.log(`Contact attempt logged: User initiated call to ${agent.name} at ${agent.phone}`)

        return {
          success: true,
          message: `Initiating call to ${agent.name}`,
          contactMethod: 'phone',
          agentInfo: {
            name: agent.name,
            company: agent.company,
            phone: agent.phone
          }
        }
      }
    } catch (error) {
      // Log failed contact attempt
      console.error(`Failed contact attempt: ${error.message}`)
      
      return {
        success: false,
        message: error.message || 'Failed to contact agent',
        contactMethod,
        agentInfo: {
          name: agent.name,
          company: agent.company
        }
      }
    }
  }

  // Get contact methods available for an agent
  async getContactMethods(agentId) {
    const agentIdNum = parseInt(agentId)
    if (isNaN(agentIdNum)) {
      throw new Error('Invalid agent ID')
    }

    await new Promise(resolve => setTimeout(resolve, 100))

    const agent = this.agents.find(agent => agent.Id === agentIdNum)
    if (!agent) {
      throw new Error('Agent not found')
    }

    const methods = []
    if (agent.email) methods.push('email')
    if (agent.phone) methods.push('phone')

    return methods
  }
}

// Export singleton instance
const agentService = new AgentService()
export default agentService