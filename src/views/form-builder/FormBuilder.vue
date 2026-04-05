<template>
    <v-container fluid class="grey lighten-4 fill-height pa-0">
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
                <v-card class="pa-6">
                    <v-autocomplete class="mb-3" v-model="form.form" :items="getFormList" item-title="form_name"
                        item-value="id" label="Search Forms" prepend-inner-icon="mdi-magnify" variant="outlined"
                        color="primary" clearable return-object hint="Start typing a Form name like 'OD-01' or 'OFC-01'"
                        persistent-hint>
                        <!-- Customizing how items look in the dropdown -->
                        <template v-slot:item="{ props, item }">
                            <v-list-item v-bind="props" :subtitle="item.raw.form_code"></v-list-item>
                        </template>
                    </v-autocomplete>
                    <v-btn color="secondary" class="me-2" @click="viewForm" v-if="form.form">
                        Open PDF Form
                    </v-btn>
                    <v-btn color="primary" depressed @click="saveForm" :disabled="form.schema.length === 0">
                        Save Form
                    </v-btn>
                </v-card>
                <br>
                <v-card flat class="mx-auto" max-width="800" min-height="80vh">
                    <v-card-text class="pa-8">
                        <div v-if="form.schema.length === 0" class="empty-state">
                            <v-icon size="64" color="grey lighten-2">mdi-form-select</v-icon>
                            <p class="grey--text">Click a component on the left to start building your form.</p>
                        </div>
                        <div v-for="(field, index) in form.schema" :key="field.model"
                            :class="{ 'active-item': activeIndex === index }" outlined @click="activeIndex = index">
                            <component :is="resolveComponent(field.inputType)" v-model="field.model" :field="field" />
                        </div>
                        <!-- <v-card v-for="(field, index) in form.schema" :key="field.id" class="mb-4 field-item"
                            :class="{ 'active-item': activeIndex === index }" outlined @click="activeIndex = index">

                            <v-card-text class="d-flex align-center">
                                <div class="mr-4">
                                    <v-icon color="grey darken-1">{{ getIcon(field.type) }}</v-icon>
                                </div>
                                <div>
                                    <div class="text-subtitle-2">{{ field.label || 'Unnamed Field' }}</div>
                                    <div class="text-caption grey--text">{{ field.type.toUpperCase() }}</div>
                                </div>
                                <v-spacer></v-spacer>
                                <v-btn icon color="red lighten-2" @click.stop="removeField(index)">
                                    <v-icon small>mdi-delete-outline</v-icon>
                                </v-btn>
                            </v-card-text>
                        </v-card> -->
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
    </v-container>
    <FormModalView v-if="form.form" v-model="openModel" :formDetails="formInfo" />
</template>

<script>
import TextField from "./fields/TextField.vue";
import SelectField from "./fields/SelectField.vue";
import RadioField from "./fields/RadioField.vue";
import CheckboxField from "./fields/CheckboxField.vue";
import { FormBuilderService } from "@/services/formBuilderService";
import { GeneralController } from "@/stores/GeneralController";
import FormModalView from "../qms/procedure/widgets/FormModalView.vue";
export default {
    name: "FormBuilder",
    components: {
        TextField,
        SelectField,
        RadioField,
        CheckboxField,
        FormModalView
    },
    data: () => ({
        openModel: false,
        formInfo: {
            isModalLoading: true,
            content: [],
            link: null
        },
        activeIndex: null,
        form: { form: null, schema: [] },
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
        service: new FormBuilderService(),
        getFormList: []
    }),
    computed: {
        activeField() {
            return this.activeIndex !== null ? this.form.schema[this.activeIndex] : null;
        }
    },
    async mounted() {
        // Example: Load existing form configuration
        const formList = await this.service.getFormList();
        this.getFormList = formList.formList;
        const savedForm = localStorage.getItem("savedForm");
        if (savedForm) {
            this.form = JSON.parse(savedForm);
        }
    },
    methods: {
        addField(template) {
            const field = {
                id: "f_" + Date.now(),
                inputType: template.inputType,
                type: template.type,
                label: template.label,
                model: "field_" + Date.now(),
                required: false,
                options: this.hasOptions(template.type) ? ["Option 1"] : null
            };
            this.form.schema.push(field);
            this.activeIndex = this.form.schema.length - 1;
            console.log("Added field:", field);
        },
        removeField(idx) {
            this.form.schema.splice(idx, 1);
            this.activeIndex = null;
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
        async saveForm() {

            localStorage.setItem("savedForm", JSON.stringify(this.form));
            const formData = new FormData();
            formData.append('form', JSON.stringify(this.form.form));
            formData.append('schema', JSON.stringify(this.form.schema));
            const response = await this.service.storeForm(formData);
            if (response.code === 200) {
                localStorage.removeItem("savedForm");
            }
            alert("Form Configuration Saved!");
            console.log(response);
        },
        resolveComponent(type) {
            return {
                text: "TextField",
                email: "EmailField",
                select: "SelectField",
                radio: "RadioField",
                checkbox: "CheckboxField"
            }[type];
        },
        async viewForm() {
            this.openModel = true
            if (this.formInfo.link === null || this.formInfo.content.id !== this.form.form.id) {
                const formID = this.encrypt(this.form.form.id)
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


            console.log(this.formInfo)
        },
        encrypt(data) {
            return btoa(data)
        },
    }
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