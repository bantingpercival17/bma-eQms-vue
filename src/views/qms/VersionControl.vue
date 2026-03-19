<template>
    <CardHeader title="VERSION CONTROLS" class="overflow-hidden">
        <div class="">
            <template v-if="contentLoading">
                <div class="d-flex justify-center align-center pa-5">
                    <img src="@/assets/images/loading.gif" alt="Loading" />
                </div>

            </template>
            <template v-else>
                <v-tabs v-model="tab" color="success" class="px-6">
                    <v-tab value="one" class="font-weight-medium">PROCEDURES</v-tab>
                    <v-tab value="two" class="font-weight-medium">FORMS</v-tab>

                </v-tabs>
                <v-window v-model="tab">
                    <v-window-item value="one">
                        <VersionTableList :headers="procedureHeader" :revisions="procedureVersionList" />
                    </v-window-item>
                    <v-window-item value="two">
                        <VersionTableList :headers="formHeader" :revisions="formVersionList" />
                    </v-window-item>

                </v-window>
            </template>

        </div>
    </CardHeader>
</template>
<script>
import CardHeader from '@/components/shared/CardHeader.vue';
import { defineComponent } from 'vue';
import VersionTableList from './versionControl/VersionTableList.vue';
import { GeneralController } from '@/stores/GeneralController';

export default defineComponent({
    name: 'VersionControl',
    data() {
        const formHeader = [
            { text: 'Form Name', value: 'formName' },
            { text: 'Who Updated', value: 'updatedBy' },
            { text: 'When', value: 'updatedAt' },
            { text: 'Description of Change', value: 'description' },
        ]
        const procedureHeader = [
            { text: 'Procedure', value: 'formName' },
            { text: 'Who Updated', value: 'updatedBy' },
            { text: 'When', value: 'updatedAt' },
            { text: 'Description of Change', value: 'description' },
        ]
        return {
            tab: null,
            contentLoading: true,
            formVersionList: [],
            procedureVersionList: [],
            formHeader,
            procedureHeader
        }
    },
    components: {
        CardHeader, VersionTableList
    },
    async mounted() {
        const procedureVersion = await GeneralController.retrieveData('procedure/version-control', { search: null }, 'version');
        const formVersion = await GeneralController.retrieveData('forms/version-control', { search: null }, 'version');

        if (formVersion && procedureVersion) {
            this.procedureVersionList = procedureVersion;
            this.formVersionList = formVersion;
            this.contentLoading = false
        }
    }
})
</script>