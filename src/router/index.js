// index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import SoMeView from '../views/SoMeView.vue';
import ProductsView from '../views/ProductsView.vue';
import { auth } from '../firebase.js';
import AppUsersView from '@/views/AppUsersView.vue';
import LoginForm from '@/components/LoginForm.vue';
import { onAuthStateChanged } from 'firebase/auth';
import ProductDetailes from '@/components/ProductDetailes.vue';
import OxygenEquipment from '@/views/OxygenEquipment.vue';
import MicroEquipment from '@/views/MicroEquipment.vue';
import LedEquipment from '@/views/LedEquipment.vue';
import isAdmin from '../modules/isAdmin.js'; 


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
      path: '/oxyequipment',
      name: 'oxyequipment',
      component: OxygenEquipment,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/ledequipment',
      name: 'ledequipment',
      component: LedEquipment,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/microequipment',
      name: 'microequipment',
      component: MicroEquipment,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/product/:id',
      name: 'product-detailes',
      component: ProductDetailes,
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
        requiresAdmin: true,
      },
    },
  ]
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);

  // Wait for authentication state to be resolved
  await new Promise(resolve => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      unsubscribe();
      resolve(user);
    });
  });

  const currentUser = auth.currentUser;

  if (requiresAuth && !currentUser) {
    // User is not authenticated, redirect to login page
    next('/login');
  } else if (requiresAdmin) {
    // Check if user is authenticated and has admin role
    if (currentUser) {
      const isAdminUser = await isAdmin(currentUser.uid); // Use isAdmin function
      if (isAdminUser) {
        // User is authenticated and has admin role, allow access
        next();
      } else {
        // User is not authorized, redirect to unauthorized page or home
        next('/');
      }
    } else {
      // User is not authenticated, redirect to login page
      next('/login');
    }
  } else {
    // No authentication or admin role required, proceed with navigation
    next();
  }
});




export default router;

