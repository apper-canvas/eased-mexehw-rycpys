import { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'

const SearchBar = ({ onSearch, placeholder = "Search by city, address, or neighborhood" }) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch?.(searchTerm)
  }

  const handleClear = () => {
    setSearchTerm('')
    onSearch?.('')
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="relative"
    >
<div className="relative">
        <ApperIcon 
          name="Search" 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-5 h-5 z-10" 
        />
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="pl-12 pr-20"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-12 top-1/2 transform -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors"
          >
            <ApperIcon name="X" className="w-4 h-4" />
          </button>
        )}
        
        <Button
          type="submit"
          size="sm"
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
        >
          Search
        </Button>
      </div>
    </motion.form>
  )
}

export default SearchBar