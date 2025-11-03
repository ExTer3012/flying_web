import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'

// Import Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Import des composants
import Home from './views/Home.vue'
import RechercheVols from './views/RechercheVols.vue'
import Reservation from './views/Reservation.vue'
import MaReservation from './views/MaReservation.vue'
import AdminLogin from './views/admin/Login.vue'
import AdminDashboard from './views/admin/Dashboard.vue'
import AdminAvions from './views/admin/Avions.vue'
import AdminAeroports from './views/admin/Aeroports.vue'
import AdminVols from './views/admin/Vols.vue'

// Configuration des routes
const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/recherche', name: 'RechercheVols', component: RechercheVols },
  { path: '/reservation/:volId', name: 'Reservation', component: Reservation },
  { path: '/ma-reservation/:token', name: 'MaReservation', component: MaReservation },
  { path: '/admin', redirect: '/admin/login' },
  { path: '/admin/login', name: 'AdminLogin', component: AdminLogin },
  { path: '/admin/dashboard', name: 'AdminDashboard', component: AdminDashboard, meta: { requiresAuth: true }},
  { path: '/admin/avions', name: 'AdminAvions', component: AdminAvions, meta: { requiresAuth: true }},
  { path: '/admin/aeroports', name: 'AdminAeroports', component: AdminAeroports, meta: { requiresAuth: true }},
  { path: '/admin/vols', name: 'AdminVols', component: AdminVols, meta: { requiresAuth: true }}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard pour les routes admin
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !localStorage.getItem('token')) {
    next('/admin/login')
  } else {
    next()
  }
})

const app = createApp(App)
app.use(router)
app.mount('#app')
