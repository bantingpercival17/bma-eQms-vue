<template>
    <div class="p-4">
        <h2 class="text-xl font-bold mb-4">Pending Approvals</h2>
        <ul>
            <li v-for="form in pendingForms" :key="form.id">
                {{ form.title }} - <button class="btn" @click="review(form.id)">Review</button>
            </li>
        </ul>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
const pendingForms = ref([])
const review = (id) => console.log('Review form:', id)
onMounted(() => {
    pendingForms.value = [
        { id: 3, title: 'Procedure C' },
    ]
})
</script>