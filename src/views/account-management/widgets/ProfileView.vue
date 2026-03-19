<template>
  <v-dialog :model-value="modelValue" @update:model-value="formModalClose" max-width="800">
    <v-card class="pa-5">
      <v-card-title class="text-h5 d-flex align-center text-success">
        ACCOUNT INFORMATION
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="formModalClose">Close</v-btn>
      </v-card-title>
      <v-tabs v-model="modalTab" color="success" class="mb-3">
        <v-tab value="one" class="font-weight-medium">PROFILE</v-tab>
        <v-tab value="two" class="font-weight-medium">ACCOUNT</v-tab>
      </v-tabs>
      <v-window v-if="!content.isModalLoading" v-model="modalTab">
        <v-window-item value="one">
          <v-row>
            <v-col cols="4">
              <!-- Profile Picture-->
              <CardHeader title="Profile Picture">
                <div class="d-flex flex-column justify-center align-center">
                  <v-avatar size="100" :image="content.profile.image" rounded="md" />
                </div>
                <br>
                <!-- Hidden file input -->
                <v-file-input ref="fileInput" v-model="selectedFile" accept="image/*" label="Upload Profile Picture"
                  style="display: none" @change="handleFile" :error="!!fileError"
                  :error-messages="fileError"></v-file-input>

                <!-- Button to trigger file input -->
                <v-btn color="primary" @click="triggerFileInput('profile')">
                  Upload Profile Picture
                </v-btn>
              </CardHeader>
            </v-col>
            <v-col>
              <!-- Details -->
              <CardHeader title="Employee Details" class="overflow-hidden">
                <v-avatar size="100" :image="content.profile.image" rounded="md" />
              </CardHeader>
            </v-col>
          </v-row>
        </v-window-item>
        <v-window-item value="two">

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
import CardHeader from '@/components/shared/CardHeader.vue'
import { GeneralController } from '@/stores/GeneralController';

export default {
  name: 'ProfileView',
  components: {
    CardHeader
  },
  data() {
    return {
      modalTab: null,
      selectedFile: null,
      fileError: '',
      type: null
    }
  },
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    content: Object,
  },
  emits: ['update:modelValue'],
  methods: {
    formModalClose() {
      this.$emit('update:modelValue', false);
      this.content.isModalLoading = true
    },
    triggerFileInput(data) {
      this.$refs.fileInput.click();
      this.type = data
    },
    async handleFile() {
      this.fileError = '';
      this.content.isModalLoading = true
      if (this.selectedFile && this.selectedFile.type.startsWith('image/')) {
        const formData = new FormData();
        formData.append('account', this.content.profile.id)
        formData.append('file', this.selectedFile)
        formData.append('type', this.type)
        const response = await GeneralController.storeItem('account/upload-image', formData)
        console.log(response)
        if (response.ok) {
          this.content.isModalLoading = false
        }
        /*    const reader = new FileReader();
           reader.onload = (e) => {
             this.previewUrl = e.target.result;
           };
           reader.readAsDataURL(this.selectedFile); */
      } else {
        this.fileError = 'Please select a valid image file';
        this.previewUrl = null;
      }
    },
  },
};
</script>
