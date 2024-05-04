// index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import EquipmentView from '../views/EquipmentView.vue';
import SoMeView from '../views/SoMeView.vue';
import ProductsView from '../views/ProductsView.vue';
import { auth } from '../firebase.js';
import AppUsersView from '@/views/AppUsersView.vue';
import LoginForm from '@/components/LoginForm.vue';
import { onAuthStateChanged } from 'firebase/auth';
import ProductDetailes from '@/components/ProductDetailes.vue';


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
        /*  requiresAdmin: true, */ // Add meta field to specify admin access
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
  // Wait for Firebase authentication state to resolve
  await new Promise(resolve => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      unsubscribe();
      resolve(user);
    });
  });

  const user = auth.currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);

  console.log("User:", user); // Debugging

  // Check if authentication is required for the route
  if (requiresAuth) {
    if (!user) {
      next('/login');
      return;
    }

    if (requiresAdmin) {
      try {
        const isAdminUser = await isAdmin(user);

        if (!isAdminUser) {
          console.log("Redirecting to home because admin access is required but user does not have admin privileges.");
          next('/');
          return;
        }
      } catch (error) {
        console.error('Error checking admin privileges:', error);
        next('/');
        return;
      }
    }
  }


  // Allow navigation if authentication is successful or not required
  console.log("Allowing navigation."); // Debugging
  next();
});

async function isAdmin(user) {
  try {
    const tokenResult = await user.getIdTokenResult();
    // Check if the 'admin' claim exists and is set to true
    return tokenResult.claims && tokenResult.claims.admin === true;
  } catch (error) {
    console.error('Error fetching user token:', error);
    return false;
  }
}



export default router;
