<template>
    <ProcedureCard :title="detailed.prodName" :version="detailed.prodVersion" class="overflow-hidden">
        <div class="form-list">
            <div v-if="detailed.fileID !== 0">
                <v-tabs v-model="tab" color="primary" class="px-6">
                    <v-tab value="one" class="font-weight-medium">VIEW</v-tab>
                    <v-tab value="two" class="font-weight-medium">LIST OF FORMS</v-tab>
                    <v-tab value="three" class="font-weight-medium">REVISION</v-tab>
                </v-tabs>
                <v-window v-model="tab">
                    <v-window-item value="one">
                        <ProcedurePDFViewer :fileID="detailed?.fileID" model="ProcedureDocuments" />
                    </v-window-item>
                    <v-window-item value="two">
                        <FormProcedure :formList="detailed.formLists" />
                    </v-window-item>
                    <v-window-item value="three">
                        <UploadProcedure :procedure="detailed?.fileID" />
                    </v-window-item>
                </v-window>
            </div>
            <div v-else class="pa-5">
                Kindly select the appropriate procedure from the provided list to proceed.
            </div>
        </div>

    </ProcedureCard>
</template>
<script>
import { defineComponent } from 'vue';
import ProcedureCard from './components/ProcedureCard.vue';
import ProcedurePDFViewer from './components/ProcedurePDFViewer.vue';
import UploadProcedure from './components/UploadProcedure.vue';
import FormProcedure from './components/FormProcedure.vue';
export default defineComponent({
    name: 'DetailedView',
    data() {

        return {
            procedureList: [],
            tab: null
        }
    },
    components: {
        ProcedureCard,
        ProcedurePDFViewer,
        UploadProcedure,
        FormProcedure
    },
    props: {
        detailed: Object
    }

})
</script>