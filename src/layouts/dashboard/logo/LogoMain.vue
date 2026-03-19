<template>
  <div class="logo" style="display: flex; align-items: center; height: 28px;">
    <RouterLink to="/dashboard/v2" aria-label="logo" style="display: flex; align-items: center;">
      <img src="@/assets/images/eQms-logo.png" alt="Loading" style="height:6em; object-fit: contain;" />
    </RouterLink>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
const primary = ref('rgb(var(--v-theme-primary))');
</script>
