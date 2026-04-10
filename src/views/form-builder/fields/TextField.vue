<template>
    <div class="form-group">
        <label>{{ field.label }}</label>

        <v-text-field :model-value="modelValue" @update:modelValue="$emit('update:modelValue', $event)" :error="error"
            :error-messages="errorMessages" :type="field.type" class="mt-2" density="comfortable" hide-details="auto"
            variant="outlined" color="primary" />
    </div>
</template>

<script>
export default {
    name: 'TextField',
    props: {
        modelValue: [String, Number], // ✅ REQUIRED
        field: Object,
        error: Boolean,
        errorMessages: String
    }
};
</script>