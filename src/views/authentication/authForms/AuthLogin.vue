<script lang="ts">
import { defineComponent, ref } from 'vue';
import SvgSprite from '@/components/shared/SvgSprite.vue';
import { useAuthStore } from '@/stores/auth';
import { Form } from 'vee-validate';
// import { loginWithGoogle } from '@/services/auth.js';
export default defineComponent({
  name: 'LoginForm',
  components: {
    SvgSprite,
    Form
  },
  mounted() {
    // Check if redirected from Google OAuth
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('success')) {
      const value = urlParams.get('success');

      const authStore = useAuthStore();
      if (value) {
        authStore.googleLogin(value).catch((error) => {
          alert('Google login failed:' + error);
        });
      }
    }
    console.log('URL Params:', urlParams.has('success'));
  },
  setup() {
    const checkbox = ref(false);
    const valid = ref(false);
    const show1 = ref(false);
    const password = ref('');
    const username = ref('');

    // Password validation rules
    const passwordRules = ref([
      (v: string) => !!v || 'Password is required',
      (v: string) => v === v.trim() || 'Password cannot start or end with spaces',
    ]);

    // Email validation rules
    const emailRules = ref([
      (v: string) => !!v.trim() || 'E-mail is required',
      (v: string) => {
        const trimmedEmail = v.trim();
        return !/\s/.test(trimmedEmail) || 'E-mail must not contain spaces';
      },
      (v: string) => /.+@.+\..+/.test(v.trim()) || 'E-mail must be valid'
    ]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function validate(values: any, { setErrors }: any) {
      const trimmedUsername = username.value.trim();
      username.value = trimmedUsername;

      const authStore = useAuthStore();
      return authStore.login(trimmedUsername, password.value)
        .catch((error) => setErrors({ apiError: error }));
    }

    function loginWithGoogle() {
      //window.location.href = '/auth/google/callback';
      const authStore = useAuthStore();
      authStore.loginWithGoogle().catch((error) => {
        alert('Google login failed:' + error);
      });
    }

    return {
      checkbox,
      valid,
      show1,
      password,
      username,
      passwordRules,
      emailRules,
      validate,
      loginWithGoogle
    };
  }
});
</script>


<template>
  <div class="d-flex justify-space-between align-center mt-4">
    <h3 class="text-h3 text-center mb-0">Login</h3>
    <!--  <router-link to="/register1" class="text-primary text-decoration-none">Don't Have an account?</router-link> -->
  </div>
  <Form @submit="validate" class="mt-7 loginForm" v-slot="{ errors, isSubmitting }">
    <div class="mb-6">
      <v-label>Email Address</v-label>
      <v-text-field aria-label="email address" v-model="username" :rules="emailRules" class="mt-2" density="comfortable"
        required hide-details="auto" variant="outlined" color="primary"></v-text-field>
    </div>
    <div>
      <v-label>Password</v-label>
      <v-text-field aria-label="password" v-model="password" :rules="passwordRules" required variant="outlined"
        density="comfortable" color="primary" hide-details="auto" :type="show1 ? 'text' : 'password'"
        class="pwdInput mt-2">
        <template v-slot:append-inner>
          <v-btn color="secondary" aria-label="icon" icon rounded variant="text">
            <SvgSprite name="custom-eye-invisible" style="width: 20px; height: 20px" v-if="show1 == false"
              @click="show1 = !show1" />
            <SvgSprite name="custom-eye" style="width: 20px; height: 20px" v-if="show1 == true"
              @click="show1 = !show1" />
          </v-btn>
        </template>
      </v-text-field>
    </div>

    <div class="d-flex align-center mt-4 mb-7 mb-sm-0">
      <v-checkbox v-model="checkbox" :rules="[(v: any) => !!v || 'You must agree to continue!']" label="Keep me sign in"
        required color="primary" class="ms-n2" hide-details></v-checkbox>
      <div class="ml-auto">
        <router-link to="/forgot-pwd1" class="text-darkText link-hover">Forgot Password?</router-link>
      </div>
    </div>
    <v-btn color="primary" :loading="isSubmitting" block class="mt-5" variant="flat" size="large" rounded="md"
      :disabled="valid" type="submit">
      Login</v-btn>
    <v-btn color="secondary" @click="loginWithGoogle" block class="mt-5" variant="flat" size="large" rounded="md"
      :disabled="valid" type="button">
      <span class="relative grid h-4 w-4 place-items-center"><span class="absolute"><svg width="19" height="19"
            viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M21.0461 12.2099C21.0461 11.5553 20.9874 10.9259 20.8783 10.3217H12.1846V13.8966H17.1524C16.9342 15.0462 16.2797 16.0197 15.2979 16.6742V18.9987H18.2937C20.0391 17.3875 21.0461 15.0211 21.0461 12.2099Z"
              fill="#4285F4"></path>
            <path
              d="M12.1844 21.2307C14.6767 21.2307 16.7662 20.4084 18.2935 18.9986L15.2977 16.6741C14.4753 17.2279 13.4264 17.5636 12.1844 17.5636C9.78441 17.5636 7.74525 15.944 7.01518 13.7622H3.94385V16.1454C5.46273 19.158 8.57602 21.2307 12.1844 21.2307Z"
              fill="#34A853"></path>
            <path
              d="M7.01516 13.7539C6.83054 13.2 6.72145 12.6126 6.72145 12C6.72145 11.3874 6.83054 10.8 7.01516 10.2462V7.86295H3.94382C3.31445 9.10491 2.95361 10.5063 2.95361 12C2.95361 13.4937 3.31445 14.8951 3.94382 16.1371L6.33544 14.2741L7.01516 13.7539Z"
              fill="#FBBC05"></path>
            <path
              d="M12.1844 6.44475C13.5439 6.44475 14.7522 6.91469 15.7173 7.82098L18.3606 5.17762C16.7578 3.68391 14.6767 2.76923 12.1844 2.76923C8.57602 2.76923 5.46273 4.84196 3.94385 7.86294L7.01518 10.2462C7.74525 8.06434 9.78441 6.44475 12.1844 6.44475Z"
              fill="#EA4335"></path>
          </svg></span></span>
      Continue with Google
    </v-btn>
    <!-- <button @click="loginWithGoogle" class="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
      Sign in with Google
    </button> -->
    <div v-if="errors.apiError" class="mt-2">
      <v-alert color="error">{{ errors.apiError }}</v-alert>
    </div>
  </Form>
</template>
