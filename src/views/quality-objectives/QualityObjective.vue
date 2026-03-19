<template>
    <v-card variant="outlined" elevation="0" class="bg-surface mb-5" rounded="lg">
        <v-card-item>
            <div class="d-flex justify-space-between align-center">
                <v-card-title class="text-h4">Quality Objective</v-card-title>

                <v-btn color="primary" @click="academicModal.show = true">New Quality Objective</v-btn>
            </div>
        </v-card-item>
        <v-divider></v-divider>
        <v-card-text class="pa-0">
            <template v-if="contentLoading">
                <div class="d-flex justify-center align-center pa-5">
                    <img src="@/assets/images/loading.gif" alt="Loading" />
                </div>
            </template>
            <template v-else>

                <template v-if="userRole == 2">
                    <QualityObjectiveList :data="qualityObjectiveList" :headers="departmentHeader" @view="onView"
                        @removed="onRemoved" @submit="onSubmit" :role="userRole" />
                    <!--  <RiskTableList :data="riskAssessmentsList" :headers="headers(2)" @view="onView" @removed="onDelete"
                        @edit="onEdit" @submit="onSubmit" :role="userRole" /> -->
                </template>
                <template v-else>
                    <v-window v-model="tab">
                        <v-tabs v-model="tab" color="success" class="px-6">
                            <v-tab value="one" class="font-weight-medium">MY RISKS</v-tab>
                            <v-tab v-if="userRole != 6" value="two" class="font-weight-medium">SUBMISSIONS</v-tab>
                            <v-tab v-if="userRole != 5" value="three" class="font-weight-medium">DATA BANK</v-tab>
                        </v-tabs>
                        <v-window-item value="one">
                            <QualityObjectiveList :data="qualityObjectiveList" :headers="departmentHeader"
                                @viewPDF="onViewPDF" @view="onView" @removed="onRemoved" @submit="onSubmit"
                                :role="userRole" />
                            <!--  <RiskTableList :data="ownerRiskAssessments" :headers="headers(2)" @view="onView"
                                @removed="onDelete" @edit="onEdit" :role="2" @submit="onSubmit" /> -->
                        </v-window-item>
                        <v-window-item value="two">
                            <QualityObjectiveList :data="submissionObjectiveList" :headers="submissionHeader"
                                @viewPDF="onViewPDF" @view="onView" @removed="onRemoved" @submit="onSubmit" :role="5"
                                @validate="onValidate" />
                        </v-window-item>
                        <v-window-item value="three">
                            <QualityObjectiveList :data="dataBankObjectiveList" :headers="submissionHeader" :role="1"
                                @viewPDF="onViewPDF" @view="onView" />
                        </v-window-item>
                    </v-window>
                </template>


            </template>
        </v-card-text>
    </v-card>
    <QualityObjectiveModal v-if="objectiveModal.show" v-model="objectiveModal.show" :form-details="objectiveModal" />
    <v-dialog v-model="academicModal.show" persistent max-width="400">
        <v-card>

            <form @submit.prevent="storeAcademicYear">
                <v-card-title class="text-h5 d-flex align-center">
                    Create Quality Objective
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="academicModal.show = false" size="small">Close</v-btn>
                </v-card-title>

                <v-card-text class="mb-0 pb-0">
                    <div class="form-group mb-0 pb-0">
                        <small class="mb-1">
                            Academic Year (e.g., 2025-2026)
                            <span class="text-danger">*</span>
                        </small>

                        <v-text-field v-model="academicModal.formInput" required variant="outlined" color="success"
                            class="mb-0 pb-0" />
                    </div>

                    <div class="form-group mb-0 pb-0">
                        <small>Select Procedure</small>

                        <v-select v-model="academicModal.procedure" :items="titleOption" item-title="name"
                            item-value="id" required variant="outlined" color="success" />
                    </div>
                </v-card-text>

                <v-card-actions class="float-end">
                    <v-btn variant="text" @click="academicModal.show = false">Cancel</v-btn>
                    <v-btn color="primary" type="submit">Create</v-btn>
                </v-card-actions>
            </form>

        </v-card>
    </v-dialog>
    <v-overlay :model-value="pageLoader" class="align-center justify-center" persistent>
        <v-progress-circular indeterminate size="64" color="primary" />
    </v-overlay>
    <AlertMessage v-if="alertMessage.show" :alertMessage="alertMessage" />
    <ConfirmationDialog v-if="confirmData.show" :confirmData="confirmData" @confirm="confirmAction" />

</template>
<script>
import { GeneralController } from '@/stores/GeneralController';
import QualityObjectiveList from './components/QualityObjectiveList.vue';
import AlertMessage from '../components/AlertMessage.vue';
import ConfirmationDialog from '../components/ConfirmationDialog.vue';
import QualityObjectiveModal from './components/QualityObjectiveModal.vue';

export default {
    name: 'QualityObjective',
    data() {
        return {
            contentLoading: true,
            academicModal: {

                show: false,
                formInput: '',
                procedure: null
            },
            titleOption: null,
            pageLoader: false,
            alertMessage: {
                show: false,
                type: 'info', // success | error | warning | info
                text: 'Your action was completed successfully.',
                buttonText: 'OK',
            },
            tab: null,
            qualityObjectiveList: [],
            submissionObjectiveList: [],
            dataBankObjectiveList: [],
            confirmData: {
                show: false,
                type: 'warning',
                title: 'Delete Item?',
                message: 'Are you sure you want to delete this item?'
            },
            apiLink: [
                { role: 1, link: 'quality-objective/retrieve-data-list', dataKey: 'qualityObjectiveList', name: 'Administrator' },
                { role: 2, link: 'quality-objective/retrieve-list', dataKey: 'qualityObjectiveList', name: 'Owner' },
                { role: 5, link: 'quality-objective/retrieve-submitted', dataKey: 'qualityObjectiveList', name: 'School Director' }
            ],
            objectiveModal: {
                show: false,
                link: null,
                data: null,
                isModalLoading: true
            }
        }

    },
    components: {
        QualityObjectiveList, AlertMessage, ConfirmationDialog, QualityObjectiveModal
    },
    computed: {
        departmentHeader() {
            return [
                { title: 'Academic Year', key: 'academic', align: 'start' },
                { title: 'Procedure', key: 'procedure', align: 'start' },
                { title: 'Objectives', key: 'objectives', align: 'start' },
                { title: 'Completion', key: 'completionProgress', align: 'start' },
            ];
        },
        submissionHeader() {
            return [
                { title: 'Academic Year', key: 'academic', align: 'start' },
                { title: 'Procedure', key: 'procedure', align: 'start' },
                { title: 'Objectives', key: 'objectives', align: 'start' },
                { title: 'Completion', key: 'completionProgress', align: 'start' },
                { title: 'Department', key: 'department', align: 'start' },
                { title: 'Owner Name', key: 'created_by', align: 'start' },
                { title: 'Status', key: 'status', align: 'start' },
            ];
        },
        userRole() {
            let storedProfile;
            try {
                const userData = localStorage.getItem('user');
                storedProfile = userData ? JSON.parse(userData) : null;
            } catch (error) {
                this.alertMessage = {
                    show: true,
                    status: 'error',
                    text: 'Failed to parse user data from localStorage:', error
                }
                storedProfile = null;
            }
            return storedProfile?.roleID || 6;
        },
    },
    async mounted() {
        console.log(this.userRole)
        this.titleOption = await GeneralController.retrieveData('amendment/categories', { search: 'Procedure' }, 'data');
        if (this.userRole == 2) {
            this.qualityObjectiveList = await this.retrieveData(2)
        } else if (this.userRole == 5) {
            this.qualityObjectiveList = await this.retrieveData(2)
            this.submissionObjectiveList = await this.retrieveData(5)
        } else {
            this.dataBankObjectiveList = await this.retrieveData(1)
            this.qualityObjectiveList = await this.retrieveData(2)
            this.submissionObjectiveList = await this.retrieveData(5)
        }

    },
    methods: {
        async retrieveData() {
            this.qualityObjectiveList = await GeneralController.retrieveData('quality-objective/retrieve-list', { search: null }, 'qualityObjectiveList');
            this.contentLoading = false
        },
        async retrieveData(role) {
            // Get the appropriate API link based on user role
            const roleLink = this.apiLink.find(ap => ap.role === role);
            this.contentLoading = false
            try {
                const response = await GeneralController.retrieveData(roleLink.link, { search: null }, roleLink.dataKey)
                if (response) {
                    this.contentLoading = false
                    return response

                }
            } catch (error) {
                this.alertMessage = {
                    show: true,
                    status: 'error',
                    text: `An error occurred while  retrieve data for ${roleLink.name}.` + error
                }
            } finally {
                this.contentLoading = false;
            }
        },
        async storeAcademicYear() {
            this.pageLoader = true
            try {
                this.contentLoading = true
                const formData = new FormData()
                formData.append('academic', this.academicModal.formInput)
                formData.append('procedure', this.academicModal.procedure)
                const response = await GeneralController.storeItem('quality-objective/store', formData)
                const data = await response.json();
                console.log(data)
                if (response.status == 200) {
                    this.alertMessage = {
                        show: true,
                        type: 'success',
                        text: data.message
                    }
                } else {
                    this.alertMessage = {
                        show: true,
                        type: 'error',
                        text: data.message
                    }
                }
                this.retrieveData()
            } catch (err) {
                this.alertMessage = {
                    show: true,
                    type: 'error',
                    text: 'Failed to parse user data from localStorage:', error
                }
            } finally {
                this.academicModal = {
                    show: false,
                    procedure: null,
                    formInput: ''
                }
                this.contentLoading = false
                this.pageLoader = false;
            }
        },
        confirmationAlert(data) {
            this.confirmData = {
                show: true,
                type: 'warning',
                title: 'Delete Item?',
                message: 'Are you sure you want to delete this Quality Objective?',
                data: data
            }
        },
        onView(data) {
            window.location.href = `/quality-objectives/monitoring/view/${data.id}`;
        },
        async onViewPDF(item) {
            const value = item.id
            console.log(item)
            this.formLoader = true
            this.objectiveModal.show = true
            this.objectiveModal.data = item
            const response = await GeneralController.retrieveFile({ objective: value }, 'quality-objective/pdf-qualityObjective');
            const blob = new Blob([response], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            this.objectiveModal.link = url
            if (this.objectiveModal.link) {
                this.objectiveModal.isModalLoading = false
            }

        },
        onSubmit() {

        },
        onRemoved(data) {
            const formData = new FormData()
            formData.append('objective', data.id)
            this.confirmData = {
                show: true,
                type: 'warning',
                title: 'Delete Item?',
                message: 'Are you sure you want to delete this Quality Objective?',
                data: { formData, link: 'removed' }
            }
        },
        async confirmAction(action) {
            this.pageLoader = true;
            this.contentLoading = true;

            const link = `quality-objective/${action.link}`;

            const setAlert = (type, text) => {
                this.alertMessage = {
                    show: true,
                    type,
                    text,
                    buttonText: 'OK',
                };
            };

            try {
                const response = await GeneralController.removeItem(link, action.formData);

                if (response.status === 200) {
                    this.retrieveData();
                    setAlert('info', 'Your action was completed successfully.');
                } else {
                    const message = response?.data?.message || '';
                    setAlert('error', `Failed to transact the Quality Objective.\n${message}`);
                }
            } catch (error) {
                setAlert(
                    'error',
                    'An error occurred while transacting Quality Objectives.'
                );
            } finally {
                this.pageLoader = false;
                this.contentLoading = false;
            }
        }

    }
}
</script>