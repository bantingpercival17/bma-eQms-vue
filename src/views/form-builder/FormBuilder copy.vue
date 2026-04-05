<template>
    <v-container>
        <v-card class="pa-4" outlined>
            <v-card-title class="d-flex justify-space-between">
                Form Builder

                <v-btn small @click="preview = !preview">
                    {{ preview ? "Edit Mode" : "Preview Mode" }}
                </v-btn>
            </v-card-title>

            <!-- FORM NAME -->


            <!-- BUILDER MODE -->
            <div v-if="!preview">
                <v-text-field v-model="form.name" label="Form Name" outlined />
                <v-card v-for="(field, index) in form.schema" :key="field.model" class="pa-3 mb-3" outlined>
                    <v-row>
                        <v-col cols="12" md="3">
                            <v-text-field v-model="field.label" label="Label" outlined />
                        </v-col>

                        <v-col cols="12" md="3">
                            <v-select v-model="field.type" :items="fieldTypes" label="Type" outlined />
                        </v-col>

                        <v-col cols="12" md="2">
                            <v-checkbox v-model="field.required" label="Required" />
                        </v-col>

                        <v-col cols="12" md="2">
                            <v-btn color="red" small @click="removeField(index)">
                                Remove
                            </v-btn>
                        </v-col>
                    </v-row>

                    <!-- OPTIONS (only for select/radio/checkbox) -->
                    <div v-if="hasOptions(field.type)">
                        <v-text-field v-for="(opt, i) in field.options" :key="i" v-model="field.options[i]"
                            label="Option" class="mb-2" outlined />

                        <v-btn small @click="addOption(field)">
                            + Add Option
                        </v-btn>
                    </div>
                </v-card>

                <v-btn color="primary" @click="addField">
                    + Add Field
                </v-btn>

                <v-btn color="success" class="ml-2" @click="saveForm">
                    Save Form
                </v-btn>
            </div>

            <!-- PREVIEW MODE -->
            <div v-else>
                <FormPreview :form="form" />
            </div>
        </v-card>
    </v-container>
</template>

<script>
//import api from "../services/api";
import FormPreview from "./FormPreview.vue";

export default {
    components: { FormPreview },

    data() {
        return {
            preview: false,
            form: {
                name: "",
                schema: []
            },
            fieldTypes: ["text", "email", "select", "radio", "checkbox"],
        };
    },

    methods: {
        addField() {
            this.form.schema.push({
                type: "text",
                label: "",
                model: "field_" + Date.now(),
                required: false,
                options: []
            });
        },

        removeField(index) {
            this.form.schema.splice(index, 1);
        },

        hasOptions(type) {
            return ["select", "radio", "checkbox"].includes(type);
        },

        addOption(field) {
            if (!field.options) field.options = [];
            field.options.push("New Option");
        },

        async saveForm() {
            //await api.createForm(this.form);
            alert("Saved!");
            console.log(this.form);
        }
    }
};
</script>