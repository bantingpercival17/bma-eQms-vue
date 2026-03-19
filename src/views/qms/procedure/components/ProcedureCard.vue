<template>
    <v-card variant="outlined" elevation="0" class="bg-surface" rounded="lg">
        <v-card-item>
            <div class="d-flex justify-space-between align-center">
                <div class="text-left">
                    <v-card-title class="text-h4 text-success">
                        {{ title }}
                    </v-card-title>
                    <small class="text-secondary fw-bolder">{{ version }}</small>
                </div>
                <div class="setting-right">
                    <v-btn v-if="details?.length > 0" color="primary" variant="flat" block rounded="md" size="small">
                        View
                    </v-btn>
                </div>
            </div>
        </v-card-item>
        <v-divider></v-divider>
        <v-card-text class="pa-0">
            <slot />
        </v-card-text>
    </v-card>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
    name: 'ProcedureCard',
    props: {
        title: String,
        version: String,
        details: Object
    }
})
</script>
