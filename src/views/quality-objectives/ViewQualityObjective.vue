<template>
    <div v-if="!pageLoader" class="">
        <v-card variant="outlined" elevation="0" class="bg-surface mb-5" rounded="lg">
            <v-card-item>
                <div class="d-flex justify-space-between align-center">
                    <div class="title">
                        <small class="text-caption text-lightText">{{ objective.procedure }}</small><br>
                        <span for="" class="display-3 text-success fw-bolder"><b>{{ objective.academicYear
                        }}</b></span><br>
                        <small class="text-caption text-lightText">{{ objective.department }}</small>
                    </div>
                    <div class="button-action">
                        <small class="text-caption text-lightText">Created Date: <b>{{ objective.createdAt
                        }}</b></small>
                        <div class="d-flex justify-space-between align-center">
                            <v-btn type="button" color="success" class="" @click="onViewPDF(objective)">View as
                                PDF</v-btn>

                            <v-btn v-if="!objective.verification" @click="submitObjective" type="button" color="primary"
                                class="ms-4">Submit</v-btn>
                        </div>
                        <div v-if="objective.verification" class="d-flex justify-space-between align-center">
                            <small class="text-caption text-lightText">
                                Submitted Date: <b>{{ objective.verification.created_at }}</b>
                            </small>
                        </div>
                    </div>

                </div>
            </v-card-item>
        </v-card>
        <v-row>
            <v-col>
                <ListOfObjective :objectives="objective.listOfObjective" @add="addObjective" @view="viewObjective" />
            </v-col>
            <v-col cols="8">
                <AddObjectiveForm v-if="addQualityModal.show" :modal="addQualityModal" @store="storeObjective"
                    @removed="removeObjective" />
                <v-card v-else variant="outlined" elevation="0" class="bg-surface mb-5" rounded="lg">
                    <v-card-item>
                        <h4 class="text-primary">Select Quality Objective or Add New Quality Objective..</h4>
                    </v-card-item>
                </v-card>
            </v-col>
        </v-row>
    </div>

    <!-- Loader -->
    <v-overlay :model-value="pageLoader" class="align-center justify-center" persistent>
        <div class="d-flex justify-center align-center pa-5">
            <img src="@/assets/images/loading.gif" alt="Loading" />
        </div>
    </v-overlay>
    <QualityObjectiveModal v-if="objectiveModal.show" v-model="objectiveModal.show" :form-details="objectiveModal" />
    <AlertMessage v-if="alertMessage.show" :alertMessage="alertMessage" />
    <ConfirmationDialog v-if="confirmData.show" :confirmData="confirmData" @confirm="confirmAction" />
</template>
<script>
import { GeneralController } from '@/stores/GeneralController';
import ListOfObjective from './components/ListOfObjective.vue';
import AddObjectiveForm from './components/AddObjectiveForm.vue';
import ConfirmationDialog from '../components/ConfirmationDialog.vue';
import AlertMessage from '../components/AlertMessage.vue';
import QualityObjectiveModal from './components/QualityObjectiveModal.vue';
export default {
    name: 'ViewQualityObjective',
    data() {
        return {
            pageLoader: true,
            objective: [],
            addQualityModal: {
                show: false,
                form: [],
            },
            alertMessage: {
                show: false,
                type: 'info', // success | error | warning | info
                text: 'Your action was completed successfully.',
                buttonText: 'OK',
            },
            confirmData: {
                show: false,
                type: 'warning',
                title: 'Delete Item?',
                message: 'Are you sure you want to delete this item?'
            },
            objectiveModal: {
                show: false,
                link: null,
                data: null,
                isModalLoading: false
            }
        }
    },
    components: {
        ListOfObjective, AddObjectiveForm, ConfirmationDialog, AlertMessage, QualityObjectiveModal
    },
    async mounted() {
        this.retrieveData()
    },
    methods: {
        async retrieveData() {
            this.objective = await GeneralController.retrieveData('quality-objective/view-objective', { data: this.$route.params.objective }, 'qualityObjective');
            if (this.objective) {
                this.pageLoader = false
            }
        },
        addObjective() {
            this.addQualityModal = {
                show: true,
                form: []
            }
        },
        storeObjective(formData) {
            formData.objective = this.objective.id
            formData = JSON.stringify(formData)
            this.confirmData = {
                show: true,
                type: 'warning',
                title: 'Store Item?',
                message: 'Are you sure you want to store this Quality Objective?',
                data: { formData, link: 'add-objectives' }
            }
        },
        removeObjective(qor_id) {
            let formData = { qualityQuality: qor_id }
            formData = JSON.stringify(formData)
            this.confirmData = {
                show: true,
                type: 'warning',
                title: 'Remove Item?',
                message: 'Are you sure you want to remove this Quality Objective?',
                data: { formData, link: `remove-objective` }
            }
        },
        submitObjective() {
            let formData = { qualityObjective: this.objective.id }
            formData = JSON.stringify(formData)
            this.confirmData = {
                show: true,
                type: 'warning',
                title: 'Submit Quality Objective?',
                message: 'Are you sure you want to submit this Quality Objective?',
                data: { formData, link: `submit-quality-objective` }
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
                const response = await GeneralController.storeJson(link, action.formData);
                if (response.status === 200) {
                    this.retrieveData();
                    this.addQualityModal = {
                        show: false,
                        form: [],
                    }
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
        },
        async viewObjective(data) {
            this.addQualityModal = {
                show: false,
                form: []
            }
            const response = await GeneralController.retrieveDataGet('quality-objective/view-qualityObjective?qualityObjective=' + data, 'qualityObjective')
            if (response) {
                this.addQualityModal = {
                    show: true,
                    form: response
                }
            }
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
            this.objectiveModal.isModalLoading = false
        },

    }
}

</script>