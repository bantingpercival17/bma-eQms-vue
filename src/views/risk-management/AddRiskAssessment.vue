<template>
    <v-card variant="outlined" elevation="0" class="bg-surface mb-5" rounded="lg">
        <v-card-item>
            <div class="d-flex justify-space-between align-center">
                <v-card-title class="text-h4">CREATE A RISK ASSESSMENT</v-card-title>
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
                    <div class="form-group ">
                        <v-label>HAZARDS/RISKS DESCRIPTION<span class="text-danger">*</span></v-label>
                        <v-text-field v-model="formData.risks_description" required variant="outlined" class="mt-2"
                            color="success" placeholder="">
                        </v-text-field>
                    </div>
                    <div class="form-group ">
                        <v-label>EXISTING CONTROL MEASURES<span class="text-danger">*</span></v-label>
                        <v-text-field v-model="formData.control_measures" required variant="outlined" class="mt-2"
                            color="success" placeholder="">
                        </v-text-field>
                    </div>
                    <v-row>
                        <v-col>
                            <v-label>WHO / WHAT IS AT RISKS?<span class="text-danger">*</span></v-label>
                            <v-text-field v-model="formData.who_at_risk" required variant="outlined" class="mt-2"
                                color="success" placeholder="">
                            </v-text-field>
                        </v-col>
                        <v-col>
                            <v-label>CONSEQUENCE<span class="text-danger">*</span></v-label>
                            <v-select v-model="formData.consequence" :items="consequence" required variant="outlined"
                                class="mt-2" item-title="term" item-value="id" placeholder="Select Consequence" />
                        </v-col>
                        <v-col>
                            <v-label>LIKELIHOOD <span class="text-danger">*</span></v-label>
                            <v-select v-model="formData.likelihood" :items="likelihood" required variant="outlined"
                                class="mt-2" item-title="term" item-value="id" />
                        </v-col>
                    </v-row>
                    <div class="form-group ">
                        <v-label>ACTION TO BE TAKEN TO MINIMIZE THE RISKS?<span class="text-danger">*</span></v-label>
                        <v-text-field v-model="formData.action_to_minimize" required variant="outlined" class="mt-2"
                            color="success" placeholder="">
                        </v-text-field>
                    </div>
                    <v-row>
                        <v-col>
                            <v-label>ACTION BY WHOM?<span class="text-danger">*</span></v-label>
                            <v-text-field v-model="formData.action_by_whom" required variant="outlined" class="mt-2"
                                color="success" placeholder="">
                            </v-text-field>
                        </v-col>
                        <v-col>
                            <v-label>ACTION BY WHEN?<span class="text-danger">*</span></v-label>
                            <v-select v-model="formData.action_by_when" :items="when_action" required variant="outlined"
                                class="mt-2" item-title="name" item-value="id" placeholder="Select Consequence" />
                        </v-col>
                        <v-col>
                            <v-label>ACTION EFFECTIVENESS<span class="text-danger">*</span></v-label>
                            <v-text-field v-model="formData.action_effectiveness" required variant="outlined"
                                class="mt-2" color="success" placeholder="">
                            </v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-label>RISK DECISION<span class="text-danger">*</span></v-label>
                            <v-select v-model="formData.risk_decision" :items="risk_decision" required
                                variant="outlined" class="mt-2" item-title="name" item-value="id"
                                placeholder="Select Consequence" />
                        </v-col>
                        <v-col>
                            <v-label>IS OPPORTUNITIES IDENTIFIED OVER THE RISK?<span
                                    class="text-danger">*</span></v-label>
                            <v-text-field v-model="formData.opportunity_identified" required variant="outlined"
                                class="mt-2" color="success" placeholder="">
                            </v-text-field>
                        </v-col>
                        <v-col>
                            <v-label>OPPORTUNITY RATE<span class="text-danger">*</span></v-label>
                            <v-select v-model="formData.opportunity_rate" :items="opportunity_rating" required
                                variant="outlined" class="mt-2" item-title="name" item-value="id"
                                placeholder="Select Consequence" />
                        </v-col>
                    </v-row>
                    <v-btn type="submit" color="primary" class="mb-4">Save Risk Assessment</v-btn>
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
                    <v-card-text>Are you sure you want to submit this Risk and Opportunity?</v-card-text>
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
export default {
    name: 'AddRiskAssessment',
    data() {
        const formData = {
            activity: '',
            date_created: '',
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
        return {
            contentLoading: false,
            formLoader: false,
            confirmDialog: false,
            alertMessage: '',
            alertType: '',
            formData,
            consequence,
            likelihood,
            when_action,
            risk_decision, opportunity_rating
        }
    },
    components: {
    },
    async mounted() {
    },
    methods: {
        async submitUpload() {
            this.formLoader = true;
            try {
                const form = new FormData();
                for (const key in this.formData) {
                    form.append(key, this.formData[key]);
                }
                this.confirmDialog = false;
                const response = await GeneralController.storeItem('risk-and-opportunity/store-risk', form);
                /* console.log(response.json()); */
                if (response.status == 200) {
                    this.alertMessage = 'Risk Assessment created successfully.';
                    this.alertType = 'success';
                    const data = await response.json();
                    console.log(data);
                    // this.clearForms();
                    window.location.href = '/risk/risk-management/view/' + data.data.id;
                } else {
                    this.alertMessage = 'Failed to create Risk Assessment. ' + (response.data.message || '');
                    this.alertType = 'error';

                }
            } catch (error) {
                this.alertMessage = 'An error occurred while creating the Risk Assessment.' + error;
                this.alertType = 'error';
            } finally {
                this.formLoader = false;
                this.confirmDialog = false;
            }
        },
        clearForms() {
            this.formData = {
                activity: '',
                date_created: '',
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
        }
    },
}
</script>