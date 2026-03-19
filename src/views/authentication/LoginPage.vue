<script setup lang="ts">
import AuthLogin from './authForms/AuthLogin.vue';
// assets 
</script>

<template>
  <v-row class="bg-containerBg position-relative" no-gutters>

    <!---Login Part-->
    <v-col cols="12" lg="12" class="d-flex align-center fullscreen-img">
      <v-container>
        <div class="d-flex align-center justify-center" style="min-height: calc(100vh - 148px)">
          <v-row justify="center">
            <v-col cols="12" md="12">
              <v-card elevation="0" variant="outlined" rounded="lg" class="loginBox bg-surface">
                <v-card-text class="pa-sm-10 pa-6">

                  <h2 class="mb-2 text-center"><b>BMA e-QMS</b></h2>
                  <p class="text-center">ELECTRONIC QUALITY MANAGEMENT SYSTEM</p>

                  <!---Login Form-->
                  <AuthLogin />
                  <!---Login Form-->
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </v-col>
    <!---Login Part-->
  </v-row>
</template>
<style lang="scss">
.loginBox {
  max-width: 475px;
  margin: 0 auto;
}

.fullscreen-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  background-image: url('/src/assets/images/building.png');
  background-size: cover;
  /* scale image to cover entire area */
  background-position: center;
  background-repeat: no-repeat;
  /* Optional */
}
</style>
