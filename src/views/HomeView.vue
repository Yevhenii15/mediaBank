<!-- HomeView.vue -->
 <template>
    <div>
      <div>
        <h1>Sign Up form</h1>
        <input placeholder="Email" v-model="email" />
        <input placeholder="Password" type="password" v-model="password" />
        <button @click="signUp">Sign Up</button>
        <hr>
        <h1>Log In form</h1>
        <input placeholder="Username" v-model="email" />
        <input placeholder="Password" type="password" v-model="password" />
        <button @click="logIn">Login</button>
        <hr>
        <button @click="logOut" >Log Out</button>
      </div>
    </div>
</template>

<script setup>
import { login } from '../modules/login.js';
const { email, password, signUp, logOut, logIn } = login();

</script>



