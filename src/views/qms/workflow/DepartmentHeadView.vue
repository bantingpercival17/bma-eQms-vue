<template>
    <v-card variant="outlined" elevation="0" class="bg-surface mb-5" rounded="lg">
        <v-card-item>
            <div class="d-flex justify-space-between align-center">
                <v-card-title class="text-h4">AMENDMENTS</v-card-title>

                <v-btn color="primary" to="/qms/approval-workflow/create">CREATE AMENDMENTS</v-btn>
            </div>
        </v-card-item>
        <v-divider></v-divider>
        <v-card-text class="pa-0">
            <v-tabs v-model="tab" color="success" class="px-6">
                <v-tab value="one" class="font-weight-medium">DRAFT</v-tab>
                <v-tab value="two" class="font-weight-medium">SUBMISSIONS</v-tab>
                <v-tab v-if="userRole === 6" value="three" class="font-weight-medium">PENDING APPROVAL</v-tab>
            </v-tabs>
            <template v-if="contentLoading">
                <div class="d-flex justify-center align-center pa-5">
                    <img src="@/assets/images/loading.gif" alt="Loading" />
                </div>

            </template>
            <template v-else>
                <v-window v-model="tab">
                    <v-window-item value="one">
                        <AmendmentTableList :data="draftAmendments" :headers="draftHeader" @view="draftView"
                            @remove="draftRemove" @submit="draftSubmit" />
                    </v-window-item>
                    <v-window-item value="two">
                        <AmendmentTableList :data="submissionAmendments" :headers="headers" @view="onView"
                            @removed="onDelete" />
                    </v-window-item>
                    <v-window-item value="three">
                        <QMRView :amendmentList="verificationAmendments" />
                    </v-window-item>
                </v-window>
            </template>

        </v-card-text>
    </v-card>
    <v-overlay :model-value="formLoader" class="align-center justify-center" persistent>
        <v-card>
            <div class="d-flex flex-column justify-center align-center pa-5">
                <img src="@/assets/images/loading.gif" alt="Loading" />
                <p class="h3 text-primary font-weight-bold mt-3">LOADING...</p>
            </div>
        </v-card>

        <!-- <v-progress-circular indeterminate size="64" color="primary" /> -->
    </v-overlay>
    <v-dialog v-model="confirmDialog" persistent max-width="400">
        <v-card>
            <v-card-title class="text-h6">{{ dialogDetails.title }}</v-card-title>
            <v-card-text>{{ dialogDetails.message }}</v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="confirmDialog = false">Close</v-btn>
                <v-btn v-if="dialogDetails.actionBtn" color="primary" @click="dialogDetails.action">Confirm</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import CardHeader from '@/components/shared/CardHeader.vue';
import { defineComponent } from 'vue';
import AmendmentTableList from './components/AmendmentTableList.vue';
import { GeneralController } from '@/stores/GeneralController';
import { useAuthStore } from '@/stores/auth';
import QMRView from './QMRView.vue';
export default defineComponent({
    name: 'DepartmentHeadView',
    components: {
        CardHeader, AmendmentTableList, QMRView
    },
    data() {
        const headers = [
            { title: 'Status', key: 'status', align: 'start' },
            { title: 'Amendment Control', key: 'amendmentControl', align: 'start' },
            { title: 'Procedure / Forms Name', key: 'name', align: 'start' },
            { title: 'Category', key: 'reference', align: 'start' },
            //{ title: 'Description of Changes', key: 'descriptionOfChanges', align: 'start' },
            { title: 'Submission Date', key: 'submittedData', align: 'start' },
        ];
        const draftHeader = [
            { title: 'Procedure / Forms Name', key: 'name', align: 'start' },
            { title: 'Category', key: 'reference', align: 'start' },
            { title: 'Description of Changes', key: 'descriptionOfChanges', align: 'start' },
            { title: 'Date Created', key: 'createdAt', align: 'start' },
            { title: 'Actions', key: 'draftAction', align: 'center', sortable: false },
        ];

        return {
            contentLoading: false,
            headers,
            draftHeader,
            tab: null,
            draftAmendments: [],
            submissionAmendments: [],
            verificationAmendments: [],
            confirmDialog: false,
            formLoader: false,
            dialogDetails: {
                title: '',
                message: '',
                action: [],
                actionBtn: false
            },
            userRole: null
        }
    }, methods: {
        async retrieveAmendments() {
            const creator = this.userRole === 6 ? 'level 1' : 'creator'
            return await GeneralController.retrieveData('amendment/list-of-amendments', { userType: creator }, 'list')
        },
        onView(id) {
            alert('View form:', id)
        },
        onEdit(id) {
            alert('Edit form:', id)
        },
        onDelete(id) {
            alert('Delete form:', id)
        },
        draftView(data) {
            console.log('View form:', data)
        },
        draftSubmit(data) {
            this.confirmDialog = true
            this.dialogDetails.title = 'Confirmation of Submission'
            this.dialogDetails.message = 'Do you want to submit your Amendment for this Procedure / Forms?'
            this.dialogDetails.action = () => this.submitAmendment(data)  // wrapped in arrow function
            this.dialogDetails.actionBtn = true
        },
        draftRemove(data) {
            alert('Remove form:', id)
        },
        async submitAmendment(data) {
            this.confirmDialog = false
            this.formLoader = true;
            const formData = new FormData()
            formData.append('id', data)
            const submit = await GeneralController.storeItem('amendment/submission', formData)
            console.log(data)
            const response = await this.retrieveAmendments();
            this.draftAmendments = response.draftList
            this.submissionAmendments = response.submissionList
            this.formLoader = false;
            this.confirmDialog = true
            this.dialogDetails = {
                title: 'Amendment Submission',
                message: 'Successfully Submitted',
                actionBtn: false
            }
        },

    },
    async mounted() {
        const authStore = useAuthStore();
        this.userRole = authStore.user?.roleID
        const response = await this.retrieveAmendments();
        this.draftAmendments = response.draftList
        this.submissionAmendments = response.submissionList
        if (this.userRole === 6) {
            this.tab = 'three'
            this.verificationAmendments = response.verificationList
        }
        // Access role directly
        console.log(authStore.user?.roleID); // "Administrator"

    }
})
</script>