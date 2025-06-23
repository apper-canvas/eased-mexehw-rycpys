const neighborhoodService = {
  async getByPropertyId(propertyId) {
    try {
      const tableName = 'neighborhood'
      const parsedId = parseInt(propertyId, 10)
      
      if (isNaN(parsedId)) {
        throw new Error('Invalid property ID')
      }
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "property_id" } },
          { field: { Name: "school_rating" } },
          { field: { Name: "elementary_rating" } },
          { field: { Name: "middle_school_rating" } },
          { field: { Name: "high_school_rating" } },
          { field: { Name: "transit_score" } },
          { field: { Name: "bus_routes" } },
          { field: { Name: "nearest_station" } },
          { field: { Name: "avg_wait_time" } }
        ],
        where: [
          { FieldName: "property_id", Operator: "EqualTo", Values: [parsedId.toString()] }
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
      
      const neighborhoods = response.data || []
      if (neighborhoods.length === 0) {
        throw new Error('Neighborhood stats not found')
      }
      
      const neighborhood = neighborhoods[0]
      
      // Map database fields to component expected format
      return {
        ...neighborhood,
        propertyId: neighborhood.property_id,
        schoolRating: neighborhood.school_rating,
        elementaryRating: neighborhood.elementary_rating,
        middleSchoolRating: neighborhood.middle_school_rating,
        highSchoolRating: neighborhood.high_school_rating,
        transitScore: neighborhood.transit_score,
        busRoutes: neighborhood.bus_routes,
        nearestStation: neighborhood.nearest_station,
        avgWaitTime: neighborhood.avg_wait_time
      }
    } catch (error) {
      console.error(`Error fetching neighborhood for property ${propertyId}:`, error)
      throw error
    }
  },

  async getAll() {
    try {
      const tableName = 'neighborhood'
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "property_id" } },
          { field: { Name: "school_rating" } },
          { field: { Name: "elementary_rating" } },
          { field: { Name: "middle_school_rating" } },
          { field: { Name: "high_school_rating" } },
          { field: { Name: "transit_score" } },
          { field: { Name: "bus_routes" } },
          { field: { Name: "nearest_station" } },
          { field: { Name: "avg_wait_time" } }
        ],
        orderBy: [
          { fieldName: "school_rating", sorttype: "DESC" }
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
      return (response.data || []).map(neighborhood => ({
        ...neighborhood,
        propertyId: neighborhood.property_id,
        schoolRating: neighborhood.school_rating,
        elementaryRating: neighborhood.elementary_rating,
        middleSchoolRating: neighborhood.middle_school_rating,
        highSchoolRating: neighborhood.high_school_rating,
        transitScore: neighborhood.transit_score,
        busRoutes: neighborhood.bus_routes,
        nearestStation: neighborhood.nearest_station,
        avgWaitTime: neighborhood.avg_wait_time
      }))
    } catch (error) {
      console.error("Error fetching neighborhoods:", error)
      throw error
    }
  },

  async create(neighborhoodData) {
    try {
      const tableName = 'neighborhood'
      
      // Only include updateable fields
      const neighborhoodFields = {
        Name: neighborhoodData.Name || `Neighborhood for Property ${neighborhoodData.property_id || neighborhoodData.propertyId}`,
        property_id: parseInt(neighborhoodData.property_id || neighborhoodData.propertyId, 10),
        school_rating: neighborhoodData.school_rating || neighborhoodData.schoolRating,
        elementary_rating: neighborhoodData.elementary_rating || neighborhoodData.elementaryRating,
        middle_school_rating: neighborhoodData.middle_school_rating || neighborhoodData.middleSchoolRating,
        high_school_rating: neighborhoodData.high_school_rating || neighborhoodData.highSchoolRating,
        transit_score: neighborhoodData.transit_score || neighborhoodData.transitScore,
        bus_routes: neighborhoodData.bus_routes || neighborhoodData.busRoutes,
        nearest_station: neighborhoodData.nearest_station || neighborhoodData.nearestStation,
        avg_wait_time: neighborhoodData.avg_wait_time || neighborhoodData.avgWaitTime
      }
      
      const params = {
        records: [neighborhoodFields]
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
          throw new Error(failedRecords[0].message || 'Failed to create neighborhood')
        }
        
        const newNeighborhood = response.results[0].data
        return {
          ...newNeighborhood,
          propertyId: newNeighborhood.property_id,
          schoolRating: newNeighborhood.school_rating,
          elementaryRating: newNeighborhood.elementary_rating,
          middleSchoolRating: newNeighborhood.middle_school_rating,
          highSchoolRating: newNeighborhood.high_school_rating,
          transitScore: newNeighborhood.transit_score,
          busRoutes: newNeighborhood.bus_routes,
          nearestStation: newNeighborhood.nearest_station,
          avgWaitTime: newNeighborhood.avg_wait_time
        }
      }
      
      throw new Error('No results returned from create operation')
    } catch (error) {
      console.error("Error creating neighborhood:", error)
      throw error
    }
  },

  async update(id, neighborhoodData) {
    try {
      const tableName = 'neighborhood'
      const recordId = parseInt(id, 10)
      
      if (isNaN(recordId)) {
        throw new Error('Invalid neighborhood ID')
      }
      
      // Only include updateable fields, exclude system fields
      const { Id, CreatedOn, CreatedBy, ModifiedOn, ModifiedBy, ...updateableFields } = neighborhoodData
      
      // Map field names for database
      const neighborhoodFields = {
        Id: recordId,
        ...updateableFields
      }
      
      if (neighborhoodFields.propertyId) {
        neighborhoodFields.property_id = neighborhoodFields.propertyId
        delete neighborhoodFields.propertyId
      }
      if (neighborhoodFields.schoolRating) {
        neighborhoodFields.school_rating = neighborhoodFields.schoolRating
        delete neighborhoodFields.schoolRating
      }
      if (neighborhoodFields.elementaryRating) {
        neighborhoodFields.elementary_rating = neighborhoodFields.elementaryRating
        delete neighborhoodFields.elementaryRating
      }
      if (neighborhoodFields.middleSchoolRating) {
        neighborhoodFields.middle_school_rating = neighborhoodFields.middleSchoolRating
        delete neighborhoodFields.middleSchoolRating
      }
      if (neighborhoodFields.highSchoolRating) {
        neighborhoodFields.high_school_rating = neighborhoodFields.highSchoolRating
        delete neighborhoodFields.highSchoolRating
      }
      if (neighborhoodFields.transitScore) {
        neighborhoodFields.transit_score = neighborhoodFields.transitScore
        delete neighborhoodFields.transitScore
      }
      if (neighborhoodFields.busRoutes) {
        neighborhoodFields.bus_routes = neighborhoodFields.busRoutes
        delete neighborhoodFields.busRoutes
      }
      if (neighborhoodFields.nearestStation) {
        neighborhoodFields.nearest_station = neighborhoodFields.nearestStation
        delete neighborhoodFields.nearestStation
      }
      if (neighborhoodFields.avgWaitTime) {
        neighborhoodFields.avg_wait_time = neighborhoodFields.avgWaitTime
        delete neighborhoodFields.avgWaitTime
      }
      
      const params = {
        records: [neighborhoodFields]
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
          throw new Error(failedRecords[0].message || 'Failed to update neighborhood')
        }
        
        const updatedNeighborhood = response.results[0].data
        return {
          ...updatedNeighborhood,
          propertyId: updatedNeighborhood.property_id,
          schoolRating: updatedNeighborhood.school_rating,
          elementaryRating: updatedNeighborhood.elementary_rating,
          middleSchoolRating: updatedNeighborhood.middle_school_rating,
          highSchoolRating: updatedNeighborhood.high_school_rating,
          transitScore: updatedNeighborhood.transit_score,
          busRoutes: updatedNeighborhood.bus_routes,
          nearestStation: updatedNeighborhood.nearest_station,
          avgWaitTime: updatedNeighborhood.avg_wait_time
        }
      }
      
      throw new Error('No results returned from update operation')
    } catch (error) {
      console.error(`Error updating neighborhood with ID ${id}:`, error)
      throw error
    }
  },

  async delete(id) {
    try {
      const tableName = 'neighborhood'
      const recordId = parseInt(id, 10)
      
      if (isNaN(recordId)) {
        throw new Error('Invalid neighborhood ID')
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
          throw new Error(failedRecords[0].message || 'Failed to delete neighborhood')
        }
      }
      
      return true
    } catch (error) {
      console.error(`Error deleting neighborhood with ID ${id}:`, error)
      throw error
    }
  }
}

export default neighborhoodService