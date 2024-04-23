import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import EquipmentView from '../views/EquipmentView.vue';
import SoMeView from '../views/SoMeView.vue';
import ProductsView from '../views/ProductsView.vue';
import { auth } from '../firebase.js';
import AppUsersView from '@/views/AppUsersView.vue';
import LoginForm from '@/components/LoginForm.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/equipment',
      name: 'equipment',
      component: EquipmentView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/some',
      name: 'some',
      component: SoMeView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/products',
      name: 'products',
      component: ProductsView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginForm,
    },
    {
      path: '/app-users',
      name: 'app-users',
      component: AppUsersView,
      meta: {
        requiresAuth: true,
        requiresAdmin: true // Add meta field to specify admin access
      },
    },
  ]
});

// Add a flag to track if it's the first page load
let isFirstLoad = true;

router.beforeEach(async (to, from, next) => {
  const user = auth.currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);

  console.log("User:", user); // Debugging
  console.log("Requires Auth:", requiresAuth); // Debugging
  console.log("Requires Admin:", requiresAdmin); // Debugging

  // Check if it's the first page load and the user is not logged in
  if (isFirstLoad && !user) {
    isFirstLoad = false;
    next('/login'); // Redirect to login page
  } else if (requiresAuth && !user) {
    next('/login'); // Redirect to login page if authentication is required and user is not logged in
  } else if (requiresAdmin) {
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
