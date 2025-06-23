const compareService = {
  async getCompareList() {
    try {
      const tableName = 'compare_item'
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "property_id" } },
          { field: { Name: "date_added" } }
        ],
        orderBy: [
          { fieldName: "date_added", sorttype: "DESC" }
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
      return (response.data || []).map(item => ({
        ...item,
        propertyId: item.property_id,
        dateAdded: item.date_added
      }))
    } catch (error) {
      console.error("Error fetching compare list:", error)
      throw error
    }
  },

  async addToCompare(propertyId) {
    try {
      const tableName = 'compare_item'
      const propertyIdInt = parseInt(propertyId, 10)
      
      if (isNaN(propertyIdInt)) {
        throw new Error('Invalid property ID')
      }
      
      // Check if already in compare list
      const existing = await this.isInCompare(propertyIdInt)
      if (existing) {
        throw new Error('Property already in comparison list')
      }
      
      // Check current count limit
      const currentList = await this.getCompareList()
      if (currentList.length >= 4) {
        throw new Error('Maximum 4 properties can be compared at once')
      }
      
      // Only include updateable fields
      const compareData = {
        Name: `Property ${propertyIdInt} Comparison`,
        property_id: propertyIdInt,
        date_added: new Date().toISOString()
      }
      
      const params = {
        records: [compareData]
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
          throw new Error(failedRecords[0].message || 'Failed to add property to comparison')
        }
        
        const newItem = response.results[0].data
        return {
          ...newItem,
          propertyId: newItem.property_id,
          dateAdded: newItem.date_added
        }
      }
      
      throw new Error('No results returned from create operation')
    } catch (error) {
      console.error("Error adding property to compare:", error)
      throw error
    }
  },

  async removeFromCompare(propertyId) {
    try {
      const tableName = 'compare_item'
      const propertyIdInt = parseInt(propertyId, 10)
      
      if (isNaN(propertyIdInt)) {
        throw new Error('Invalid property ID')
      }
      
      // Find the compare item by property ID
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "property_id" } },
          { field: { Name: "date_added" } }
        ],
        where: [
          { FieldName: "property_id", Operator: "EqualTo", Values: [propertyIdInt.toString()] }
        ]
      }
      
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const fetchResponse = await apperClient.fetchRecords(tableName, params)
      
      if (!fetchResponse.success) {
        throw new Error(fetchResponse.message)
      }
      
      const items = fetchResponse.data || []
      if (items.length === 0) {
        throw new Error('Property not found in comparison list')
      }
      
      // Delete the compare item
      const deleteParams = {
        RecordIds: [items[0].Id]
      }
      
      const deleteResponse = await apperClient.deleteRecord(tableName, deleteParams)
      
      if (!deleteResponse.success) {
        throw new Error(deleteResponse.message)
      }
      
      if (deleteResponse.results) {
        const failedRecords = deleteResponse.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0].message || 'Failed to remove property from comparison')
        }
      }
      
      return true
    } catch (error) {
      console.error("Error removing property from compare:", error)
      throw error
    }
  },

  async clearCompare() {
    try {
      const tableName = 'compare_item'
      
      // Get all compare items
      const currentList = await this.getCompareList()
      
      if (currentList.length === 0) {
        return true
      }
      
      // Delete all items
      const recordIds = currentList.map(item => item.Id)
      
      const params = {
        RecordIds: recordIds
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
          throw new Error('Failed to clear comparison list')
        }
      }
      
      return true
    } catch (error) {
      console.error("Error clearing compare list:", error)
      throw error
    }
  },

  async isInCompare(propertyId) {
    try {
      const tableName = 'compare_item'
      const propertyIdInt = parseInt(propertyId, 10)
      
      if (isNaN(propertyIdInt)) {
        return false
      }
      
      const params = {
        fields: [
          { field: { Name: "Name" } }
        ],
        where: [
          { FieldName: "property_id", Operator: "EqualTo", Values: [propertyIdInt.toString()] }
        ]
      }
      
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const response = await apperClient.fetchRecords(tableName, params)
      
      if (!response.success) {
        return false
      }
      
      return (response.data || []).length > 0
    } catch (error) {
      console.error("Error checking if property is in compare:", error)
      return false
    }
  }
}

export default compareService