<template>
    <v-card variant="outlined" elevation="0" class="bg-surface mb-5" rounded="lg">
        <v-card-item>
            <div class="d-flex justify-space-between align-center">
                <v-card-title class="text-h4">VIEW RISK ASSESSMENT</v-card-title>
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
                <!-- Form -->
                <form @submit.prevent="updateConfirmation" class="mb-5">
                    <v-row>
                        <v-col>
                            <div class="form-group ">
                                <v-label>ACTIVITY/PROCESS/PROCEDURE<span class="text-danger">*</span></v-label>
                                <v-text-field v-model="formData.activity" required variant="outlined" class="mt-2"
                                    color="success" placeholder="">
                                </v-text-field>
                            </div>
                        </v-col>
                        <v-col>
                            <div class="form-group">
                                <v-label>DATE <span class="text-danger">*</span></v-label>
                                <v-text-field type="date" v-model="formData.date_created" required variant="outlined"
                                    class="mt-2 border" color="success" placeholder="">
                                </v-text-field>
                            </div>
                        </v-col>
                    </v-row>
                    <v-btn type="button" color="success" class="mb-4 ms-3 float-end" @click="showPDF">View as
                        PDF</v-btn>
                    <v-btn type="submit" color="primary" class="mb-4 float-end">Update Activity Risk Assessment</v-btn>
                </form>
                <RiskAssessmentTableList :data="riskAssessments.registered_risk" :headers="headers" @add="addRisk"
                    @edit="editRisk" @removed="confirmationRemoveRisk" />
            </template>

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
        </v-card-text>
    </v-card>
    <AddRiskDescriptionModel v-model="openModel" :formData="riskFormData" :consequence="consequence"
        :likelihood="likelihood" :when_action="when_action" :risk_decision="risk_decision"
        :opportunity_rating="opportunity_rating" @addRisk="saveRisk" :alertMessage="alertMessageModal"
        @update:formData="riskFormData = $event" />
    <!-- PDF View -->
    <RiskReportModal v-if="riskPDFModal" v-model="openReportModel" :formDetails="riskPDFModal" />
</template>
<script>
import { GeneralController } from '@/stores/GeneralController';
import RiskAssessmentTableList from './components/RiskAssessmentTableList.vue';
import AddRiskDescriptionModel from './components/AddRiskDescriptionModel.vue';
import RiskReportModal from './components/RiskReportModal.vue';
export default {
    name: 'AddRiskAssessment',
    data() {
        const formData = {
            activity: '',
            date_created: '',
        }
        const riskFormData = {
            risk: '',
            risks_description: '',
            control_measures: '',
            who_at_risk: null,
            consequence: null,
            likelihood: null,
            action_to_minimize: '',
            action_by_whom: '',
            action_by_when: '',
            action_effectiveness: '',
            residual_risk: '',
            risk_decision: '',
            opportunity_identified: '',
            opportunity_rate: '',
        }

        const consequence = [
            { id: 1, term: '(1) Insignificant' },
            { id: 2, term: '(2) Minor' },
            { id: 3, term: '(3) Moderate' },
            { id: 4, term: '(4) Major' },
            { id: 5, term: '(5) Severe' },
        ]
        const likelihood =
            [
                { id: 1, term: '(1) Rare' },
                { id: 2, term: '(2) Unlikely' },
                { id: 3, term: '(3) Possible' },
                { id: 4, term: '(4) Likely' },
                { id: 5, term: '(5) Almost Certain' },
            ]
        const when_action = [
            { id: 'urgently', name: 'urgently' },
            { id: 'immediately', name: 'immediately' },
            { id: 'within the day', name: 'within the day' },
            { id: 'within 2 days', name: 'within 2 days' },
            { id: 'within 1 week', name: 'within 1 week' },
            { id: 'within 2 weeks', name: 'within 2 weeks' },
            { id: 'within one month', name: 'within one month' },
            { id: 'within 3 months', name: 'within 3 months' },
            { id: 'within 6 months', name: 'within 6 months' },
            { id: 'within 1 Year', name: 'within 1 Year' },
            { id: 'within 5 Years', name: 'within 5 Years' },
            { id: 'Before Next Audit', name: 'Before Next Audit' },
            { id: 'Continuous', name: 'Continuous' },
        ]
        const risk_decision = [
            { id: 'a', name: 'A' },
            { id: 'b', name: 'B' },
            { id: 'c', name: 'C' },
            { id: 'd', name: 'D' },
            { id: 'e', name: 'E' }
        ]
        const opportunity_rating = [
            { id: 'very-high', name: 'Very High' },
            { id: 'high', name: 'High' },
            { id: 'medium', name: 'Medium' },
            { id: 'low', name: 'Low' },
            { id: 'very-low', name: 'Very Low' }
        ]
        const errors = []
        const headers = [
            { title: 'Action', key: 'actionBtn', align: 'start' },
            { title: 'Hazards/Risks Description', key: 'risks_description', align: 'start' },
            { title: 'Existing Control Measures', key: 'control_measures', align: 'start' },
            { title: 'Consequence', key: 'consequence', align: 'start' },
            { title: 'Opportunity', key: 'likelihood', align: 'start' },
            { title: 'Action to be taken to minimize the Risks?', key: 'who_at_risk', align: 'start' },
        ]
        return {
            contentLoading: true,
            formLoader: false,
            confirmDialog: {
                show: false,
                text: '',
                action: ''
            },
            alertMessage: '',
            alertMessageModal: {
                show: false,
                status: 'warning', // 'success' | 'error' | 'warning' | 'info'
                text: 'Operation completed successfully!'
            },
            alertType: '',
            formData,
            riskFormData,
            consequence,
            likelihood,
            when_action,
            risk_decision, opportunity_rating, headers,
            openModel: false,
            openReportModel: false,
            riskPDFModal: []
        }
    },
    components: {
        RiskAssessmentTableList, AddRiskDescriptionModel, RiskReportModal
    },
    async mounted() {
        this.loadRiskAssessment()
    },
    methods: {
        updateConfirmation() {
            this.confirmDialog = {
                show: true,
                text: 'Are you sure you want to update this Risk Assessment?',
                action: () => this.submitUpload()
            }
        },
        async submitUpload() {
            this.confirmDialog.show = false
            this.formLoader = true;
            try {
                const form = new FormData();
                for (const key in this.formData) {
                    form.append(key, this.formData[key]);
                }
                this.confirmDialog = false;
                const response = await GeneralController.storeItem('risk-and-opportunity/update-risk', form);
                console.log(response);
                if (response.status == 200) {
                    this.alertMessage = 'Risk Assessment Updated successfully.';
                    this.alertType = 'success';
                    this.clearForms();
                    window.location.href = '/risk/risk-management/view/' + response.data.id;
                } else {
                    this.alertMessage = 'Failed to update Risk Assessment. ' + (response.data.message || '');
                    this.alertType = 'error';

                }
            } catch (error) {
                this.alertMessage = 'An error occurred while updating the Risk Assessment.' + error;
                this.alertType = 'error';
            } finally {
                this.formLoader = false;
                this.confirmDialog = false;
            }
        },
        clearForms() {
            this.riskFormData = {
                risks_description: '',
                control_measures: '',
                who_at_risk: '',
                consequence: '',
                likelihood: '',
                action_to_minimize: '',
                action_by_whom: '',
                action_by_when: '',
                action_effectiveness: '',
                residual_risk: '',
                risk_decision: '',
                opportunity_identified: '',
                opportunity_rate: '',
            };
        },
        async loadRiskAssessment() {
            this.riskAssessments = await GeneralController.retrieveData('risk-and-opportunity/view-risk-v1', { risk: this.$route.params.riskId }, 'risk')// Load existing risk assessment data if editing
            if (this.riskAssessments) {
                this.formData.activity = this.riskAssessments.activity
                this.formData.date_created = this.riskAssessments.date_created;
                this.formData.risk = this.encrypt(this.riskAssessments.id);
                this.riskFormData.risk = this.encrypt(this.riskAssessments.id);
                const response = await GeneralController.retrieveFile({ risk: this.formData.risk }, 'risk-and-opportunity/risk-pdf-report');
                const blob = new Blob([response], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                this.riskPDFModal = {
                    content: this.riskAssessments,
                    link: url,
                    isModalLoading: false,
                }
            }
            this.contentLoading = false
        },
        addRisk() {
            this.openModel = true
        },
        editRisk(item) {
            this.riskFormData = item
            this.riskFormData.risk = this.encrypt(this.riskFormData.id);
            this.riskFormData.action = 'update'
            this.openModel = true
            console.log('Edit Risk button clicked');
        },
        confirmationRemoveRisk(item) {
            this.confirmDialog = {
                show: true,
                text: 'Are you sure do you want to remove this Risk Description?',
                action: () => this.removeRisk(item)
            }
        },
        async removeRisk(item) {
            // Logic to remove a risk description
            console.log('Remove Risk button clicked');
            this.confirmDialog.show = false;
            this.formLoader = true;
            try {
                const formData = new FormData();
                formData.append('risk', this.encrypt(item.id));
                const response = await GeneralController.removeItem('risk-and-opportunity/remove-register-risk', formData);
                if (response.status == 200) {
                    this.alertMessageModal = {
                        text: `Risk Description Removed.`,
                        status: 'success',
                        show: true
                    }
                    this.contentLoading = true
                    this.loadRiskAssessment()
                } else {
                    this.alertMessageModal = {
                        text: `Failed to Remove the Risk Description. ` + (response.statusText || ''),
                        status: 'error',
                        show: true
                    }

                }
            } catch (error) {
                this.alertMessageModal = {
                    text: `An error occurred while Removing the Risk Description.` + error,
                    status: 'error',
                    show: true
                }
            } finally {
                this.formLoader = false
            }
        },
        async saveRisk() {
            this.formLoader = true;
            try {
                const form = new FormData();
                for (const key in this.riskFormData) {
                    form.append(key, this.riskFormData[key]);
                }
                this.confirmDialog = false;
                let response
                let category = 'Add New';
                if (this.riskFormData.action && this.riskFormData.action == 'update') {
                    response = await GeneralController.storeItem('risk-and-opportunity/update-register-risk', form);
                    category = 'Update';
                } else {
                    response = await GeneralController.storeItem('risk-and-opportunity/add-risk', form);
                }
                console.log(response);
                if (response.status == 200) {
                    this.alertMessageModal = {
                        text: `${category} Risk Assessment.`,
                        status: 'success',
                        show: true
                    }
                    this.clearForms();
                    this.openModel = false
                    this.contentLoading = true
                    this.loadRiskAssessment()
                    //window.location.href = '/risk/risk-management/view/' + response.data.id;
                } else {
                    this.alertMessageModal = {
                        text: `Failed to ${category} Risk Assessment. ` + (response.statusText || ''),
                        status: 'error',
                        show: true
                    }

                }
            } catch (error) {
                this.alertMessageModal = {
                    text: `An error occurred while ${category} the Risk Assessment.` + error,
                    status: 'error',
                    show: true
                }
            } finally {
                this.formLoader = false
            }
        },
        showPDF() {
            this.openReportModel = true
            this.riskPDFModal.isModalLoading = false
            console.log(this.riskPDFModal)
        },
        encrypt(data) {
            return btoa(data)
        },
    }
}
</script>