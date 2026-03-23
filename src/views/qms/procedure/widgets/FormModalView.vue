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
          <v-container>
            <v-alert v-if="errorMessages != null" type="error" colored-border elevation="2" dismissible>
              An error occurred while saving your data. <br>
              <small color="error">{{ errorMessages }}</small>
            </v-alert>
            <label for="ADD" class="text-subtitle-1 text-success text-h3">UPDATE FORMS DETAILS</label>
            <template v-if="formLoader">
              <div class="d-flex flex-column justify-center align-center pa-5">
                <img src="@/assets/images/formLoader.gif" alt="Loading" />
                <p class="h3 text-primary font-weight-bold mt-3">LOADING...</p>
              </div>
            </template>
            <v-form v-else @submit.prevent="updateForm" class="mt-4">
              <v-row dense>
                <!-- Form Code -->
                <v-col cols="12">
                  <v-text-field v-model="formData.formCode" label="FORM CODE*" placeholder="e.g. ADM-001"
                    variant="outlined" density="comfortable" color="success" required hide-details="auto"
                    class="mb-4"></v-text-field>
                </v-col>
                <!-- Form Name -->
                <v-col cols="12">
                  <v-text-field v-model="formData.formName" label="FORM NAME*" placeholder="Enter form name"
                    variant="outlined" density="comfortable" color="success" required hide-details="auto"
                    class="mb-4"></v-text-field>
                </v-col>
                <!-- Form Status -->
                <v-col cols="12">
                  <v-select v-model="formData.formStatus" label="FORM STATUS*" :items="[
                    { title: 'GENERAL FORMS', value: 1 },
                    { title: 'DEPARTMENTAL FORMS', value: 0 }
                  ]" :value="formData.formStatus" variant="outlined" density="comfortable" color="success"
                    :error="!!errors['status']" :error-messages="errors['status']" hide-details="auto" required
                    class="mb-4"></v-select>
                </v-col>

                <!-- Retention Period -->
                <v-col cols="12">
                  <v-select v-model="formData.formRetention" label="Retention Period*" :items="[
                    { title: 'Permanent', value: 'Permanent' },
                    { title: '1 Year', value: '1 Year' },
                    { title: '2 Years', value: '2 Years' },
                    { title: '3 Years', value: '3 Years' },
                    { title: '4 Years', value: '4 Years' },
                    { title: '5 Years', value: '5 Years' },
                    { title: 'Until Superseded', value: 'Until Superseded' }
                  ]" variant="outlined" density="comfortable" color="success" hide-details="auto" required
                    class="mb-4"></v-select>
                </v-col>

                <!-- Action Buttons -->
                <v-col cols="12" class="pt-4 d-flex justify-end">
                  <v-btn variant="text" color="grey-darken-1" class="mr-2">Cancel</v-btn>
                  <v-btn color="success" type="submit" elevation="1" size="large">
                    Submit Form
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-container>

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
      errorMessages: null,
      formLoader: false,
      errors: []
    }
  },
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    formDetails: Object,
    formData: Object
  },
  emits: ['update:modelValue', 'update'],
  methods: {
    formModalClose() {
      this.$emit('update:modelValue', false);
      this.formDetails.isModalLoading = true
      this.formLoader = false
    },
    updateForm() {
      const formData = new FormData();
      this.formLoader = true;
      this.errorMessages = null;
      for (let key in this.formData) {
        formData.append(key, this.formData[key]);
      }
      console.log(this.formData)
      this.$emit('update', formData);
      // this.$emit('update:modelValue', false);
    }
  },
};
</script>
