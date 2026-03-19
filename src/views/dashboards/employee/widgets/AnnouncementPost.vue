<template>
    <v-card :class="margin" variant="outlined" elevation="0" class="bg-surface" rounded="lg">
        <!-- Header Section -->
        <v-card-text class="pa-4">
            <div class="d-flex ga-4 justify-space-between align-center">
                <div class="d-flex ga-4 align-center">
                    <v-avatar size="70" class="rounded-md" alt="avatar" :image="post.creator.profile" />
                    <div>
                        <h5 class="text-h5">{{ post.creator.name }}</h5>
                        <small>{{ post.created_at }}</small>
                    </div>
                </div>
                <div v-if="post.owner">
                    <v-btn icon @click="openEdit">✏️</v-btn>
                    <v-btn icon @click="confirmDeleteDialog = true">🗑️</v-btn>
                </div>
            </div>
        </v-card-text>

        <!-- Content -->
        <v-card-text class="pt-0">
            <v-label class="text-h5 bolder text-success">{{ post.title }}</v-label><br>
            {{ post.content }}
        </v-card-text>

        <!-- Attachments -->
        <v-card-text v-if="post.files && post.files.length" class="pt-2">
            <div class="text-subtitle-2 font-weight-medium mb-2">Attachments:</div>
            <div class="d-flex flex-wrap">
                <template v-for="(file, index) in post.files" :key="index">
                    <div @click="openViewer(file)" class="d-flex flex-column  mr-3 mb-2" style="cursor: pointer;">
                        <svg v-if="isPDF(file)" width="64" height="64" viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 2C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2H6Z"
                                fill="#D32F2F" />
                            <path d="M14 2V8H20" fill="#B71C1C" />
                            <text x="7" y="15" font-family="Arial" font-size="5" fill="white"
                                font-weight="bold">PDF</text>
                        </svg>
                        <svg v-else-if="isImage(file)" width="64" height="64" viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 2C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2H6Z"
                                fill="#4A90E2" />
                            <path d="M14 2V8H20" fill="#3A7BD5" />
                            <rect x="6.5" y="11" width="11" height="6.5" rx="1" fill="white" />
                            <path d="M7.5 16L10 13L12.5 16H7.5Z" fill="#4A90E2" />
                            <circle cx="12.5" cy="13.5" r="0.7" fill="#4A90E2" />
                            <text x="7" y="10" font-family="Arial" font-size="5" font-weight="bold"
                                fill="white">IMG</text>
                        </svg>
                        <small>{{ file.filename }}</small>
                    </div>
                </template>
            </div>
        </v-card-text>

        <!-- File Viewer Dialog -->
        <v-dialog v-model="showViewer" width="800">
            <v-card>
                <v-toolbar flat>
                    <v-toolbar-title>File Viewer</v-toolbar-title>
                    <v-spacer />
                    <v-btn icon @click="showViewer = false">x</v-btn>
                </v-toolbar>
                <iframe v-if="selectedFile" :src="`${selectedFile.link}#toolbar=0`" class="full-screen-iframe"
                    frameborder="0" @contextmenu.prevent></iframe>
            </v-card>
        </v-dialog>

        <!-- Edit Dialog -->
        <v-dialog v-model="editDialog" max-width="600">
            <v-card>
                <v-toolbar flat color="primary" dark>
                    <v-toolbar-title>Edit Announcement</v-toolbar-title>
                    <v-spacer />
                    <v-btn icon @click="editDialog = false">x</v-btn>
                </v-toolbar>

                <v-card-text>
                    <v-text-field label="Title" v-model="updatedTitle" outlined dense />
                    <v-textarea label="Content" v-model="updatedContent" outlined dense />
                    <v-file-input v-model="updatedFiles" multiple show-size label="Upload New Files"
                        prepend-icon="mdi-paperclip" accept=".pdf,image/*" />
                    <v-select v-model="updatedDepartment" :items="departments" item-title="name" item-value="id"
                        label="Select Department" outlined />
                </v-card-text>

                <v-card-actions>
                    <v-spacer />
                    <v-btn color="success" @click="confirmUpdateDialog = true">Save</v-btn>
                    <v-btn color="grey" @click="editDialog = false">Cancel</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Confirm Update Dialog -->
        <v-dialog v-model="confirmUpdateDialog" max-width="400">
            <v-card>
                <v-card-title class="headline">Confirm Update</v-card-title>
                <v-card-text>Are you sure you want to update this announcement?</v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="green" @click="saveEdit">Yes</v-btn>
                    <v-btn text @click="confirmUpdateDialog = false">Cancel</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Confirm Delete Dialog -->
        <v-dialog v-model="confirmDeleteDialog" max-width="400">
            <v-card>
                <v-card-title class="headline">Confirm Deletion</v-card-title>
                <v-card-text>Are you sure you want to delete this announcement?</v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="red" @click="confirmDelete">Yes</v-btn>
                    <v-btn text @click="confirmDeleteDialog = false">Cancel</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script>
export default {
    name: 'AnnouncementPost',
    props: {
        post: Object,
        departments: { type: Array, default: () => [] }
    },
    data() {
        return {
            margin: "mt-5",
            showViewer: false,
            selectedFile: null,
            editDialog: false,
            confirmUpdateDialog: false,
            confirmDeleteDialog: false,
            updatedTitle: '',
            updatedContent: '',
            updatedFiles: [],
            updatedDepartment: null
        };
    },
    methods: {
        isImage(file) {
            return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file.link);
        },
        isPDF(file) {
            return /\.pdf$/i.test(file.link);
        },
        openViewer(file) {
            this.selectedFile = file;
            this.showViewer = true;
        },
        openEdit() {
            this.updatedTitle = this.post.title;
            this.updatedContent = this.post.content;
            this.updatedDepartment = this.post.department_id || null;
            this.updatedFiles = [];
            this.editDialog = true;
        },
        saveEdit() {
            this.$emit('edit', {
                id: this.post.id,
                title: this.updatedTitle,
                content: this.updatedContent,
                department_id: this.updatedDepartment,
                files: this.updatedFiles
            });
            this.confirmUpdateDialog = false;
            this.editDialog = false;
        },
        confirmDelete() {
            this.$emit('delete', this.post.id);
            this.confirmDeleteDialog = false;
        }
    }
}
</script>

<style scoped>
.full-screen-iframe {
    width: 100%;
    height: 100vh;
    border: none;
}
</style>
