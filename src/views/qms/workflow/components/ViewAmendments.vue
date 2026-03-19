<template>
    <v-card variant="outlined" elevation="0" class="bg-surface mb-5" rounded="lg">
        <v-card-item>
            <div class="d-flex justify-space-between align-center">
                <v-card-title class="text-h4">VIEW AMENDMENTS</v-card-title>
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

            </template>
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
    <v-row v-if="!contentLoading">
        <v-col>
            <v-label>ORIGINAL FILE</v-label>
            <iframe v-if="amendmentData" :src="`${amendmentData.originalFile}#toolbar=0&navpanes=0`"
                class=" full-screen-iframe" frameborder="0" @contextmenu.prevent></iframe>
        </v-col>
        <v-col>
            <v-label>AMENDMENT FILE</v-label>
            <iframe v-if="amendmentData" :src="`${amendmentData.amendmentFile}#toolbar=0&navpanes=0`"
                class=" full-screen-iframe" frameborder="0" @contextmenu.prevent></iframe>
        </v-col>
    </v-row>

    <!-- Loader -->
    <v-overlay :model-value="formLoader" class="align-center justify-center" persistent>
        <v-card>
            <div class="d-flex flex-column justify-center align-center pa-5">
                <img src="@/assets/images/loading.gif" alt="Loading" />
                <p class="h3 text-primary font-weight-bold mt-3">LOADING...</p>
            </div>
        </v-card>
    </v-overlay>
</template>
<style scoped>
.full-screen-container {
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
    overflow: hidden;
    /* Prevent scrollbars */
}

.full-screen-iframe {
    width: 100%;
    height: 100vh;
    border: none;
    /* Remove iframe border */
}

.interaction-group {
    display: flex;
    /*  justify-content: space-between; */
    /*   padding: 10px; */
}

ion-button span {
    margin-left: 5px;
    font-size: 16px;
}
</style>
<script>
import { GeneralController } from '@/stores/GeneralController';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'DepartmentHeadView',
    data() {
        return {
            contentLoading: true,
            formLoader: false,
            amendmentData: [],





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
    mounted() {
        this.retrieveAmendment()
    },
    methods: {
        async retrieveAmendment() {
            const data = this.$route.params.data
            const response = await GeneralController.retrieveData('amendment/retrieve', { data: data }, 'data')
            this.contentLoading = false
            this.amendmentData = response
            console.log(response)
        },
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