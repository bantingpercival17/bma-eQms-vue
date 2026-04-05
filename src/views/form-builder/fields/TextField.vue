<template>
    <div class="form-group">
        <label>{{ field.label }}</label>
        <v-text-field :type="field.type" :value="value" @input="$emit('input', $event)" placeholder="Enter text..."
            outlined />
    </div>
</template>

<script>
export default {
    name: 'TextField    ',
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