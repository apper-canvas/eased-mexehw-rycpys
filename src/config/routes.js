import Home from '@/components/pages/Home'
import Properties from '@/components/pages/Properties'
import MapView from '@/components/pages/MapView'
import PropertyDetail from '@/components/pages/PropertyDetail'
import Favorites from '@/components/pages/Favorites'
import Agents from '@/components/pages/Agents'
export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
    component: Home
  },
  properties: {
    id: 'properties',
    label: 'Properties',
    path: '/properties',
    icon: 'Building2',
    component: Properties
  },
  mapView: {
    id: 'mapView',
    label: 'Map View',
    path: '/map',
    icon: 'Map',
    component: MapView
},
  agents: {
    id: 'agents',
    label: 'Agents',
    path: '/agents',
    icon: 'Users',
    component: Agents
  },
  favorites: {
    id: 'favorites',
    label: 'Favorites',
    path: '/favorites',
    icon: 'Heart',
    component: Favorites
  },
  propertyDetail: {
    id: 'propertyDetail',
    label: 'Property Detail',
    path: '/property/:id',
    icon: 'Home',
    component: PropertyDetail,
    hidden: true
  }
}

export const routeArray = Object.values(routes)
export default routes