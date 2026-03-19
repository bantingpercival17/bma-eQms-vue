<template>
    <v-dialog :model-value="modelValue" @update:model-value="formModalClose" max-width="100%" persistent>
        <v-card>
            <v-card-title class="text-h5 d-flex align-center">
                RISK ASSESSMENT REPORT
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="formModalClose">Close</v-btn>
            </v-card-title>
            <template v-if="!formDetails.isModalLoading" v-model="formModalTab">
                <v-row>
                    <v-col cols="8">
                        <div class="ps-5 pe-5">
                            <small class="text-caption text-lightText">{{ formDetails.content.department
                            }}</small><br>
                            <label for="" class="h3 text-success fw-bolder">{{ formDetails.content.activity }}</label>
                            <br>
                            <iframe v-if="formDetails.link" :src="`${formDetails.link}#toolbar=0&navpanes=0`"
                                class="full-screen-iframe mt-3" frameborder="0" @contextmenu.prevent></iframe>
                        </div>
                    </v-col>
                    <v-col>
                        <p>Risk Assessment Validation</p>
                        <form v-if="isDisapproved" @submit.prevent="onSubmit" class="mb-5">
                            <div class="form-group ">
                                <v-label>Remarks<span class="text-danger">*</span></v-label>
                                <v-textarea v-model="remarks" required variant="outlined" class="mt-2" color="success"
                                    placeholder="">
                                </v-textarea>
                                <v-btn type="submit" color="primary" class="mb-4 w-100">Submit</v-btn>
                                <v-btn @click="isDisapproved = false" color="success" class="w-100">Cancel</v-btn>
                            </div>
                        </form>
                        <div v-else class="button-action">
                            <v-btn @click="$emit('approved', formDetails.validation)" color="primary"
                                class="mt-4 w-100">Approved Risk Assessments</v-btn>
                            <v-btn @click="isDisapproved = true" color="error" class="mt-4 w-100">Disapproved Risk
                                Assessments</v-btn>
                        </div>
                        <div class="history-section">
                            <h3 class="history-title">Validation History</h3>
                            <div class="timeline">
                                <template v-if="formDetails.content?.verificationHistory.length > 0">
                                    <!-- {{ formDetails.content.verificationHistory }} -->
                                    <template v-for="value in formDetails.content.verificationHistory">
                                        <div class="timeline-item">
                                            <div :class="`timeline-marker ${status(value.is_approved)[2]}`">
                                            </div>
                                            <div class="timeline-content">
                                                <div class="timeline-header">
                                                    <v-chip :color="status(value.is_approved)[0]" dark x-small>
                                                        {{ status(value.is_approved)[1] }}
                                                    </v-chip>
                                                    <span class="date">{{ value?.validateDate }}</span>
                                                </div>
                                                <span v-if="value.validated" class="date">Verified By:</span>
                                                <p class="user-name">{{ value.validated?.name }}</p>
                                                <span class="date">Submitted Date: {{ value.dateSubmitted }}</span>
                                                <p v-if="value.remarks" class="comment">{{ value.remarks }}</p>
                                            </div>
                                        </div>

                                    </template>
                                </template>
                                <template v-else>
                                    <div class="timeline-item">
                                        <div class="timeline-marker marker-red"></div>
                                        <div class="timeline-content">
                                            <div class="timeline-header">
                                                <span class="status status-rejected">Disapproved</span>
                                                <span class="date">Today, 10:05 AM</span>
                                            </div>
                                            <p class="user-name">Neville Ardles</p>
                                            <p class="comment">"Risk calculation for Power Outage is too low. Please
                                                re-evaluate impact."</p>
                                        </div>
                                    </div>
                                </template>

                            </div>
                        </div>
                    </v-col>
                </v-row>
            </template>
            <template v-else>
                <div class="d-flex flex-column justify-center align-center pa-5">
                    <img src="@/assets/images/loading.gif" alt="Loading" />
                    <p class="h3 text-success font-weight-bold mt-3">LOADING...</p>
                </div>
            </template>
        </v-card>
    </v-dialog>
</template>
<style scoped>
.full-screen-iframe {
    width: 100%;
    height: 100vh;
    border: none;
}

/* Main Container Layout */
.right-panel-container {
    width: 100%;
    height: 100%;
    background-color: #fff;
    padding: 20px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.panel-header {
    font-size: 18px;
    font-weight: 500;
    color: #333;
    margin-bottom: 20px;
}

/* Action Section Styling */
.action-section {
    margin-bottom: 25px;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 20px;
}

.input-label {
    display: block;
    font-size: 12px;
    color: #666;
    margin-bottom: 5px;
}

.remarks-input {
    width: 100%;
    height: 60px;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 8px;
    font-size: 13px;
    resize: none;
    box-sizing: border-box;
    margin-bottom: 15px;
}

.button-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.btn {
    width: 100%;
    padding: 12px;
    border: none;
    border-radius: 5px;
    color: white;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    text-transform: uppercase;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: opacity 0.2s;
}

.btn:hover {
    opacity: 0.9;
}

.btn-approve {
    background-color: #4285f4;
    /* Match your blue */
}

.btn-disapprove {
    background-color: #ea4335;
    /* Match your red */
}

/* History Section Styling */
.history-section {
    margin-top: 20px;
    flex: 1;
    /* Takes up remaining height */
    overflow-y: auto;
    /* Scrollable if list is long */
    min-height: 100px;
}

.history-title {
    font-size: 14px;
    color: #555;
    margin-bottom: 15px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

/* Timeline Logic */
.timeline {
    position: relative;
    padding-left: 10px;
    padding-right: 20px;
}

/* The Vertical Line */
.timeline::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 14px;
    /* Adjust based on marker size */
    width: 2px;
    background: #f0f0f0;
}

.timeline-item {
    position: relative;
    padding-left: 30px;
    margin-bottom: 25px;
}

/* The Dots (Markers) */
.timeline-marker {
    position: absolute;
    left: 0;
    top: 4px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 2px solid #fff;
    /* White ring effect */
    box-shadow: 0 0 0 2px #fff;
    z-index: 1;
}

.marker-red {
    background-color: #ea4335;
}

.marker-green {
    background-color: #34a853;
}

.marker-grey {
    background-color: #9aa0a6;
}

/* Content Styling */
.timeline-content {
    font-size: 13px;
}

.timeline-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
}

.status {
    font-weight: 700;
    font-size: 12px;
}

.status-rejected {
    color: #ea4335;
}

.status-approved {
    color: #34a853;
}

.status-submitted {
    color: #5f6368;
}

.date {
    font-size: 11px;
    color: #888;
}

.user-name {
    font-weight: 600;
    color: #333;
    margin: 0 0 4px 0;
}

.comment {
    color: #555;
    margin: 0;
    font-style: italic;
    line-height: 1.4;
    background: #f9f9f9;
    padding: 8px;
    border-radius: 4px;
    border-left: 3px solid #ddd;
}
</style>

<script>
export default {
    name: 'RiskAssessmentValidations',
    data() {
        return {
            formModalTab: null,
            isDisapproved: false,
            remarks: ''
        }
    },
    props: {
        modelValue: {
            type: Boolean,
            required: true,
        },
        formDetails: Object,
    },
    emits: ['update:modelValue', 'approved', 'disapproved'],
    methods: {
        formModalClose() {
            this.$emit('update:modelValue', false);
            this.formDetails.isModalLoading = true
        },
        onSubmit() {
            const formData = new FormData()
            formData.append('validateID', this.formDetails.validation.verificationId)
            formData.append('status', 0)
            formData.append('remarks', this.remarks)
            this.$emit('disapproved', formData)
            this.remarks = ''
        },
        status(data) {
            return data == 1 ? ['primary', 'APPROVED', 'marker-green'] : (data == 0 ? ['error', 'DISAPPROVED', 'marker-red'] : ['secondary', 'PENDING', 'marker-grey'])
        }
    },
};
</script>
