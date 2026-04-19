<template>
    <v-card variant="outlined" elevation="0" class="bg-surface mb-5" rounded="lg">
        <v-card-item>
            <div class="d-flex justify-space-between align-center">
                <v-card-title class="text-h4">Workspace</v-card-title>
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
                <v-tabs v-model="tab" color="success" class="px-6">
                    <v-tab value="one" class="font-weight-medium">MY REQUESTS</v-tab>
                    <v-tab value="two" class="font-weight-medium">SUBMISSIONS</v-tab>
                    <v-tab value="three" class="font-weight-medium">CREATE REQUEST</v-tab>
                </v-tabs>
                <v-window v-model="tab" class="pa-0">
                    <v-window-item value="one">
                        <TableRequestList :data="requestList" :headers="tableHeader" @edit="editFormSelected"
                            @removed="removeFormResponse" @view="viewRequest" />
                    </v-window-item>
                    <v-window-item value="two">
                        <p>sample</p>
                    </v-window-item>
                    <v-window-item value="three">
                        <CreateRequest :formList="formList" @store="storeFormResponse" :formEdit="formSelected" />
                    </v-window-item>
                </v-window>
            </template>
        </v-card-text>
    </v-card>
    <ModalFormEdit v-if="formSelected" v-model="openModel" :formSelected="formSelected" @update="updateFormResponse" />
    <ViewRequest v-if="formPreview" v-model="openRequestModal" :preview="formPreview" />
</template>
<script>
import AlertService from '@/services/alertService';
import CreateRequest from './components/CreateRequest.vue';
import ModalFormEdit from './components/ModalFormEdit.vue';
import TableRequestList from './components/TableRequestList.vue';
import { FormResponseService } from '@/services/formResponseService';
import ViewRequest from './components/ViewRequest.vue';
export default {
    name: 'Workspace',
    data() {
        return {
            openModel: false,
            openRequestModal: false,
            contentLoading: false,
            tab: 'three',
            service: new FormResponseService(),
            formList: [],
            requestList: [],
            tableHeader: [
                { title: 'Control Number', key: 'control_number', align: 'start' },
                { title: 'Form Name', key: 'form_name', align: 'start' },
                { title: 'Status', key: 'status', align: 'start' },
                { title: 'Date Created', key: 'created_at', align: 'start' },
            ],
            formSelected: null,
            formPreview: null
            // Data properties for workspace can be defined here
        };
    },
    components: {
        CreateRequest, TableRequestList, ModalFormEdit, ViewRequest
        // Other components can be registered here
    },
    async mounted() {
        this.contentLoading = true;
        const formList = await this.getForm();
        this.contentLoading = false

    },
    methods: {
        async getForm() {
            const formList = await this.service.getFormList()
            this.formList = formList.formList
            this.requestList = formList.requestList
            if (formList.requestList.length > 0) {
                this.tab = 'one'
            }
        },
        async storeFormResponse(form) {
            this.contentLoading = true;
            const formData = new FormData();
            formData.append('formId', form.formId);
            formData.append('responses', JSON.stringify(form.data));
            const result = await AlertService.confirm('Save this Request?')
            if (result.isConfirmed) {

                this.service.storeFormResponse(formData).then((res) => {
                    console.log(res);
                    this.getForm()
                    this.contentLoading = false;
                    AlertService.success('Saved Successfully')
                }).catch((err) => {
                    console.error(err);
                    this.contentLoading = false;
                })
            }
            // Methods for handling workspace actions can be defined here
        },
        editFormSelected(form) {
            this.formSelected = form
            console.log(form)
            this.openModel = true
        },
        async updateFormResponse(form) {
            this.contentLoading = true;
            const formData = new FormData();
            formData.append('response', form.response);
            formData.append('responses', JSON.stringify(form.data));
            const result = await AlertService.confirm('Updated this Request?')
            if (result.isConfirmed) {

                this.service.updateFormResponse(formData).then((res) => {
                    console.log(res);
                    this.getForm()
                    this.contentLoading = false;
                    AlertService.success('Updated Successfully')
                }).catch((err) => {
                    console.error(err);
                    AlertService.error(err, 'Update Error')
                    this.contentLoading = false;
                })
            } else {
                this.formSelected = form
                console.log(form)
                this.openModel = true
            }
        },
        async removeFormResponse(response) {
            const formData = new FormData();
            formData.append('response', response.id);
            const result = await AlertService.confirm('Removed this Request?')
            if (result.isConfirmed) {
                this.contentLoading = true;
                this.service.removeFormResponse(formData).then((res) => {
                    console.log(res);
                    this.getForm()
                    this.contentLoading = false;
                    AlertService.success('Updated Successfully')
                }).catch((err) => {
                    console.error(err);
                    AlertService.error(err.error.message, 'Update Error')
                    this.contentLoading = false;
                })
            }
        },
        async viewRequest(response) {
            await this.service.viewResponsePdf(response.id)
                .then((blob) => {
                    const url = URL.createObjectURL(blob);
                    this.openRequestModal = true
                    this.formPreview = {
                        pdfLink: url,
                        control: false
                    }
                });
            console.log(this.formPreview)

        }
    }
}
</script>