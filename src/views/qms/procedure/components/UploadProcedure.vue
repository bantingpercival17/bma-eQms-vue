<template>
    <div class="">
        <v-alert v-if="alertSuccess" type="success" dismissible>
            Upload Successfully!
        </v-alert>
        <v-alert v-if="alertError" type="error" colored-border elevation="2" dismissible>
            An error occurred while saving your data.
            <small color="error">{{ errorMessages }}</small>
        </v-alert>
        <div v-if="formLoader">
            <div class="d-flex flex-column justify-center align-center pa-5">
                <img src="@/assets/images/formLoader.gif" alt="Loading" />
                <p class="h3 text-primary font-weight-bold mt-3">LOADING...</p>
            </div>
        </div>
        <div v-else>
            <v-tabs v-model="subTab" color="success">
                <v-tab value="one" class="font-weight-medium">LIST OF VERSION</v-tab>
                <v-tab value="two" class="font-weight-medium">UPLOAD REVISION</v-tab>
            </v-tabs>
            <v-window v-model="subTab">
                <v-window-item value="one">
                    <div class="versionList">
                        <div v-if="versionFiles.length > 0" class="form-list-container">
                            <v-list border class="" aria-busy="true" aria-label="project list">
                                <v-list-item class="py-2 px-4" v-for="(item, index) in versionFiles" :key="index"
                                    @click="openModal(encrypt(item.id))" :value="item.id" rounded="md">
                                    <h4 class="text-subtitle-1 mb-0">Version {{ item.version }}</h4>
                                    <span class="text-caption text-lightText">{{ item.description
                                        }}</span><br>
                                    <span class="text-caption text-lightText">Updated By: {{ item.uploadedBy
                                    }}</span><br>
                                    <span class="text-caption text-lightText">Updated Date: {{ item.uploadedDate
                                    }}</span>
                                </v-list-item>
                            </v-list>
                        </div>
                        <div v-else>
                            <v-list border class="" aria-busy="true" aria-label="project list">
                                <v-list-item class="py-2 px-4">
                                    <span class="text-body-1">No Procedure File Found</span><br>
                                </v-list-item>
                            </v-list>
                        </div>
                    </div>
                    <ProcedureModalView v-if="selectedVersion" v-model="showModal" :versionDetails="selectedVersion"
                        :versionLink="link" />
                </v-window-item>
                <v-window-item value="two" class="ps-5 pe-5 pt-4">
                    <form @submit.prevent="uploadFiles" class="mb-5">
                        <v-label class="text-default">Upload Revision File</v-label>
                        <!-- File Input with error display -->
                        <v-file-input v-model="selectedFile" label="Attach PDF file" accept=".pdf" show-size
                            :error="!!fileError" :error-messages="fileError"></v-file-input>
                        <!-- Textarea -->
                        <v-textarea label="Revision Details" v-model="description" clearable></v-textarea>
                        <!-- Upload Button -->
                        <v-btn type="submit" color="primary" class=" mb-4">
                            Upload
                        </v-btn>
                    </form>
                </v-window-item>
            </v-window>
        </div>
    </div>
</template>

<script>
import { GeneralController } from '@/stores/GeneralController';
import { defineComponent } from 'vue';
import ProcedureModalView from '../widgets/ProcedureModalView.vue';

export default defineComponent({
    name: 'UploadProcedure',
    components: {
        ProcedureModalView
    },
    data() {
        return {
            subTab: null,
            formLoader: false,
            selectedFile: null,
            description: '',
            fileError: '', // <-- Error message for PDF input
            alertSuccess: false,
            alertError: false,
            errorMessages: '',
            versionFiles: [],
            showModal: false,
            selectedVersion: '',
            link: null
        };
    },
    methods: {
        async uploadFiles() {
            this.clearAlert()
            this.versionFiles = [];
            if (!this.selectedFile) {
                this.fileError = 'Please select a PDF file to upload.';
                return;
            }

            if (this.selectedFile.type !== 'application/pdf') {
                this.fileError = 'Only PDF files are allowed.';
                return;
            }
            this.formLoader = true
            const formData = new FormData();
            formData.append('file', this.selectedFile);
            formData.append('description', this.description);
            formData.append('procedure', this.procedure)
            console.log(formData)
            await GeneralController.storeItemFiles('procedure/store/file', formData)
                .then(async response => {
                    this.formLoader = false
                    this.alertSuccess = true
                    this.versionFiles = await this.versionList()
                    this.description = ''
                    this.fileError = ''
                }).catch(error => {
                    this.formLoader = false
                    this.alertError = true
                    this.errorMessages = error.statusText
                })
        },
        async versionList() {
            return await GeneralController.retrieveData('procedure/retrieve/file-list', { procedure: this.procedure }, 'versionList');

        },
        async openModal(version) {
            this.showModal = true;
            console.log("View Version:" + version)
            this.selectedVersion = await GeneralController.retrieveData('procedure/retrieve/version/details', { version: version }, 'version');
            this.loadFile(version)
        },
        encrypt(data) {
            return btoa(data)
        },
        async loadFile(data) {
            this.error = null;
            try {
                const response = await GeneralController.retrieveFile({ version: data }, 'procedure/retrieve/version/view');
                const blob = new Blob([response], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                this.link = url;

            } catch (error) {
                console.error(error);
                this.error = 'Unable to load PDF. Check the password or PDF file.';
                this.errorMessage = error.message;
            }
        },
        clearAlert() {
            this.alertSuccess = false
            this.alertError = false
            this.fileError = ''; // Clear previous error
        }

    },
    async mounted() {
        this.versionFiles = await this.versionList()
    },
    props: {
        procedure: {
            type: String,
            required: true,
        },
    },
});
</script>
