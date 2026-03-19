<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import UiParentCard from '../shared/UiParentCard.vue';

export default defineComponent({
    name: 'Announcement',
    components: {
        UiParentCard
    },
    props: {
        title: {
            type: String,
            required: true,
        },
        date: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        link: {
            type: [String, Object] as PropType<string | Record<string, any> | null>,
            default: null,
        },
        linkText: {
            type: String,
            default: 'View Details',
        },
    },
});
</script>

<template>
    <v-col cols="12" md="12">
        <UiParentCard :title="title">
            {{ description }}
        </UiParentCard>
    </v-col>
    <!-- <div class="announcement-item">
        <h3 class="announcement-title">{{ title }}</h3>
        <p class="announcement-date">{{ date }}</p>
        <p class="announcement-description">{{ description }}</p>
        <router-link v-if="link" :to="link" class="announcement-link">
            {{ linkText || 'Learn More' }}
        </router-link>
    </div> -->
</template>

<style scoped>
/* ... (same styles as before) ... */
</style>