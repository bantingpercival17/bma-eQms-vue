<!-- src/App.vue -->

<template>
  <div style="height: 100vh;">
    <VueformBuilder v-model="formSchema" />
  </div>
    <button @click="saveForm">Save Form Schema</button>
</template>
<script>
export default {
  name: 'FormView',
  data() {
    return {
      formSchema: null
    };
  },
  methods: {
    saveForm() {
      // Save the JSON schema to backend or local storage
      localStorage.setItem('savedForm', JSON.stringify(this.formSchema))
      alert('Form saved!')
    }
  }
};
</script>
