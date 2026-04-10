<template>
    <div>
        <label class="mb-2 d-block">{{ field.label }}</label>

        <v-checkbox v-for="opt in field.options" :key="opt" :label="opt" :value="opt" v-model="internalValue"
            :error="error" />

        <div v-if="error" class="text-error text-caption">
            {{ errorMessages }}
        </div>
    </div>
</template>

<script>
export default {
    name: 'CheckboxField',
    props: {
        modelValue: Array,
        field: Object,
        error: Boolean,
        errorMessages: String
    },

    emits: ['update:modelValue'],

    computed: {
        internalValue: {
            get() {
                return this.modelValue || [];
            },
            set(val) {
                this.$emit('update:modelValue', val);
            }
        }
    }
};
</script>