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
        requiresRole: 'admin', // Specify role required for access
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

        /*  requiresAdmin: true // Add meta field to specify admin access */
      },
    },
  ]
});

router.beforeEach(async (to, from, next) => {
  await new Promise(resolve => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      unsubscribe();
      resolve(user);
    });
  });

  const user = auth.currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiredRole = to.meta.requiresRole;

  if (requiresAuth && !user) {
    next('/login');
  } else if (requiresAuth && requiredRole && user) {
    // Check if the user has the required role
    if (user.role !== requiredRole) {
      console.log(`User does not have required role ${requiredRole}. Redirecting to home.`);
      next('/');
      return;
    }
  }

  next();
});


export default router;

