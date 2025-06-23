const agentService = {
  async getAll() {
    try {
      const tableName = 'agent'
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "company" } },
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "image" } },
          { field: { Name: "bio" } },
          { field: { Name: "specialties" } },
          { field: { Name: "rating" } },
          { field: { Name: "review_count" } },
          { field: { Name: "years_experience" } },
          { field: { Name: "sales_volume" } },
          { field: { Name: "properties_sold" } },
          { field: { Name: "languages" } },
          { field: { Name: "certifications" } },
          { field: { Name: "social_media" } }
        ],
        orderBy: [
          { fieldName: "rating", sorttype: "DESC" }
        ]
      }
      
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const response = await apperClient.fetchRecords(tableName, params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      // Map database fields to component expected format
      return (response.data || []).map(agent => ({
        ...agent,
        name: agent.Name,
        reviewCount: agent.review_count,
        yearsExperience: agent.years_experience,
        salesVolume: agent.sales_volume,
        propertiesSold: agent.properties_sold,
        socialMedia: agent.social_media
      }))
    } catch (error) {
      console.error("Error fetching agents:", error)
      throw error
    }
  },

  async getById(id) {
    try {
      const tableName = 'agent'
      const recordId = parseInt(id, 10)
      
      if (isNaN(recordId)) {
        throw new Error('Invalid agent ID')
      }
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "company" } },
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "image" } },
          { field: { Name: "bio" } },
          { field: { Name: "specialties" } },
          { field: { Name: "rating" } },
          { field: { Name: "review_count" } },
          { field: { Name: "years_experience" } },
          { field: { Name: "sales_volume" } },
          { field: { Name: "properties_sold" } },
          { field: { Name: "languages" } },
          { field: { Name: "certifications" } },
          { field: { Name: "social_media" } }
        ]
      }
      
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const response = await apperClient.getRecordById(tableName, recordId, params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      const agent = response.data
      return {
        ...agent,
        name: agent.Name,
        reviewCount: agent.review_count,
        yearsExperience: agent.years_experience,
        salesVolume: agent.sales_volume,
        propertiesSold: agent.properties_sold,
        socialMedia: agent.social_media
      }
    } catch (error) {
      console.error(`Error fetching agent with ID ${id}:`, error)
      throw error
    }
  },

  async create(agentData) {
    try {
      const tableName = 'agent'
      
      // Only include updateable fields
      const agentFields = {
        Name: agentData.Name || agentData.name,
        title: agentData.title,
        company: agentData.company,
        email: agentData.email,
        phone: agentData.phone,
        image: agentData.image,
        bio: agentData.bio,
        specialties: agentData.specialties,
        rating: agentData.rating || 0,
        review_count: agentData.review_count || agentData.reviewCount || 0,
        years_experience: agentData.years_experience || agentData.yearsExperience || 0,
        sales_volume: agentData.sales_volume || agentData.salesVolume || "$0",
        properties_sold: agentData.properties_sold || agentData.propertiesSold || 0,
        languages: agentData.languages || ["English"],
        certifications: agentData.certifications || [],
        social_media: agentData.social_media || agentData.socialMedia || {}
      }
      
      const params = {
        records: [agentFields]
      }
      
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const response = await apperClient.createRecord(tableName, params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0].message || 'Failed to create agent')
        }
        
        const newAgent = response.results[0].data
        return {
          ...newAgent,
          name: newAgent.Name,
          reviewCount: newAgent.review_count,
          yearsExperience: newAgent.years_experience,
          salesVolume: newAgent.sales_volume,
          propertiesSold: newAgent.properties_sold,
          socialMedia: newAgent.social_media
        }
      }
      
      throw new Error('No results returned from create operation')
    } catch (error) {
      console.error("Error creating agent:", error)
      throw error
    }
  },

  async update(id, agentData) {
    try {
      const tableName = 'agent'
      const recordId = parseInt(id, 10)
      
      if (isNaN(recordId)) {
        throw new Error('Invalid agent ID')
      }
      
      // Only include updateable fields, exclude system fields
      const { Id, CreatedOn, CreatedBy, ModifiedOn, ModifiedBy, ...updateableFields } = agentData
      
      // Map field names for database
      const agentFields = {
        Id: recordId,
        ...updateableFields
      }
      
      if (agentFields.name) {
        agentFields.Name = agentFields.name
        delete agentFields.name
      }
      if (agentFields.reviewCount) {
        agentFields.review_count = agentFields.reviewCount
        delete agentFields.reviewCount
      }
      if (agentFields.yearsExperience) {
        agentFields.years_experience = agentFields.yearsExperience
        delete agentFields.yearsExperience
      }
      if (agentFields.salesVolume) {
        agentFields.sales_volume = agentFields.salesVolume
        delete agentFields.salesVolume
      }
      if (agentFields.propertiesSold) {
        agentFields.properties_sold = agentFields.propertiesSold
        delete agentFields.propertiesSold
      }
      if (agentFields.socialMedia) {
        agentFields.social_media = agentFields.socialMedia
        delete agentFields.socialMedia
      }
      
      const params = {
        records: [agentFields]
      }
      
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const response = await apperClient.updateRecord(tableName, params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0].message || 'Failed to update agent')
        }
        
        const updatedAgent = response.results[0].data
        return {
          ...updatedAgent,
          name: updatedAgent.Name,
          reviewCount: updatedAgent.review_count,
          yearsExperience: updatedAgent.years_experience,
          salesVolume: updatedAgent.sales_volume,
          propertiesSold: updatedAgent.properties_sold,
          socialMedia: updatedAgent.social_media
        }
      }
      
      throw new Error('No results returned from update operation')
    } catch (error) {
      console.error(`Error updating agent with ID ${id}:`, error)
      throw error
    }
  },

  async delete(id) {
    try {
      const tableName = 'agent'
      const recordId = parseInt(id, 10)
      
      if (isNaN(recordId)) {
        throw new Error('Invalid agent ID')
      }
      
      const params = {
        RecordIds: [recordId]
      }
      
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const response = await apperClient.deleteRecord(tableName, params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0].message || 'Failed to delete agent')
        }
      }
      
      return true
    } catch (error) {
      console.error(`Error deleting agent with ID ${id}:`, error)
      throw error
    }
  },

  async search(query) {
    try {
      const tableName = 'agent'
      
      if (!query || query.trim() === '') {
        return await this.getAll()
      }
      
      const searchTerm = query.toLowerCase().trim()
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "company" } },
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "image" } },
          { field: { Name: "bio" } },
          { field: { Name: "specialties" } },
          { field: { Name: "rating" } },
          { field: { Name: "review_count" } },
          { field: { Name: "years_experience" } },
          { field: { Name: "sales_volume" } },
          { field: { Name: "properties_sold" } },
          { field: { Name: "languages" } },
          { field: { Name: "certifications" } },
          { field: { Name: "social_media" } }
        ],
        whereGroups: [{
          operator: "OR",
          subGroups: [
            {
              conditions: [
                { fieldName: "Name", operator: "Contains", values: [searchTerm] }
              ]
            },
            {
              conditions: [
                { fieldName: "company", operator: "Contains", values: [searchTerm] }
              ]
            },
            {
              conditions: [
                { fieldName: "specialties", operator: "Contains", values: [searchTerm] }
              ]
            }
          ]
        }],
        orderBy: [
          { fieldName: "rating", sorttype: "DESC" }
        ]
      }
      
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const response = await apperClient.fetchRecords(tableName, params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      // Map database fields to component expected format
      return (response.data || []).map(agent => ({
        ...agent,
        name: agent.Name,
        reviewCount: agent.review_count,
        yearsExperience: agent.years_experience,
        salesVolume: agent.sales_volume,
        propertiesSold: agent.properties_sold,
        socialMedia: agent.social_media
      }))
    } catch (error) {
      console.error("Error searching agents:", error)
      throw error
    }
  },

  async filterBySpecialty(specialty) {
    try {
      const tableName = 'agent'
      
      if (!specialty) {
        return await this.getAll()
      }
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "company" } },
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "image" } },
          { field: { Name: "bio" } },
          { field: { Name: "specialties" } },
          { field: { Name: "rating" } },
          { field: { Name: "review_count" } },
          { field: { Name: "years_experience" } },
          { field: { Name: "sales_volume" } },
          { field: { Name: "properties_sold" } },
          { field: { Name: "languages" } },
          { field: { Name: "certifications" } },
          { field: { Name: "social_media" } }
        ],
        where: [
          { FieldName: "specialties", Operator: "Contains", Values: [specialty] }
        ],
        orderBy: [
          { fieldName: "rating", sorttype: "DESC" }
        ]
      }
      
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const response = await apperClient.fetchRecords(tableName, params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      // Map database fields to component expected format
      return (response.data || []).map(agent => ({
        ...agent,
        name: agent.Name,
        reviewCount: agent.review_count,
        yearsExperience: agent.years_experience,
        salesVolume: agent.sales_volume,
        propertiesSold: agent.properties_sold,
        socialMedia: agent.social_media
      }))
    } catch (error) {
      console.error("Error filtering agents by specialty:", error)
      throw error
    }
  },

  async filterByRating(minRating = 0) {
    try {
      const tableName = 'agent'
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "company" } },
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "image" } },
          { field: { Name: "bio" } },
          { field: { Name: "specialties" } },
          { field: { Name: "rating" } },
          { field: { Name: "review_count" } },
          { field: { Name: "years_experience" } },
          { field: { Name: "sales_volume" } },
          { field: { Name: "properties_sold" } },
          { field: { Name: "languages" } },
          { field: { Name: "certifications" } },
          { field: { Name: "social_media" } }
        ],
        where: [
          { FieldName: "rating", Operator: "GreaterThanOrEqualTo", Values: [minRating.toString()] }
        ],
        orderBy: [
          { fieldName: "rating", sorttype: "DESC" }
        ]
      }
      
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const response = await apperClient.fetchRecords(tableName, params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      // Map database fields to component expected format
      return (response.data || []).map(agent => ({
        ...agent,
        name: agent.Name,
        reviewCount: agent.review_count,
        yearsExperience: agent.years_experience,
        salesVolume: agent.sales_volume,
        propertiesSold: agent.properties_sold,
        socialMedia: agent.social_media
      }))
    } catch (error) {
      console.error("Error filtering agents by rating:", error)
      throw error
    }
  },

  async getSpecialties() {
    try {
      // Get all agents and extract unique specialties
      const agents = await this.getAll()
      const allSpecialties = agents.flatMap(agent => 
        Array.isArray(agent.specialties) ? agent.specialties : 
        typeof agent.specialties === 'string' ? agent.specialties.split(',') : []
      )
      return [...new Set(allSpecialties)].sort()
    } catch (error) {
      console.error("Error getting specialties:", error)
      throw error
    }
  },

  async contactAgent(agentId, contactMethod, message = '', userInfo = {}) {
    try {
      const agent = await this.getById(agentId)
      
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
      
      if (contactMethod === 'email') {
        // Simulate email sending process
        const emailSuccess = Math.random() > 0.1 // 90% success rate simulation
        
        if (!emailSuccess) {
          throw new Error('Email service temporarily unavailable')
        }
        
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
      console.error(`Failed contact attempt: ${error.message}`)
      
      return {
        success: false,
        message: error.message || 'Failed to contact agent',
        contactMethod,
        agentInfo: {
          name: agent?.name || 'Unknown',
          company: agent?.company || 'Unknown'
        }
      }
    }
  },

  async getContactMethods(agentId) {
    try {
      const agent = await this.getById(agentId)
      
      const methods = []
      if (agent.email) methods.push('email')
      if (agent.phone) methods.push('phone')
      
      return methods
    } catch (error) {
      console.error(`Error getting contact methods for agent ${agentId}:`, error)
      throw error
    }
  }
}

export default agentService