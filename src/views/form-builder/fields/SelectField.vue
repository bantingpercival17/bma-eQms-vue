<template>
    <div class="form-group">
        <label>{{ field.label }}</label>
        <v-select :items="field.options" item-title="label" :label="field.label" :value="field.options.value"
            @input="$emit('input', $event)" :rules="rules" outlined />
    </div>

</template>

<script>
export default {
    name: 'SelectField',
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