<template>
    <v-container fluid class="grey lighten-4 fill-height pa-0">
        <v-card>
            <v-tabs v-model="contentActive" color="success" class="px-2">
                <v-tab value="1" class="font-weight-medium">FORMS</v-tab>
                <v-tab value="2" class="font-weight-medium">FORM BUILDER</v-tab>
                <v-tab value="3" class="font-weight-medium">FORM PREVIEW</v-tab>
            </v-tabs>
            <v-window v-model="contentActive" class="pa-0">
                <v-window-item value="1">
                    <TableFormList :data="buildFormList" :headers="tableHeader" :role="1" @edit="editForm"
                        @preview="previewForm" @export="exportToJson" />
                </v-window-item>
                <v-window-item value="2">
                    <BuilderCanvas :formList="formList" :form="selectedForm" @save="saveForm" />
                </v-window-item>
                <v-window-item value="3">
                    <PreviewForm v-if="selectedForm" :formSelected="selectedForm" @store="handleFormPreviewClick" />
                </v-window-item>
            </v-window>
        </v-card>


    </v-container>
</template>

<script>
import { FormBuilderService } from "@/services/formBuilderService";
import TableFormList from "./components/TableFormList.vue";
import PreviewForm from "../reports/workspace/components/PreviewForm.vue";
import BuilderCanvas from "./components/BuilderCanvas.vue";
export default {
    name: "FormBuilder",
    components: {
        TableFormList, PreviewForm, BuilderCanvas
    },
    data: () => ({
        contentActive: "1",
        service: new FormBuilderService(),
        formList: [],
        buildFormList: [],
        tableHeader: [
            { title: 'FORM NAME', key: 'form_name', align: 'start' },
            { title: 'FORM CODE', key: 'form_code', align: 'start' },
            { title: 'ACTION', key: 'action', align: 'start' },
        ],
        selectedForm: {
            id: null,
            form_id: null,
            form_code: null,
            form_name: null,
            format_code: null,
            form_schema: []
        },
    }),
    async mounted() {
        // Example: Load existing form configuration
        const formList = await this.service.getFormList();
        this.formList = formList.formList;
        this.buildFormList = formList.buildFormList;
    },
    methods: {
        handleFormAction(formId, mode) {
            const form = this.buildFormList.find(f => f.id === formId);

            if (!form) {
                console.error(`Form not found for ${mode}:`, formId);
                return;
            }
            this.contentActive = mode === 'preview' ? "3" : "2";
            if (mode === 'edit') {
                form.form_schema = JSON.parse(form.form_schema);
            }
            this.selectedForm = form;
            console.log(`${mode} form:`, form);
        },

        previewForm(formId) {
            this.handleFormAction(formId, 'preview');
        },

        editForm(formId) {
            this.handleFormAction(formId, 'edit');
        },
        async saveForm(form) {
            const formData = new FormData();
            if (form.id) {
                formData.append('id', form.id);
            }
            formData.append('form', form.form_id);
            formData.append('form_code', form.form_code);
            formData.append('schema', JSON.stringify(form.form_schema));
            const response = await this.service.storeForm(formData);
            if (response.code === 200) {
                localStorage.removeItem("savedForm");
                this.selectedForm = {
                    id: null,
                    form_id: null,
                    form_code: null,
                    form_name: null,
                    format_code: null,
                    form_schema: []
                }
            }
            alert(response.message);
            // Logic to save the form configuration, e.g., send to API
        },
        exportToJson(formBuilderData) {
            const jsonString = JSON.stringify(formBuilderData, null, 2);
            const blob = new Blob([jsonString], {
                type: "application/json"
            });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = formBuilderData.form_code + ".json";
            link.click();

            URL.revokeObjectURL(url);
        },
        handleFormPreviewClick() {
            // Logic to handle click events in the form preview, if needed
            alert("Form preview clicked");
        }
    },


};
</script>

<style scoped>
.border-right {
    border-right: 1px solid #e0e0e0;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 300px;
    text-align: center;
}

.field-item {
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    cursor: pointer;
    border: 2px solid transparent !important;
}

.field-item:hover {
    background-color: #fafafa;
    border: 2px solid #bdbdbd !important;
}

.active-item {
    border: 2px solid #1976d2 !important;
    background-color: #e3f2fd;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
}

.title-field input {
    font-size: 1.5rem !important;
    color: #4a4a4a !important;
}
</style>