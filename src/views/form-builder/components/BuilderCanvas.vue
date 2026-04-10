<template>
    <v-row no-gutters class="fill-height">

        <v-col cols="2" md="2" class="white elevation-1 border-right">
            <div class="pa-4">
                <h3 class="text-subtitle-1 font-weight-bold mb-4">🧩 Toolbox</h3>

                <p class="text-caption grey--text font-weight-bold">BASIC INPUTS</p>
                <v-btn v-for="item in basicTypes" :key="item.type" block outlined color="primary"
                    class="mb-2 justify-start text-none" @click="addField(item)">
                    <v-icon left small>{{ item.icon }}</v-icon>
                    {{ item.label }}
                </v-btn>

                <p class="text-caption grey--text font-weight-bold mt-4">SELECTION</p>
                <v-btn v-for="item in selectionTypes" :key="item.type" block outlined color="secondary"
                    class="mb-2 justify-start text-none" @click="addField(item)">
                    <v-icon left small>{{ item.icon }}</v-icon>
                    {{ item.label }}
                </v-btn>
            </div>
        </v-col>

        <v-col cols="7" md="7" class="pa-4">
            <v-card class="pa-6 justify-center align-center" outlined>
                <v-row>
                    <v-col>
                        <v-autocomplete class="mb-3" v-model="selectedForm" :items="formList" item-title="form_name"
                            item-value="id" label="Search Forms" prepend-inner-icon="mdi-magnify" variant="outlined"
                            color="primary" clearable return-object
                            hint="Start typing a Form name like 'OD-01' or 'OFC-01'" persistent-hint>
                            <template v-slot:item="{ props, item }">
                                <v-list-item v-bind="props" @click="onFormChange(item)"
                                    :subtitle="item.raw.form_code"></v-list-item>
                            </template>
                        </v-autocomplete>
                    </v-col>
                    <v-col v-if="form?.form_id" cols="2">
                        <v-btn color="secondary" class="me-2" @click="viewForm">
                            PDF Form
                        </v-btn>
                    </v-col>
                    <v-col cols="2">
                        <v-btn color="info" class="me-2" @click="uploadModal = true">
                            IMPORT
                        </v-btn>
                    </v-col>
                </v-row>



            </v-card>
            <br>
            <v-card class="pa-1" outlined>
                <v-card-title class="text-h5">
                    {{ form?.form_name }}
                </v-card-title>
                <v-card-text class="pa-1">
                    <div v-if="form?.form_schema?.length === 0"
                        class="empty-state d-flex flex-column align-center justify-center">
                        <v-icon size="64" color="grey lighten-2">mdi-form-select</v-icon>
                        <p class="grey--text">Click a component on the left to start building your form.
                        </p>
                    </div>
                    <template v-else>
                        <div v-for="(field, index) in form?.form_schema" :key="field.model" class="mt-2"
                            :class="{ 'active-item': activeIndex === index }" outlined @click="activeIndex = index">
                            <component :is="resolveComponent(field.inputType)" v-model="field.model" :field="field" />
                        </div>
                        <v-btn class="mt-4 text-end" color="primary" depressed @click="saveForm"
                            :disabled="form?.form_schema.length === 0">
                            Save Form
                        </v-btn>
                        <v-btn class="mt-4 ms-3 text-end" variant="outlined" @click="resetForm">
                            CLEAR FORMS <v-icon small>mdi-delete-outline</v-icon>
                        </v-btn>
                    </template>

                </v-card-text>
            </v-card>

        </v-col>
        <v-col cols="3" md="3" class="white elevation-1">
            <div class="pa-4">
                <h3 class="text-subtitle-1 font-weight-bold mb-4">⚙️ Properties</h3>

                <div v-if="activeField">
                    <v-label class="mb-5">Input Type: <br>
                        <b class="text-primary fw-bolder">
                            {{ activeField.inputType.toUpperCase() }}
                        </b>
                    </v-label>
                    <v-text-field v-model="activeField.model" label="Field Name" variant="outlined" dense
                        class="mb-2" />
                    <v-text-field v-model="activeField.label" label="Label Name" variant="outlined" dense
                        class="mb-2" />



                    <p class="text-caption font-weight-bold">VALIDATION</p>
                    <v-switch v-model="activeField.required" label="Required" dense color="primary" />

                    <div v-if="hasOptions(activeField.type)">
                        <v-divider class="my-4"></v-divider>
                        <p class="text-caption font-weight-bold">OPTIONS</p>
                        <div v-for="(opt, i) in activeField.options" :key="i" class="d-flex align-center mb-2">
                            <v-text-field v-model="activeField.options[i]" dense hide-details outlined class="mr-2"
                                placeholder="New Option" />
                            <v-btn icon x-small @click="activeField.options.splice(i, 1)">
                                <v-icon color="red">mdi-close</v-icon>
                            </v-btn>
                        </div>
                        <v-btn text small color="primary" @click="addOption(activeField)">
                            + Add Option
                        </v-btn>
                    </div>
                    <v-divider class="my-4"></v-divider>
                    <v-btn class="w-100" color="red lighten-2" @click.stop="removeField(activeField.id)">
                        REMOVE <v-icon small>mdi-delete-outline</v-icon>
                    </v-btn>
                </div>

                <div v-else class="text-center py-10 grey--text">
                    <v-icon large class="mb-2">mdi-cursor-default-click</v-icon>
                    <p>Select a field to edit its settings</p>
                </div>
            </div>
        </v-col>
    </v-row>
    <FormModalView v-if="form.form_id" v-model="openModel" :formDetails="formInfo" />
    <v-dialog v-model="uploadModal" max-width="300">
        <v-card>

            <!-- Header -->
            <v-card-title class="text-h5 d-flex align-center">
                FORM INFORMATION
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="uploadModal = false">
                    Close
                </v-btn>
            </v-card-title>

            <!-- Body -->
            <v-card-text>

                <!-- ✅ Correct File Input -->
                <v-file-input v-model="file" label="Upload JSON File" accept=".json" prepend-icon="mdi-file"
                    @update:modelValue="handleFileUpload" />

                <!-- File Name -->
                <p v-if="fileName">File: {{ fileName }}</p>


            </v-card-text>

        </v-card>
    </v-dialog>
</template>
<script>

import SelectField from "../fields/SelectField.vue";
import RadioField from "../fields/RadioField.vue";
import CheckboxField from "../fields/CheckboxField.vue";
import TextField from "../fields/TextField.vue";
import FormModalView from "@/views/qms/procedure/widgets/FormModalView.vue";
import { GeneralController } from "@/stores/GeneralController";
export default {
    name: 'BuilderCanvas',
    components: {
        TextField,
        SelectField,
        RadioField,
        CheckboxField,
        FormModalView
    },
    props: {
        formList: {
            type: Array,
            required: true
        },
        form: {
            type: Object,
            default: () => ({
                form_id: null,
                form_schema: []
            })
        }
    },
    data() {
        return {
            activeIndex: null,
            selectedForm: null,
            basicTypes: [
                { inputType: "text", type: "text", label: "Text Input", icon: "mdi-form-textbox" },
                { inputType: "text", type: "textarea", label: "Textarea", icon: "mdi-text-box-outline" },
                { inputType: "text", type: "number", label: "Number Input", icon: "mdi-numeric" },
                { inputType: "text", type: "date", label: "Date Picker", icon: "mdi-calendar" },
                { inputType: "text", type: "time", label: "Time Picker", icon: "mdi-clock-outline" }
            ],
            selectionTypes: [
                { inputType: "checkbox", type: "checkbox", label: "Checkbox Group", icon: "mdi-checkbox-marked-outline" },
                { inputType: "radio", type: "radio", label: "Radio Group", icon: "mdi-radiobox-marked" },
                { inputType: "select", type: "select", label: "Select Dropdown", icon: "mdi-menu-down-outline" }
            ],
            formInfo: {
                isModalLoading: true,
                content: [],
                link: null
            },
            openModel: false,
            uploadModal: false,
            file: null,
            fileName: "",
        }
    },
    computed: {
        activeField() {
            return this.activeIndex !== null ? this.form.form_schema[this.activeIndex] : null;
        }
    },
    methods: {
        resolveComponent(type) {
            return {
                text: "TextField",
                select: "SelectField",
                radio: "RadioField",
                checkbox: "CheckboxField"
            }[type];
        },
        onFormChange(item) {
            console.log("Selected form:", item);
            this.form.form_name = item.title
            this.form.form_id = item.value
            this.form.form_code = item.raw.form_code
            console.log(this.form)
        },
        addField(item) {
            const hasOptions = ["checkbox", "radio", "select"].includes(item.type);

            const newField = {
                inputType: item.inputType,
                type: item.type,
                label: `${item.label} ${this.form.form_schema.length + 1}`,
                model: `field_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                options: hasOptions
                    ? [
                        { label: "Option 1", value: "option_1" },
                        { label: "Option 2", value: "option_2" }
                    ]
                    : []
            };

            this.form.form_schema.push(newField);
            this.activeIndex = this.form.form_schema.length + 1;
            localStorage.setItem("savedForm", JSON.stringify(this.form));
        },
        removeField(idx) {
            this.form.schema.splice(idx, 1);
            this.activeIndex = null;
            localStorage.setItem("savedForm", JSON.stringify(this.form));
        },
        hasOptions(type) {
            return ["select", "radio", "checkbox"].includes(type);
        },
        addOption(field) {
            field.options.push("");
        },
        getIcon(type) {
            const all = [...this.basicTypes, ...this.selectionTypes];
            return all.find(i => i.type === type)?.icon || 'mdi-help-circle';
        },
        saveForm() {
            console.log("Saving form:", this.form);
            this.$emit('save', this.form);
        },
        async viewForm() {
            this.openModel = true
            if (this.formInfo.link === null || this.formInfo.content.id !== this.form.form_id) {
                const formID = this.encrypt(this.form.form_id)
                const response = await GeneralController.retrieveGetFile('forms/view?link=' + formID);
                const blob = new Blob([response], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                const formDetails = await GeneralController.retrieveData('forms/retrieve', { form: formID }, 'form')
                this.formInfo = {
                    content: formDetails,
                    link: url,
                    isModalLoading: false,
                }
            } else {
                this.formInfo.isModalLoading = false
            }
        },
        resetForm() {
            this.form.form_schema = [];
            this.activeIndex = null;
        },
        encrypt(data) {
            return btoa(data)
        },
        handleFileUpload(value) {
            // Handle File or File[]
            const file = Array.isArray(value) ? value[0] : value;

            if (!file) return;

            this.fileName = file.name || "Uploaded file";
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    let jsonData = JSON.parse(e.target.result);
                    console.log("Parsed JSON:", jsonData);

                    this.form.form_schema = JSON.parse(jsonData.form_schema);
                    this.form.form_id = jsonData.form_id;
                    this.form.form_code = jsonData.form_code;
                    this.form.form_name = jsonData.form_name;
                } catch (error) {
                    alert("Invalid JSON file" + error);
                    console.error(error);
                }
            };

            reader.readAsText(file);
            this.uploadModal = false;
        }
    },
    emits: ['save']
}
</script>