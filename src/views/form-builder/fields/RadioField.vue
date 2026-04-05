<template>
  <div>
    <label>{{ field.label }}</label>

    <v-radio-group :value="value" @change="$emit('input', $event)" :rules="rules">
      <v-radio v-for="opt in field.options" :key="opt" :label="opt" :value="opt" />
    </v-radio-group>
  </div>
</template>

<script>
export default {
  name: 'RadioField',
  props: ["value", "field"],
  computed: {
    rules() {
      return this.field.required
        ? [v => !!v || `${this.field.label} is required`]
        : [];
    }
  }
};
</script>