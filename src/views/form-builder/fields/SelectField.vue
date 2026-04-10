<template>
    <div class="form-group">
        <label>{{ field.label }}</label>

        <v-select :model-value="modelValue" @update:modelValue="$emit('update:modelValue', $event)"
            :items="field.options" :item-title="field.itemTitle || 'label'" :item-value="field.itemValue || 'value'"
            :error="error" :error-messages="errorMessages" class="mt-2" density="comfortable" hide-details="auto"
            variant="outlined" color="primary" />
    </div>
</template>

<script>
export default {
    name: 'SelectField',
    props: {
        modelValue: [String, Number, Object],
        field: Object, // expects: { label, options: [{label, value}] }
        error: Boolean,
        errorMessages: String
    }
};
</script>