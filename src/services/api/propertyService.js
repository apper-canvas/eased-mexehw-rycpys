import mockProperties from '../mockData/properties.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let properties = [...mockProperties]

const propertyService = {
  async getAll() {
    await delay(300)
    return [...properties]
  },

  async getById(id) {
    await delay(200)
    const property = properties.find(p => p.Id === parseInt(id, 10))
    if (!property) {
      throw new Error('Property not found')
    }
    return { ...property }
  },

  async getFeatured() {
    await delay(250)
    const featured = properties.filter(p => p.featured).slice(0, 6)
    return [...featured]
  },

async search(filters) {
    await delay(400)
    let filtered = [...properties]

    if (filters.location) {
      const location = filters.location.toLowerCase().trim()
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(location) ||
        p.address.toLowerCase().includes(location) ||
        p.city.toLowerCase().includes(location) ||
        p.state.toLowerCase().includes(location)
      )
    }
    if (filters.priceMin) {
      filtered = filtered.filter(p => p.price >= filters.priceMin)
    }

    if (filters.priceMax) {
      filtered = filtered.filter(p => p.price <= filters.priceMax)
    }

    if (filters.bedrooms) {
      filtered = filtered.filter(p => p.bedrooms >= filters.bedrooms)
    }

    if (filters.bathrooms) {
      filtered = filtered.filter(p => p.bathrooms >= filters.bathrooms)
    }

    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      filtered = filtered.filter(p => filters.propertyTypes.includes(p.propertyType))
    }

    return filtered
  },

  async create(property) {
    await delay(500)
    const newId = Math.max(...properties.map(p => p.Id)) + 1
    const newProperty = {
      ...property,
      Id: newId,
      listingDate: new Date().toISOString().split('T')[0],
      status: 'active'
    }
    properties.push(newProperty)
    return { ...newProperty }
  },

  async update(id, updates) {
    await delay(400)
    const index = properties.findIndex(p => p.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Property not found')
    }
    
    const { Id, ...updatableFields } = updates
    properties[index] = { ...properties[index], ...updatableFields }
    return { ...properties[index] }
  },

  async delete(id) {
    await delay(300)
    const index = properties.findIndex(p => p.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Property not found')
    }
    properties.splice(index, 1)
properties.splice(index, 1)
    return true
  },

  async getMultiple(ids) {
    await delay(300)
    const propertyIds = ids.map(id => parseInt(id, 10))
    const matchedProperties = properties.filter(p => propertyIds.includes(p.Id))
    return matchedProperties.map(p => ({ ...p }))
  }
}