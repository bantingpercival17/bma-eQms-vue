<template>
    <v-card-title class="text-h5">
        {{ formSelected.form_name }}
    </v-card-title>

    <v-card-text class="d-flex flex-column gap-4">
        <div v-for="field in parsedSchema" :key="field.id">
            <component class="mb-3" :is="resolveComponent(field.type)" v-model="formData[field.model]" :field="field"
                :error="hasError(field)" :error-messages="getErrorMessage(field)" />
        </div>
    </v-card-text>

    <v-card-actions>
        <v-spacer />
        <v-btn text @click="resetForm">Cancel</v-btn>
        <v-btn color="primary" @click="submitForm">Submit</v-btn>
    </v-card-actions>
</template>
<script>
import CheckboxField from '@/views/form-builder/fields/CheckboxField.vue';
import RadioField from '@/views/form-builder/fields/RadioField.vue';
import SelectField from '@/views/form-builder/fields/SelectField.vue';
import TextField from '@/views/form-builder/fields/TextField.vue';
export default {
    name: 'PreviewForm',
    components: {
        TextField,
        SelectField,
        RadioField,
        CheckboxField
    },
    props: {
        formSelected: {
            type: Object,
            required: true
        }
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
                console.error('Invalid schema JSON:', e);
                return [];
            }
        },
    },
    created() {
        this.parsedSchema.forEach(field => {
            this.formData[field.model] = ''; // ✅ important
        });
    },
    methods: {
        resolveComponent(type) {
            return {
                text: TextField,
                select: SelectField,
                radio: RadioField,
                checkbox: CheckboxField,
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
            this.$emit('store', {
                formId: this.formSelected.id,
                data: this.formData
            });

            // this.resetForm();
        },

        resetForm() {
            this.formSelected = null;
            this.formData = {};
            this.errors = {};
        }
    },
    emits: ['store']

}
</script>