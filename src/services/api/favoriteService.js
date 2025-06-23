const favoriteService = {
  async getAll() {
    try {
      const tableName = 'favorite'
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "property_id" } },
          { field: { Name: "saved_date" } }
        ],
        orderBy: [
          { fieldName: "saved_date", sorttype: "DESC" }
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
      return (response.data || []).map(favorite => ({
        ...favorite,
        propertyId: favorite.property_id,
        savedDate: favorite.saved_date
      }))
    } catch (error) {
      console.error("Error fetching favorites:", error)
      throw error
    }
  },

  async getById(id) {
    try {
      const tableName = 'favorite'
      const recordId = parseInt(id, 10)
      
      if (isNaN(recordId)) {
        throw new Error('Invalid favorite ID')
      }
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "property_id" } },
          { field: { Name: "saved_date" } }
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
      
      const favorite = response.data
      return {
        ...favorite,
        propertyId: favorite.property_id,
        savedDate: favorite.saved_date
      }
    } catch (error) {
      console.error(`Error fetching favorite with ID ${id}:`, error)
      throw error
    }
  },

  async getByPropertyId(propertyId) {
    try {
      const tableName = 'favorite'
      const propId = parseInt(propertyId, 10)
      
      if (isNaN(propId)) {
        throw new Error('Invalid property ID')
      }
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "property_id" } },
          { field: { Name: "saved_date" } }
        ],
        where: [
          { FieldName: "property_id", Operator: "EqualTo", Values: [propId.toString()] }
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
      
      const favorites = response.data || []
      if (favorites.length > 0) {
        const favorite = favorites[0]
        return {
          ...favorite,
          propertyId: favorite.property_id,
          savedDate: favorite.saved_date
        }
      }
      
      return null
    } catch (error) {
      console.error(`Error fetching favorite for property ${propertyId}:`, error)
      throw error
    }
  },

  async create(favorite) {
    try {
      const tableName = 'favorite'
      
      // Check if already exists
      const existing = await this.getByPropertyId(favorite.propertyId || favorite.property_id)
      if (existing) {
        return existing
      }
      
      // Only include updateable fields
      const favoriteData = {
        Name: favorite.Name || `Property ${favorite.propertyId || favorite.property_id} Favorite`,
        property_id: parseInt(favorite.propertyId || favorite.property_id, 10),
        saved_date: new Date().toISOString().split('T')[0]
      }
      
      const params = {
        records: [favoriteData]
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
          throw new Error(failedRecords[0].message || 'Failed to create favorite')
        }
        
        const newFavorite = response.results[0].data
        return {
          ...newFavorite,
          propertyId: newFavorite.property_id,
          savedDate: newFavorite.saved_date
        }
      }
      
      throw new Error('No results returned from create operation')
    } catch (error) {
      console.error("Error creating favorite:", error)
      throw error
    }
  },

  async delete(id) {
    try {
      const tableName = 'favorite'
      const recordId = parseInt(id, 10)
      
      if (isNaN(recordId)) {
        throw new Error('Invalid favorite ID')
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
          throw new Error(failedRecords[0].message || 'Failed to delete favorite')
        }
      }
      
      return true
    } catch (error) {
      console.error(`Error deleting favorite with ID ${id}:`, error)
      throw error
    }
  },

  async deleteByPropertyId(propertyId) {
    try {
      // First find the favorite by property ID
      const favorite = await this.getByPropertyId(propertyId)
      if (!favorite) {
        throw new Error('Favorite not found')
      }
      
      // Delete using the favorite ID
      return await this.delete(favorite.Id)
    } catch (error) {
      console.error(`Error deleting favorite for property ${propertyId}:`, error)
      throw error
    }
  }
}

export default favoriteService