// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AdminView from '../views/AdminView.vue';
import { auth } from '../firebase.js';

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
        requiresAdmin: true // Add meta field to specify admin access
      },
    },
  ]
});

// src/router/index.js
router.beforeEach(async (to, from, next) => {
  const user = auth.currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);

  console.log("User:", user); // Debugging
  console.log("Requires Auth:", requiresAuth); // Debugging
  console.log("Requires Admin:", requiresAdmin); // Debugging

  if (requiresAuth && !user) {
    console.log("Redirecting to home because authentication is required but user is not logged in."); // Debugging
    next('/');
  } 
  else if (requiresAdmin) {
    try {
      const tokenResult = await user.getIdTokenResult();
      const isAdmin = tokenResult.claims.admin;
      
      if (!isAdmin) {
        console.log("Redirecting to home because admin access is required but user does not have admin privileges."); // Debugging
        next('/');
      } else {
        console.log("Allowing navigation."); // Debugging
        next();
      }
    } catch (error) {
      console.error('Error fetching user token:', error);
      next('/');
    }
  } else {
    console.log("Allowing navigation."); // Debugging
    next();
  }
});






export default router;
