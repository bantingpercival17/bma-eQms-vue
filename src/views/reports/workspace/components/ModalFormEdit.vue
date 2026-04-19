<template>
    <v-dialog :model-value="modelValue" @update:model-value="formModalClose" max-width="500">
        <v-card>
            <!-- Header -->
            <v-card-title class="text-h5 d-flex align-center">
                <v-card-title class="text-h5">
                    {{ formSelected.form_name }}
                </v-card-title>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="formModalClose">
                    Close
                </v-btn>
            </v-card-title>
            <v-card-text class="d-flex flex-column gap-4">
                <div v-for="field in parsedSchema" :key="field.id">
                    <component class="mb-3" :is="resolveComponent(field.type)" v-model="formData[field.model]"
                        :field="field" :error="hasError(field)" :error-messages="getErrorMessage(field)" />
                </div>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn text @click="formModalClose">Cancel</v-btn>
                <v-btn color="primary" @click="submitForm">Update</v-btn>
            </v-card-actions>

        </v-card>
    </v-dialog>

</template>
<script>
import CheckboxField from '@/views/form-builder/fields/CheckboxField.vue';
import RadioField from '@/views/form-builder/fields/RadioField.vue';
import SelectField from '@/views/form-builder/fields/SelectField.vue';
import TableField from '@/views/form-builder/fields/TableField.vue';
import TextField from '@/views/form-builder/fields/TextField.vue';
export default {
    name: 'ModalFormEdit',
    components: {
        TextField,
        SelectField,
        RadioField,
        CheckboxField, TableField
    },
    props: {
        formSelected: {
            type: Object,
            required: true
        },
        modelValue: {
            type: Boolean,
            required: true,
        },
    },
    data() {
        return {
            formData: {},
            errors: {}
        };
    },
    computed: {
        parsedSchema() {
            if (!this.formSelected) return [];

            try {
                return JSON.parse(this.formSelected.form_schema);
            } catch (e) {
                return this.formSelected.form_schema;
                console.log('Invalid schema JSON:', e);
            }
        },
    },
    created() {
        this.parsedSchema.forEach(field => {
            if (field.type === 'table') {
                this.formData['table'] = [];

            } else {
                const data = this.formSelected.answers.find(ans => ans.field_key === field.model)
                console.log(data.field_value)
                this.formData[field.model] = data.field_value;
            }
        });
    },
    emits: ['update:modelValue', 'update'],
    methods: {
        resolveComponent(type) {
            return {
                text: TextField,
                select: SelectField,
                radio: RadioField,
                checkbox: CheckboxField,
                table: TableField,
                date: TextField // fallback for date if using same component
            }[type] || TextField;
        },
        validateForm() {
            const newErrors = {};
            this.parsedSchema.forEach(field => {
                if (field.required && !this.formData[field.model]) {
                    newErrors[field.model] = `${field.label} is required`;
                }
            });
            this.errors = newErrors;
            return Object.keys(newErrors).length === 0;
        },

        hasError(field) {
            return !!this.errors[field.model];
        },

        getErrorMessage(field) {
            return this.errors[field.model] || '';
        },

        submitForm() {
            if (!this.validateForm()) return;
            console.log('Submitting form with data:', this.formData);
            this.$emit('update', {
                data: this.formData,
                response: this.formSelected.id
            });
            this.$emit('update:modelValue', false);
            // this.resetForm();
        },

        resetForm() {
            this.formSelected = null;
            this.formData = {};
            this.errors = {};
        },
        formModalClose() {
            this.$emit('update:modelValue', false);
        },
    }

}
</script>