<template>
    <div>
        <h3 class="mb-3">{{ form.name }}</h3>

        <v-form>
            <div v-for="field in form.schema" :key="field.model">
                <component :is="resolveComponent(field.type)" v-model="formData[field.model]" :field="field" />
            </div>

            <v-btn color="primary" block class="mt-3">
                Submit (Preview Only)
            </v-btn>
        </v-form>
    </div>
</template>

<script>
import TextField from "./fields/TextField.vue";
/* import EmailField from "./fields/EmailField.vue"; */
import SelectField from "./fields/SelectField.vue";
import RadioField from "./fields/RadioField.vue";
import CheckboxField from "./fields/CheckboxField.vue";

export default {
    props: ["form"],

    components: {
        TextField,
        /* EmailField, */
        SelectField,
        RadioField,
        CheckboxField
    },

    data() {
        return {
            formData: {}
        };
    },

    created() {
        this.form.schema.forEach(f => {
            this.$set(this.formData, f.model, f.type === "checkbox" ? [] : "");
        });
    },

    methods: {
        resolveComponent(type) {
            return {
                text: "TextField",
                email: "EmailField",
                select: "SelectField",
                radio: "RadioField",
                checkbox: "CheckboxField"
            }[type];
        }
    }
};
</script>