<template>
  <v-dialog :model-value="modelValue" @update:model-value="formModalClose" max-width="800">
    <v-card>
      <v-card-title class="text-h5 d-flex align-center">
        FORM INFORMATION
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="formModalClose">Close</v-btn>
      </v-card-title>
      <v-tabs v-model="formModalTab" color="success" class="mb-3">
        <v-tab value="one" class="font-weight-medium">DETAILS</v-tab>
        <v-tab value="two" class="font-weight-medium">EDIT</v-tab>
        <v-tab value="three" class="font-weight-medium">REVISION</v-tab>
      </v-tabs>
      <v-window v-if="!formDetails.isModalLoading" v-model="formModalTab">
        <v-window-item value="one">
          <div class="ps-5 pe-5">
            <small class="text-caption text-lightText">{{ formDetails.content.formCode }}</small><br>
            <label for="" class="h3 text-success">{{ formDetails.content.formName }}</label>
            <br>
            <iframe v-if="formDetails.link" :src="`${formDetails.link}#toolbar=0&navpanes=0`"
              class="full-screen-iframe mt-3" frameborder="0" @contextmenu.prevent></iframe>
          </div>
        </v-window-item>
        <v-window-item value="two">

        </v-window-item>
        <v-window-item value="three">

        </v-window-item>
      </v-window>
      <template v-else>
        <div class="d-flex flex-column justify-center align-center pa-5">
          <img src="@/assets/images/loading.gif" alt="Loading" />
          <p class="h3 text-success font-weight-bold mt-3">LOADING...</p>
        </div>
      </template>
    </v-card>
  </v-dialog>
</template>
<style>
.full-screen-iframe {
  width: 100%;
  height: 100vh;
  border: none;
}
</style>

<script>
export default {
  name: 'FormModalView',
  data() {
    return {
      formModalTab: null,
    }
  },
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    formDetails: Object,
  },
  emits: ['update:modelValue'],
  methods: {
    formModalClose() {
      this.$emit('update:modelValue', false);
      this.formDetails.isModalLoading = true
    },
  },
};
</script>
