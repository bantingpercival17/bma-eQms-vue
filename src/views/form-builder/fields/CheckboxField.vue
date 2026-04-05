<template>
    <div>
        <label>{{ field.label }}</label>

        <v-checkbox v-for="opt in field.options" :key="opt" :label="opt" :value="opt" :input-value="value.includes(opt)"
            @change="toggle(opt)" />
    </div>
</template>

<script>
export default {
    name: 'CheckboxField',
    props: ["value", "field"],
    methods: {
        toggle(option) {
            const newValue = [...this.value];

            if (newValue.includes(option)) {
                this.$emit(
                    "input",
                    newValue.filter(v => v !== option)
                );
            } else {
                newValue.push(option);
                this.$emit("input", newValue);
            }
        }
    }
};
</script>