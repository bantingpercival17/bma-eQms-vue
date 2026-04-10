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
                        <TableRequestList :data="requestList" :headers="tableHeader" :role="2"
                            @submit="storeFormResponse" />
                    </v-window-item>
                    <v-window-item value="two">
                        <p>sample</p>
                    </v-window-item>
                    <v-window-item value="three">
                        <CreateRequest :formList="formList" @store="storeFormResponse" />
                    </v-window-item>
                </v-window>
            </template>
        </v-card-text>
    </v-card>

</template>
<script>
import { FormBuilderService } from '@/services/formBuilderService';
import CreateRequest from './components/CreateRequest.vue';
import TableRequestList from './components/TableRequestList.vue';
export default {
    name: 'Workspace',
    data() {
        return {
            contentLoading: false,
            tab: 'three',
            service: new FormBuilderService(),
            formList: [],
            requestList: [],
            tableHeader: [
                { title: 'Control Number', key: 'control_number', align: 'start' },
                { title: 'Form Name', key: 'form_name', align: 'start' },
                { title: 'Status', key: 'is_approved', align: 'start' },
                { title: 'Date Created', key: 'date_created', align: 'start' },
            ]
            // Data properties for workspace can be defined here
        };
    },
    components: {
        CreateRequest, TableRequestList
        // Other components can be registered here
    },
    async mounted() {
        this.contentLoading = true;
        const formList = await this.getForm();
        this.formList = formList.formList
        this.requestList = formList.requestList
        console.log(this.formList);
        this.contentLoading = false

    },
    methods: {
        async getForm() {
            return await this.service.buildFormList()
        },
        storeFormResponse(form) {
            this.contentLoading = true;
            const formData = new FormData();
            formData.append('formId', form.formId);
            formData.append('responses', JSON.stringify(form.data));
            this.service.storeFormResponse(formData).then((res) => {
                console.log(res);
                this.contentLoading = false;
            }).catch((err) => {
                console.error(err);
                this.contentLoading = false;
            })
            console.log('Form submitted:', form);
            console.log('Form data:', form.formId);
            // Methods for handling workspace actions can be defined here
        }
    }
}
</script>