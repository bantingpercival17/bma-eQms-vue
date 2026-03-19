<template>
    <v-card variant="outlined" elevation="0" class="bg-surface mb-5" rounded="lg">
        <v-card-item>
            <div class="d-flex justify-space-between align-center">
                <v-card-title class="text-h4">CREATE AMENDMENTS</v-card-title>
            </div>
        </v-card-item>
        <v-divider></v-divider>
        <v-card-text class="pa-5">
            <template v-if="contentLoading">
                <div class="d-flex justify-center align-center pa-5">
                    <img src="@/assets/images/loading.gif" alt="Loading" />
                </div>
            </template>

            <template v-else>
                <!-- Alerts -->
                <v-alert v-if="alertMessage" :type="alertType" class="mb-4" closable @click:close="alertMessage = ''">
                    {{ alertMessage }}
                </v-alert>

                <!-- Form -->
                <form @submit.prevent="confirmDialog = true" class="mb-5">
                    <v-select v-model="category" :items="categoryOption" label="CATEGORY" outlined class="mr-2"
                        @update:modelValue="categoryData" />
                    <v-select v-model="value" :items="titleOption" item-title="name" item-value="id"
                        label="PROCEDURE / FORM NAME" outlined class="mr-2" />
                    <v-label class="text-default">Upload Revision File</v-label>
                    <v-file-input v-model="selectedFile" label="Attach PDF file" accept=".pdf" show-size
                        :error="!!fileError" :error-messages="fileError"></v-file-input>
                    <v-textarea label="Revision Details" v-model="description" clearable></v-textarea>
                    <v-btn type="submit" color="primary" class="mb-4">Upload</v-btn>
                </form>
            </template>

            <!-- Loader -->
            <v-overlay :model-value="formLoader" class="align-center justify-center" persistent>
                <v-progress-circular indeterminate size="64" color="primary" />
            </v-overlay>

            <!-- Confirmation Dialog -->
            <v-dialog v-model="confirmDialog" persistent max-width="400">
                <v-card>
                    <v-card-title class="text-h6">Confirm Upload</v-card-title>
                    <v-card-text>Are you sure you want to submit this amendment?</v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text @click="confirmDialog = false">Cancel</v-btn>
                        <v-btn color="primary" @click="submitUpload">Confirm</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-card-text>
    </v-card>
</template>

<script>
import { GeneralController } from '@/stores/GeneralController';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'DepartmentHeadView',
    data() {
        return {
            contentLoading: false,
            formLoader: false,
            selectedFile: null,
            description: '',
            fileError: '',
            categoryOption: ['Procedure', 'Forms'],
            titleOption: [],
            category: '',
            value: '',
            confirmDialog: false,
            alertMessage: '',
            alertType: '', // 'success' or 'error'
        };
    },
    methods: {
        async categoryData() {
            this.value = '';
            this.titleOption = [];
            this.titleOption = await GeneralController.retrieveData(
                'amendment/categories',
                { search: this.category },
                'data'
            );
        },
        async submitUpload() {
            this.confirmDialog = false;
            this.fileError = '';
            if (!this.selectedFile) {
                this.fileError = 'Please select a PDF file to upload.';
                return;
            }
            if (this.selectedFile.type !== 'application/pdf') {
                this.fileError = 'Only PDF files are allowed.';
                return;
            }
            this.formLoader = true;
            const formData = new FormData();
            formData.append('file', this.selectedFile);
            formData.append('description', this.description);
            formData.append('category', this.category);
            formData.append('value', this.value);
            try {
                const response = await GeneralController.storeItem('amendment/create', formData);
                if (response.ok) {
                    this.alertMessage = 'Amendment uploaded successfully!';
                    this.alertType = 'success';
                    setTimeout(() => {
                        this.$router.push('/qms/approval-workflow'); // change to your desired route
                    }, 1500);
                } else {
                    this.alertMessage = 'Upload failed. Please try again.';
                    this.alertType = 'error';
                }
            } catch (err) {
                this.alertMessage = 'An unexpected error occurred.';
                this.alertType = 'error';
            } finally {
                this.formLoader = false;
            }
        },
    },
});
</script>
