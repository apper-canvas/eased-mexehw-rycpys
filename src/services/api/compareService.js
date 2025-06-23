const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let compareList = []
let nextId = 1

const compareService = {
  async getCompareList() {
    await delay(200)
    return [...compareList]
  },

  async addToCompare(propertyId) {
    await delay(300)
    const propertyIdInt = parseInt(propertyId, 10)
    
    // Check if already in compare list
    const existing = compareList.find(item => item.propertyId === propertyIdInt)
    if (existing) {
      throw new Error('Property already in comparison list')
    }
    
    // Limit to 4 properties for comparison
    if (compareList.length >= 4) {
      throw new Error('Maximum 4 properties can be compared at once')
    }
    
    const newItem = {
      Id: nextId++,
      propertyId: propertyIdInt,
      dateAdded: new Date().toISOString()
    }
    
    compareList.push(newItem)
    return { ...newItem }
  },

  async removeFromCompare(propertyId) {
    await delay(200)
    const propertyIdInt = parseInt(propertyId, 10)
    const index = compareList.findIndex(item => item.propertyId === propertyIdInt)
    
    if (index === -1) {
      throw new Error('Property not found in comparison list')
    }
    
    compareList.splice(index, 1)
    return true
  },

  async clearCompare() {
    await delay(200)
    compareList = []
    return true
  },

  async isInCompare(propertyId) {
    await delay(100)
    const propertyIdInt = parseInt(propertyId, 10)
    return compareList.some(item => item.propertyId === propertyIdInt)
  }
}

export default compareService