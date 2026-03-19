<template>
    <v-card variant="outlined" elevation="0" class="bg-surface me-3" rounded="lg">
        <router-link :to="to" style="text-decoration: none;">
            <v-card-text class="d-flex justify-content-between text-success">
                <v-avatar variant="tonal" color="primary" rounded="md">
                    <div class="icon">{{ icon }}</div>
                </v-avatar>
                <h6 class=" ms-5 mt-2 text-subtitle-1">{{ title }}</h6>
            </v-card-text>
        </router-link>
    </v-card>
</template>

<script lang="ts">
import SvgSprite from '@/components/shared/SvgSprite.vue';
import { defineComponent, type PropType } from 'vue';
export default defineComponent({
    name: 'QuickAccessTile',
    props: {
        icon: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        to: {
            // Use PropType for complex types like union types or objects
            type: [String, Object] as PropType<string | Record<string, any>>,
            required: true,
        },
    },
});
</script>

<style scoped>
.quick-access-tile {
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
    text-align: center;
    text-decoration: none;
    color: #333;
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 120px;
    /* Ensure consistent height */
}

.quick-access-tile:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.quick-access-tile .icon {
    font-size: 3em;
    margin-bottom: 10px;
}

.quick-access-tile h3 {
    margin: 0;
    font-size: 1.2em;
    color: #007bff;
    /* Blue title */
}
</style>