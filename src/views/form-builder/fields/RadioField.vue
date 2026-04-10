<template>
  <div class="form-group">
    <label>{{ field.label }}</label>

    <v-radio-group :model-value="modelValue" @update:modelValue="$emit('update:modelValue', $event)" :error="error"
      :error-messages="errorMessages" class="mt-2" density="comfortable" hide-details="auto">
      <v-radio v-for="(option, index) in field.options" :key="index" :label="option" :value="option"
        color="primary" />
    </v-radio-group>
  </div>
</template>

<script>
export default {
  name: 'RadioField',
  props: {
    modelValue: [String, Number],
    field: Object, // expects: { label, options: [{label, value}] }
    error: Boolean,
    errorMessages: String
  }
};
</script>