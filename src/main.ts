import { createApp } from 'vue';
import { createPinia } from 'pinia'; // Keep this import at the top
import App from './App.vue';
import { router } from './router';
import vuetify from './plugins/vuetify';
import '@mdi/font/css/materialdesignicons.css';

import '@/scss/style.scss';
import { PerfectScrollbarPlugin } from 'vue3-perfect-scrollbar';
import VueApexCharts from 'vue3-apexcharts';
import VueTablerIcons from 'vue-tabler-icons';

import SvgSprite from '@/components/shared/SvgSprite.vue';

// google-fonts
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/700.css';

import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';

import '@fontsource/public-sans/400.css';
import '@fontsource/public-sans/500.css';
import '@fontsource/public-sans/600.css';
import '@fontsource/public-sans/700.css';
import Vueform from '@vueform/vueform'
import vueformConfig from './../vueform.config'
import Builder from '@vueform/builder'
import builderConfig from './../builder.config'
import { fakeBackend } from '@/utils/helpers/fake-backend';
const app = createApp(App);

// Initialize fake backend if necessary, assuming it doesn't depend on Pinia immediately
fakeBackend();

// ✨ CRITICAL CHANGE: Initialize Pinia BEFORE using the router or any components that depend on stores.
app.use(createPinia());

// Now, other plugins and the router can be used, as Pinia is ready.
app.use(router);
app.use(PerfectScrollbarPlugin);
app.component('SvgSprite', SvgSprite);
app.use(VueTablerIcons);
app.use(VueApexCharts);
app.use(Vueform, vueformConfig)
app.use(Builder, builderConfig)
app.use(vuetify).mount('#app');
