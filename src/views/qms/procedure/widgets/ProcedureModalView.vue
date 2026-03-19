<template>
  <v-dialog :model-value="modelValue" @update:model-value="emitClose" max-width="800">
    <v-card>
      <v-card-title class="text-h5 d-flex align-center">
        VERSION DETAILS
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="emitClose">Close</v-btn>
      </v-card-title>

      <div class="ps-5 pe-5">
        <small class="text-caption text-lightText">VERSION</small><br>
        <label for="" class="h3">Version {{ versionDetails.version }}</label>
        <br>
        <label for="" class="text-subtitle-1 mb-0">{{ versionDetails.description }}</label><br>
        <div class="d-flex justify-space-between align-center mb-4">
          <div class="uploader">
            <small class="text-caption text-lightText">UPLOADED BY:</small> <br>
            <label for="" class="text-subtitle-1 mb-0">{{ versionDetails.uploadedBy }}</label>
          </div>
          <div class="date">
            <small class="text-caption text-lightText">UPLOADED DATE:</small> <br>
            <label for="" class="text-subtitle-1 mb-0">{{ versionDetails.uploadedDate }}</label>
          </div>
        </div>

        <iframe v-if="versionLink" :src="`${versionLink}#toolbar=0&navpanes=0`" class=" full-screen-iframe"
          frameborder="0" @contextmenu.prevent></iframe>
      </div>

    </v-card>
  </v-dialog>
</template>
<style>
.full-screen-iframe {
  width: 100%;
  height: 100vh;
  border: none;
  /* Remove iframe border */
}
</style>
<script>
export default {
  name: 'ProcedureModalView',
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    versionDetails: Object,
    versionLink: String
  },
  emits: ['update:modelValue'],
  methods: {
    emitClose() {
      this.$emit('update:modelValue', false);
    },
  },
};
</script>
