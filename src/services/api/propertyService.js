const propertyService = {
  async getAll() {
    try {
      const tableName = 'property'
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "price" } },
          { field: { Name: "address" } },
          { field: { Name: "city" } },
          { field: { Name: "state" } },
          { field: { Name: "zip_code" } },
          { field: { Name: "bedrooms" } },
          { field: { Name: "bathrooms" } },
          { field: { Name: "square_feet" } },
          { field: { Name: "property_type" } },
          { field: { Name: "images" } },
          { field: { Name: "description" } },
          { field: { Name: "features" } },
          { field: { Name: "coordinates" } },
          { field: { Name: "listing_date" } },
          { field: { Name: "status" } },
          { field: { Name: "featured" } }
        ],
        orderBy: [
          { fieldName: "listing_date", sorttype: "DESC" }
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
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching properties:", error)
      throw error
    }
  },

  async getById(id) {
    try {
      const tableName = 'property'
      const recordId = parseInt(id, 10)
      
      if (isNaN(recordId)) {
        throw new Error('Invalid property ID')
      }
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "price" } },
          { field: { Name: "address" } },
          { field: { Name: "city" } },
          { field: { Name: "state" } },
          { field: { Name: "zip_code" } },
          { field: { Name: "bedrooms" } },
          { field: { Name: "bathrooms" } },
          { field: { Name: "square_feet" } },
          { field: { Name: "property_type" } },
          { field: { Name: "images" } },
          { field: { Name: "description" } },
          { field: { Name: "features" } },
          { field: { Name: "coordinates" } },
          { field: { Name: "listing_date" } },
          { field: { Name: "status" } },
          { field: { Name: "featured" } }
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
      
      return response.data
    } catch (error) {
      console.error(`Error fetching property with ID ${id}:`, error)
      throw error
    }
  },

  async getFeatured() {
    try {
      const tableName = 'property'
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "price" } },
          { field: { Name: "address" } },
          { field: { Name: "city" } },
          { field: { Name: "state" } },
          { field: { Name: "zip_code" } },
          { field: { Name: "bedrooms" } },
          { field: { Name: "bathrooms" } },
          { field: { Name: "square_feet" } },
          { field: { Name: "property_type" } },
          { field: { Name: "images" } },
          { field: { Name: "description" } },
          { field: { Name: "features" } },
          { field: { Name: "coordinates" } },
          { field: { Name: "listing_date" } },
          { field: { Name: "status" } },
          { field: { Name: "featured" } }
        ],
        where: [
          { FieldName: "featured", Operator: "ExactMatch", Values: ["true"] }
        ],
        orderBy: [
          { fieldName: "listing_date", sorttype: "DESC" }
        ],
        pagingInfo: {
          limit: 6,
          offset: 0
        }
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
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching featured properties:", error)
      throw error
    }
  },

  async search(filters) {
    try {
      const tableName = 'property'
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "price" } },
          { field: { Name: "address" } },
          { field: { Name: "city" } },
          { field: { Name: "state" } },
          { field: { Name: "zip_code" } },
          { field: { Name: "bedrooms" } },
          { field: { Name: "bathrooms" } },
          { field: { Name: "square_feet" } },
          { field: { Name: "property_type" } },
          { field: { Name: "images" } },
          { field: { Name: "description" } },
          { field: { Name: "features" } },
          { field: { Name: "coordinates" } },
          { field: { Name: "listing_date" } },
          { field: { Name: "status" } },
          { field: { Name: "featured" } }
        ],
        orderBy: [
          { fieldName: "listing_date", sorttype: "DESC" }
        ]
      }
      
      // Build where conditions based on filters
      const whereConditions = []
      
      if (filters.location && filters.location.trim()) {
        whereConditions.push({
          FieldName: "title",
          Operator: "Contains",
          Values: [filters.location.trim()]
        })
        whereConditions.push({
          FieldName: "address",
          Operator: "Contains", 
          Values: [filters.location.trim()]
        })
        whereConditions.push({
          FieldName: "city",
          Operator: "Contains",
          Values: [filters.location.trim()]
        })
        whereConditions.push({
          FieldName: "state",
          Operator: "Contains",
          Values: [filters.location.trim()]
        })
      }
      
      if (filters.priceMin && filters.priceMin > 0) {
        whereConditions.push({
          FieldName: "price",
          Operator: "GreaterThanOrEqualTo",
          Values: [filters.priceMin.toString()]
        })
      }
      
      if (filters.priceMax && filters.priceMax > 0) {
        whereConditions.push({
          FieldName: "price",
          Operator: "LessThanOrEqualTo",
          Values: [filters.priceMax.toString()]
        })
      }
      
      if (filters.bedrooms && filters.bedrooms > 0) {
        whereConditions.push({
          FieldName: "bedrooms",
          Operator: "GreaterThanOrEqualTo",
          Values: [filters.bedrooms.toString()]
        })
      }
      
      if (filters.bathrooms && filters.bathrooms > 0) {
        whereConditions.push({
          FieldName: "bathrooms",
          Operator: "GreaterThanOrEqualTo",
          Values: [filters.bathrooms.toString()]
        })
      }
      
      if (filters.propertyTypes && filters.propertyTypes.length > 0) {
        whereConditions.push({
          FieldName: "property_type",
          Operator: "ExactMatch",
          Values: filters.propertyTypes
        })
      }
      
      // Add whereGroups for location search (OR logic for multiple fields)
      if (filters.location && filters.location.trim()) {
        params.whereGroups = [{
          operator: "OR",
          subGroups: [
            {
              conditions: [
                { fieldName: "title", operator: "Contains", values: [filters.location.trim()] }
              ]
            },
            {
              conditions: [
                { fieldName: "address", operator: "Contains", values: [filters.location.trim()] }
              ]
            },
            {
              conditions: [
                { fieldName: "city", operator: "Contains", values: [filters.location.trim()] }
              ]
            },
            {
              conditions: [
                { fieldName: "state", operator: "Contains", values: [filters.location.trim()] }
              ]
            }
          ]
        }]
      }
      
      // Add other filters to where (AND logic)
      const otherConditions = whereConditions.filter(condition => 
        !['title', 'address', 'city', 'state'].includes(condition.FieldName)
      )
      
      if (otherConditions.length > 0) {
        params.where = otherConditions
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
      
      return response.data || []
    } catch (error) {
      console.error("Error searching properties:", error)
      throw error
    }
  },

  async create(property) {
    try {
      const tableName = 'property'
      
      // Only include updateable fields
      const propertyData = {
        Name: property.Name || property.title,
        title: property.title,
        price: property.price,
        address: property.address,
        city: property.city,
        state: property.state,
        zip_code: property.zip_code || property.zipCode,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        square_feet: property.square_feet || property.squareFeet,
        property_type: property.property_type || property.propertyType,
        images: property.images,
        description: property.description,
        features: property.features,
        coordinates: property.coordinates,
        listing_date: new Date().toISOString().split('T')[0],
        status: property.status || 'active',
        featured: property.featured || false
      }
      
      const params = {
        records: [propertyData]
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
          throw new Error(failedRecords[0].message || 'Failed to create property')
        }
        
        return response.results[0].data
      }
      
      throw new Error('No results returned from create operation')
    } catch (error) {
      console.error("Error creating property:", error)
      throw error
    }
  },

  async update(id, updates) {
    try {
      const tableName = 'property'
      const recordId = parseInt(id, 10)
      
      if (isNaN(recordId)) {
        throw new Error('Invalid property ID')
      }
      
      // Only include updateable fields, exclude system fields
      const { Id, CreatedOn, CreatedBy, ModifiedOn, ModifiedBy, ...updateableFields } = updates
      
      const propertyData = {
        Id: recordId,
        ...updateableFields
      }
      
      // Map field names for database
      if (propertyData.zipCode) {
        propertyData.zip_code = propertyData.zipCode
        delete propertyData.zipCode
      }
      if (propertyData.squareFeet) {
        propertyData.square_feet = propertyData.squareFeet
        delete propertyData.squareFeet
      }
      if (propertyData.propertyType) {
        propertyData.property_type = propertyData.propertyType
        delete propertyData.propertyType
      }
      if (propertyData.listingDate) {
        propertyData.listing_date = propertyData.listingDate
        delete propertyData.listingDate
      }
      
      const params = {
        records: [propertyData]
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
          throw new Error(failedRecords[0].message || 'Failed to update property')
        }
        
        return response.results[0].data
      }
      
      throw new Error('No results returned from update operation')
    } catch (error) {
      console.error(`Error updating property with ID ${id}:`, error)
      throw error
    }
  },

  async delete(id) {
    try {
      const tableName = 'property'
      const recordId = parseInt(id, 10)
      
      if (isNaN(recordId)) {
        throw new Error('Invalid property ID')
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
          throw new Error(failedRecords[0].message || 'Failed to delete property')
        }
        
        return true
      }
      
      return true
    } catch (error) {
      console.error(`Error deleting property with ID ${id}:`, error)
      throw error
    }
  },

  async getMultiple(ids) {
    try {
      const tableName = 'property'
      const recordIds = ids.map(id => parseInt(id, 10)).filter(id => !isNaN(id))
      
      if (recordIds.length === 0) {
        return []
      }
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "price" } },
          { field: { Name: "address" } },
          { field: { Name: "city" } },
          { field: { Name: "state" } },
          { field: { Name: "zip_code" } },
          { field: { Name: "bedrooms" } },
          { field: { Name: "bathrooms" } },
          { field: { Name: "square_feet" } },
          { field: { Name: "property_type" } },
          { field: { Name: "images" } },
          { field: { Name: "description" } },
          { field: { Name: "features" } },
          { field: { Name: "coordinates" } },
          { field: { Name: "listing_date" } },
          { field: { Name: "status" } },
          { field: { Name: "featured" } }
        ],
        where: [
          { FieldName: "Id", Operator: "ExactMatch", Values: recordIds.map(id => id.toString()) }
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
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching multiple properties:", error)
      throw error
    }
  }
}

export default propertyService