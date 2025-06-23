import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useState, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector } from 'react-redux'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import { routes } from './config/routes'
import { AuthContext } from './App'
const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const { logout } = useContext(AuthContext)
  const { user } = useSelector((state) => state.user)

  const visibleRoutes = Object.values(routes).filter(route => !route.hidden)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="flex-shrink-0 bg-white border-b border-surface-200 shadow-sm z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <ApperIcon name="Home" className="w-8 h-8 text-primary mr-3" />
              <span className="text-xl font-display font-semibold text-surface-900">
                HomeFinder Pro
              </span>
            </div>

{/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <nav className="flex space-x-8">
                {visibleRoutes.map(route => (
                  <NavLink
                    key={route.id}
                    to={route.path}
                    className={({ isActive }) =>
                      `flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? 'text-primary bg-primary/10'
                          : 'text-surface-600 hover:text-primary hover:bg-surface-100'
                      }`
                    }
                  >
                    <ApperIcon name={route.icon} className="w-4 h-4" />
                    <span>{route.label}</span>
                  </NavLink>
                ))}
              </nav>
              
              {/* User Menu */}
              <div className="flex items-center space-x-4 pl-4 border-l border-surface-200">
                {user && (
                  <span className="text-sm text-surface-600">
                    {user.firstName} {user.lastName}
                  </span>
                )}
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <ApperIcon name="LogOut" className="w-4 h-4" />
                  <span>Logout</span>
                </Button>
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-md text-surface-600 hover:text-primary hover:bg-surface-100 transition-colors"
            >
              <ApperIcon 
                name={isMobileMenuOpen ? "X" : "Menu"} 
                className="w-5 h-5" 
              />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-surface-200 bg-white"
            >
              <div className="px-4 py-2 space-y-1">
                {visibleRoutes.map(route => (
                  <NavLink
                    key={route.id}
                    to={route.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? 'text-primary bg-primary/10'
                          : 'text-surface-600 hover:text-primary hover:bg-surface-100'
                      }`
                    }
                  >
                    <ApperIcon name={route.icon} className="w-4 h-4" />
<span>{route.label}</span>
                  </NavLink>
                ))}
                
                {/* Mobile Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-surface-600 hover:text-primary hover:bg-surface-100 transition-colors duration-200 w-full"
                >
                  <ApperIcon name="LogOut" className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* Bottom Tab Navigation for Mobile */}
      <div className="md:hidden bg-white border-t border-surface-200 z-40">
        <div className="flex justify-around py-2">
          {visibleRoutes.slice(0, 4).map(route => (
            <NavLink
              key={route.id}
              to={route.path}
              className={({ isActive }) =>
                `flex flex-col items-center py-2 px-3 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'text-primary'
                    : 'text-surface-500 hover:text-primary'
                }`
              }
            >
              <ApperIcon name={route.icon} className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{route.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Layout