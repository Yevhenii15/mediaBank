import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AdminView from '../views/AdminView.vue'
import { auth } from '../firebase.js'; // Import the auth object


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      meta: {
        requiresAuth: true,
      },
    },
  ]
})

// Navigation guard to check if the route requires authentication
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !auth.currentUser) {
    // If the route requires authentication and the user is not authenticated, redirect to the login page
    next('/');
  } else {
    // Otherwise, proceed with navigation
    next();
  }
});

export default router
