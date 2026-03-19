<template>
    <v-dialog :model-value="modelValue" @update:model-value="formModalClose" max-width="1000px" persistent>
        <v-card>
            <v-card-title class="text-h5 d-flex align-center">
                {{ formData.action == 'update' ? 'UPDATE' : 'ADD' }} RISK ASSESSMENTS
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="formModalClose">Close</v-btn>
            </v-card-title>
            <v-card-text class="pa-5">
                <form @submit.prevent="addConfirmDialog = true" class="mb-5">
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
                                class="mt-2" item-title="term" item-value="id" placeholder="Select Likelihood"/>
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
                                class="mt-2" item-title="name" item-value="id" placeholder="Select Option" />
                        </v-col>
                        <v-col>
                            <v-label>ACTION EFFECTIVENESS<span class="text-danger">*</span></v-label>
                            <v-text-field type="number" v-model="formData.action_effectiveness" required
                                variant="outlined" class="mt-2" color="success" placeholder="">
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
            </v-card-text>
        </v-card>
    </v-dialog>
    <v-dialog v-model="addConfirmDialog" persistent max-width="400">
        <v-card>
            <v-card-title class="text-h6">Confirmation Message</v-card-title>
            <v-card-text>Are you sure you want to add a new Risk Assessments?</v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="addConfirmDialog = false">Cancel</v-btn>
                <v-btn color="primary" @click="submitForm">Confirm</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
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

</template>
<style>
.full-screen-iframe {
    width: 100%;
    height: 100vh;
    border: none;
}
</style>

<script>
export default {
    name: 'RiskViewModal',
    data() {
        return {
            formModalTab: null,
            addConfirmDialog: false,
        }
    },
    props: {
        modelValue: {
            type: Boolean,
            required: true,
        },
        formData: Object,
        consequence: Array,
        likelihood: Array,
        when_action: Array,
        risk_decision: Array,
        opportunity_rating: Array,
        alertMessage: Object,

    },
    emits: ['update:modelValue', 'addRisk', 'update:formData'],
    methods: {
        formModalClose() {
            this.$emit('update:modelValue', false);
            this.$emit('update:formData', {})
        },
        submitForm() {
            this.$emit('addRisk', this.formData)
            this.addConfirmDialog = false;
        },
    }
}
</script>
