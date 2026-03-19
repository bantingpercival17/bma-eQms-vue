<template>
    <v-card variant="outlined" elevation="0" class="bg-surface mb-5" rounded="lg">
        <v-card-item>
            <div class="d-flex justify-space-between align-center">
                <v-card-title class="text-h4">Risk Assessment</v-card-title>

                <v-btn color="primary" to="/risk/risk-management/create-new">Register Risk Assessments</v-btn>
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
                    <RiskTableList :data="riskAssessmentsList" :headers="headers(2)" @view="onView" @removed="onDelete"
                        @edit="onEdit" @submit="onSubmit" :role="userRole" />
                </template>
                <template v-else>
                    <v-window v-model="tab">
                        <v-tabs v-model="tab" color="success" class="px-6">
                            <v-tab value="one" class="font-weight-medium">MY RISKS</v-tab>
                            <v-tab v-if="userRole != 6" value="two" class="font-weight-medium">SUBMISSIONS</v-tab>
                            <v-tab v-if="userRole != 5" value="three" class="font-weight-medium">DATA BANK</v-tab>
                        </v-tabs>
                        <v-window-item value="one">
                            <RiskTableList :data="ownerRiskAssessments" :headers="headers(2)" @view="onView"
                                @removed="onDelete" @edit="onEdit" :role="2" @submit="onSubmit" />
                        </v-window-item>
                        <v-window-item value="two">
                            <RiskTableList :data="submissionRiskAssessments" :headers="headers(5)" @view="onView"
                                @removed="onDelete" @edit="onEdit" :role="5" @validate="onValidate" />
                        </v-window-item>
                        <v-window-item value="three">
                            <RiskTableList :data="dataBankRiskAssessments" :headers="headers(1)" @view="onView"
                                @removed="onDelete" @edit="onEdit" :role="1" />
                        </v-window-item>
                    </v-window>
                </template>


            </template>
        </v-card-text>
    </v-card>
    <RiskReportModal v-if="riskAssessments" v-model="openModel" :formDetails="riskAssessments" />
    <!-- Loader -->
    <v-overlay :model-value="formLoader" class="align-center justify-center" persistent>
        <v-progress-circular indeterminate size="64" color="primary" />
    </v-overlay>
    <!-- Confirmation Dialog -->
    <v-dialog v-model="confirmDialog.show" persistent max-width="400">
        <v-card>
            <v-card-title class="text-h6">Confirmation Message</v-card-title>
            <v-card-text>{{ confirmDialog.text }}</v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="confirmDialog.show = false">Cancel</v-btn>
                <v-btn color="primary" @click="confirmDialog.action()">Confirm</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <!-- Confirmation Dialog -->
    <v-dialog v-model="alertMessage.show" persistent max-width="400">
        <v-card :color="alertMessage.status" class="text-white">
            <v-card-title class="d-flex align-center">
                <span class="text-h6">Alert Message</span>
            </v-card-title>

            <v-card-text>
                {{ alertMessage.text }}
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn variant="text" @click="alertMessage.show = false" class="text-white">
                    Close
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <RiskAssessmentValidation v-if="riskAssessmentValidation.content" v-model="riskAssessmentValidation.modalShow"
        :formDetails="riskAssessmentValidation.content" @approved="onApproved" @disapproved="onDisapproved" />
</template>
<script>
import CardHeader from '@/components/shared/CardHeader.vue';
import { defineComponent } from 'vue';
import VersionTableList from '@/views/qms/versionControl/VersionTableList.vue';
import { GeneralController } from '@/stores/GeneralController';
import RiskTableList from './components/RiskTableList.vue';
import RiskReportModal from './components/RiskReportModal.vue';
import RiskAssessmentValidation from './components/RiskAssessmentValidation.vue';

export default defineComponent({
    name: 'VersionControl',
    data() {
        return {
            tab: null,
            contentLoading: true,
            openModel: false,
            riskAssessmentsList: [],
            riskAssessments: null,
            formLoader: false,
            confirmDialog: {
                show: false,
                text: '',
                action: ''
            },
            alertMessage: {
                show: false,
                status: 'warning', // 'success' | 'error' | 'warning' | 'info'
                text: 'Operation completed successfully!'
            },
            tab: null,
            ownerRiskAssessments: [],
            submissionRiskAssessments: [],
            dataBankRiskAssessments: [],
            riskAssessmentValidation: {
                modalShow: false,
                content: null
            }

        }
    },
    components: {
        CardHeader, VersionTableList, RiskTableList, RiskReportModal, RiskAssessmentValidation
    },
    computed: {
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
        this.loadData()
    },
    methods: {
        async loadData() {
            const apiLink = [
                { role: 1, link: 'risk-and-opportunity/risk-register', dataKey: 'riskReport' },
                { role: 2, link: 'risk-and-opportunity/retrieve-data', dataKey: 'riskList' },
                { role: 5, link: 'risk-and-opportunity/retrieve-submitted-risk', dataKey: 'riskList' },
                { role: 6, link: 'risk-and-opportunity/retrieve-data', dataKey: 'riskList' },
            ]
            // Get the appropriate API link based on user role
            const roleLink = apiLink.find(ap => ap.role === this.userRole);
            const response = await GeneralController.retrieveData(roleLink.link, { search: null }, roleLink.dataKey)
            if (response) {
                this.riskAssessmentsList = response
                this.contentLoading = false
            }
            this.ownerRiskAssessments = await this.retrieveData(2)
            this.submissionRiskAssessments = await this.retrieveData(5)
            this.dataBankRiskAssessments = await this.retrieveData(1)
        },
        async retrieveData(role) {
            const apiLink = [
                { role: 1, link: 'risk-and-opportunity/risk-register', dataKey: 'riskReport', name: 'Administrator' },
                { role: 2, link: 'risk-and-opportunity/retrieve-data', dataKey: 'riskList', name: 'Department Head' },
                { role: 5, link: 'risk-and-opportunity/retrieve-submitted-risk', dataKey: 'riskList', name: 'School Director' }
            ]
            // Get the appropriate API link based on user role
            const roleLink = apiLink.find(ap => ap.role === role);
            this.contentLoading = false
            console.log(role)
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
        async onView(item) {
            this.formLoader = true
            this.openModel = true
            const response = await GeneralController.retrieveFile({ risk: item }, 'risk-and-opportunity/risk-pdf-report');
            const blob = new Blob([response], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            this.riskAssessments = {
                content: await GeneralController.retrieveData('risk-and-opportunity/view-risk-v1', { risk: item }, 'risk'),
                link: url,
                isModalLoading: false,
            }
            if (this.riskAssessments.content) {
                this.formLoader = false
            }
        },
        async onValidate(item) {
            this.formLoader = true
            this.riskAssessmentValidation.modalShow = true
            const response = await GeneralController.retrieveFile({ risk: item.id }, 'risk-and-opportunity/risk-pdf-report');
            const blob = new Blob([response], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            this.riskAssessmentValidation.content = {
                content: await GeneralController.retrieveData('risk-and-opportunity/view-validation', { risk: item.id }, 'risk'),
                link: url,
                validation: item,
                isModalLoading: false,
            }
            if (this.riskAssessmentValidation.content) {
                this.formLoader = false
            }
        },
        onEdit(item) {
            window.location.href = `/risk/risk-management/view/${item.riskId}`;
        },
        onSubmit(data) {
            const action = {
                link: 'submit-risk',
                text: ['submitting', 'submitted']
            }
            this.confirmDialog = {
                show: true,
                text: 'Are you sure do you want to submit this Risk Assessments?',
                action: () => this.confirmAction(action, data)
            }
        },
        onDelete(data) {
            const action = {
                link: 'removed-risk',
                text: ['removing', 'removed']
            }
            this.confirmDialog = {
                show: true,
                text: 'Are you sure do you want to remove this Risk Assessments?',
                action: () => this.confirmAction(action, data)
            }
        },
        async confirmAction(action, data) {
            this.confirmDialog.show = false;
            const formData = new FormData();
            formData.append('risk', data.id);
            const link = 'risk-and-opportunity/' + action.link
            this.contentLoading = true
            try {
                const response = await GeneralController.removeItem(link, formData);
                if (response.status == 200) {
                    this.loadData()
                    this.alertMessage = {
                        show: true,
                        status: 'primary',
                        text: `Successfully ${action.text[1]} the Risk Assessment`
                    }
                } else {
                    this.alertMessage = {
                        show: true,
                        status: 'error',
                        text: `Failed to ${action.text[0]} the risk assessment.` + (response.data.message || '')
                    }
                }
            } catch (error) {
                this.alertMessage = {
                    show: true,
                    status: 'error',
                    text: `An error occurred while  ${action.text[0]} the Risk Assessment.` + error
                }
            } finally {
                this.formLoader = false;
                this.contentLoading = false;
            }
        },
        headers(user) {
            const qmrHeader = [
                { title: 'Department', key: 'department', align: 'start' },
                { title: 'Activity/Process/Procedure', key: 'activity', align: 'start' },
                { title: 'Hazards/Risks Description', key: 'description', align: 'start' },
                { title: 'Control Measures', key: 'control_measures', align: 'start' },
                { title: 'Year', key: 'date_created', align: 'start' },
                { title: 'Who/What is at Risk?', key: 'who_at_risk', align: 'start' },
                { title: 'Consequence', key: 'consequence', align: 'start' },
                { title: 'Likelihood', key: 'likelihood', align: 'start' },
                { title: 'Risk Level', key: 'initial_risk_level', align: 'start' },
                { title: 'Is Opportunities identified over the Risk?', key: 'opportunity_identified', align: 'start' },
                { title: 'Opportunity Rate', key: 'opportunity_rate', align: 'start' },
            ];
            const departmentHeader = [
                { title: 'Date', key: 'date_created', align: 'start' },
                { title: 'Activity/Process/Procedure', key: 'activity', align: 'start' },
                { title: 'Status', key: 'status', align: 'start' },
            ]
            const sdoHeader = [
                { title: 'Date', key: 'date_created', align: 'start' },
                { title: 'Activity/Process/Procedure', key: 'activity', align: 'start' },
                { title: 'Hazards/Risks Description', key: 'registeredRisk', align: 'start' },
                { title: 'Department', key: 'department', align: 'start' },
                { title: 'Owner Name', key: 'created_by', align: 'start' },
                { title: 'Status', key: 'status', align: 'start' },
            ]

            return user === 1 ? qmrHeader : (user === 5 ? sdoHeader : departmentHeader)
        },
        onApproved(data) {
            const formData = new FormData()
            formData.append('validateID', data.verificationId)
            formData.append('status', 1)
            this.confirmDialog = {
                show: true,
                text: 'Are you sure do you want to approved this Risk Assessments?',
                action: () => this.riskAssessmentsValidate(formData)
            }
        },
        onDisapproved(data) {
            this.confirmDialog = {
                show: true,
                text: 'Are you sure do you want to disapproved this Risk Assessments?',
                action: () => this.riskAssessmentsValidate(data)
            }
        },
        async riskAssessmentsValidate(data) {
            this.confirmDialog.show = false
            this.riskAssessmentValidation.modalShow = false
            this.formLoader = true
            /* try {
                const response = await GeneralController.storeItem('risk-and-opportunity/risk-validation', data);
                console.log(response)
                if (response.status == 200) {
                    this.alertMessage = {
                        show: true,
                        status: 'success',
                        text: 'Successfully Validated'
                    }
                    window.location.reload()
                } else {
                    this.alertMessage = {
                        show: true,
                        status: 'error',
                        text: 'Failed to validate the Risk Assessment.' + (response.data.message || '')
                    }

                }
            } catch (error) {
                this.alertMessage = {
                    show: true,
                    status: 'error',
                    text: 'An error occurred while validating the Risk Assessment.' + error
                }
            } finally {
                this.formLoader = false;
                this.confirmDialog = false;
            } */
            try {
                const response = await GeneralController.storeItem('risk-and-opportunity/risk-validation', data); if (response.status == 200) {
                    this.loadData()
                    this.alertMessage = {
                        show: true,
                        status: 'primary',
                        text: 'Successfully Validated'
                    }
                } else {
                    this.alertMessage = {
                        show: true,
                        status: 'error',
                        text: 'Failed to validate the Risk Assessment.' + (response.data.message || '')
                    }
                }
            } catch (error) {
                this.alertMessage = {
                    show: true,
                    status: 'error',
                    text: `An error occurred while  validating the Risk Assessment.` + error
                }
            } finally {
                this.formLoader = false;
                this.contentLoading = false;
            }

        },
    },
})
</script>
<style scoped>
.v-data-table td {
    vertical-align: top;
    padding: 8px 12px;
}

.v-data-table td:nth-child(3),
.v-data-table td:nth-child(4) {
    white-space: normal;
    word-wrap: break-word;
    max-width: 250px;
    /* Adjust width as needed */
}
</style>