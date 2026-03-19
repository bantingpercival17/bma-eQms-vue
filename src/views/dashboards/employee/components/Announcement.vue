<template>
    <div class="announcements-section mt-5">
        <div class="d-flex justify-space-between align-center mb-4">
            <h2 class="text-primary">Announcements</h2>
            <v-btn color="primary" @click="showModal = true">Create Announcement</v-btn>
        </div>
        <v-alert v-if="showAlert" :type="alertType" class="my-4" border="start" prominent elevation="2" closable
            @click:close="showAlert = false">
            Successfully Removed
        </v-alert>
        <template v-if="isLoading">
            <div class="d-flex flex-column justify-center align-center pa-5">
                <img src="@/assets/images/loading.gif" alt="Loading" />
                <p class="h3 text-primary font-weight-bold mt-3">LOADING...</p>
            </div>
        </template>
        <div v-else class="announcements-list" v-for="(value, index) in announcementPost" :key="value.id">
            <AnnouncementPost :post="value" :departments="departments" @edit="updateAnnouncement"
                @delete="deleteAnnouncement" />
        </div>

        <!-- Modal -->
        <v-dialog v-model="showModal" max-width="700px">
            <v-card>
                <v-toolbar flat color="success" dark>
                    <v-toolbar-title>Create Announcement</v-toolbar-title>
                    <v-spacer />
                    <v-btn icon @click="showModal = false">x</v-btn>
                </v-toolbar>

                <div v-if="!formLoader">
                    <v-card-text>
                        <v-text-field label="Title" v-model="form.title" />
                        <v-textarea label="Content" v-model="form.content" />

                        <v-select v-model="form.department" :items="departments" label="Department" item-value="id"
                            item-title="name" />

                        <v-file-input v-model="form.attachments" label="Attachments" multiple show-size
                            accept=".pdf,.doc,.docx,.jpg,.png" prepend-icon="mdi-paperclip" />
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn text @click="showModal = false">Cancel</v-btn>
                        <v-btn color="primary" @click="submitForm">Submit</v-btn>
                    </v-card-actions>
                </div>
                <div v-else>
                    <div class="d-flex flex-column justify-center align-center pa-5">
                        <img src="@/assets/images/formLoader.gif" alt="Loading" />
                        <p class="h3 text-primary font-weight-bold mt-3">LOADING...</p>
                    </div>
                </div>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import { defineComponent } from 'vue';
import AnnouncementPost from '../widgets/AnnouncementPost.vue';
import { GeneralController } from '@/stores/GeneralController';

export default defineComponent({
    name: 'AnnoucementComponent',
    data() {
        return {
            isLoading: true,
            showModal: false,
            form: {
                title: '',
                content: '',
                department: null,
                attachments: []
            },
            formLoader: false,
            departments: [],
            announcementPost: [],
            showAlert: false,
            alertMessage: '',
            alertType: 'success'
        }
    },
    components: {
        AnnouncementPost
    },
    async mounted() {
        this.fetchData()
    },
    methods: {
        async fetchData() {
            const response = await GeneralController.retrieveData('announcement/retrieve-data', { search: '' }, 'data')
            if (response) {
                this.announcementPost = response.announcements
                this.departments = [
                    {
                        id: null,
                        name: 'All Department'
                    },
                    ...response.departments
                ];
                this.isLoading = false
            }
        },
        async submitForm() {
            try {
                this.isLoading = true
                const formData = new FormData()
                formData.append('title', this.form.title)
                formData.append('content', this.form.content)
                formData.append('department', this.form.department)

                if (this.form.attachments && this.form.attachments.length > 0) {
                    this.form.attachments.forEach((file, index) => {
                        formData.append(`file[]`, file)
                    })
                }
                // Send to your backend API (adjust the controller/route)
                await GeneralController.storeItem('announcement/create-announcement', formData)
                // Refresh data or add manually to the list
                this.fetchData()
                this.showModal = false
                this.resetForm()
            } catch (error) {
                console.error('Submission failed:', error)
            }
        },
        resetForm() {
            this.form = {
                title: '',
                content: '',
                department: null,
                attachments: []
            }
        },
        async updateAnnouncement(payload) {
            this.isLoading = true
            const formData = new FormData();
            formData.append('announcement', payload.id)
            formData.append('title', payload.title);
            formData.append('content', payload.content);
            formData.append('department', payload.department_id);
            payload.files.forEach(file => formData.append('file[]', file));
            const response = await GeneralController.storeItem('announcement/update-announcement', formData)

            console.log(response)
            this.fetchData()
            // Log activity here if needed
        },
        async deleteAnnouncement(id) {
            this.isLoading = true
            const formData = new FormData()
            formData.append('announcement', id)
            const response = await GeneralController.removeItem('announcement/remove-announcement', formData)
            console.log(response)
            if (response.ok) {
                this.showAlert = true
                this.fetchData()
            }
            this.isLoading = false
            //await axios.delete(`/api/announcements/${id}`);
        }
    }
})
</script>