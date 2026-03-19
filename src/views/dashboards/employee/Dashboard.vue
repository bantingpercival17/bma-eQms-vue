<template>
    <div class="my-0">
        <!-- <v-row class="my-0">
            <v-col cols="12">
                <WelcomePanel :userName="currentUser.name" :userRole="currentUser.role" />
            </v-col>
        </v-row> -->
        <div class="mt-2">
            <h2 class="mb-2 fw-bolder">Quick Access</h2>
            <div class="d-flex justify-content-between">
                <QuickAccessTile icon="📄" title="Submit a Form" :to="{ name: 'employee-layout.dashboard' }" />
                <QuickAccessTile icon="📚" title="View Manual" :to="{ name: 'employee-layout.dashboard' }" />
                <QuickAccessTile icon="📅" title="Schedule a Meeting" :to="{ name: 'employee-layout.dashboard' }" />
                <QuickAccessTile icon="⬆️" title="Upload Minutes" :to="{ name: 'employee-layout.dashboard' }" />
                <QuickAccessTile icon="⚠️" title="Submit Risk Log" :to="{ name: 'employee-layout.dashboard' }" />
            </div>
        </div>
        <Announcement />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'; // For Vue 3 Composition API style
import WelcomePanel from '@/components/apps/WelcomePanel.vue';
import QuickAccessTile from '@/components/apps/QuickAccessTile.vue';
import Announcement from './components/Announcement.vue';

interface User {
    name: string;
    role: string;
}

export default defineComponent({ // Use defineComponent for better type inference
    name: 'Dashboard',
    components: {
        WelcomePanel,
        QuickAccessTile,
        Announcement
    },
    data() {
        return {
            currentUser: {
                name: 'Juan Dela Cruz',
                role: 'Administrator',
            } as User, // Explicitly type the data property
            procedureList: []
        };
    },

    // In a real a pp, currentUser would likely come from a store or API call
});
</script>
<style scoped>
.dashboard {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
}

.quick-access-section {
    margin-top: 40px;
}

.quick-access-section h2 {
    color: #333;
    margin-bottom: 20px;
    border-bottom: 2px solid #eee;
    padding-bottom: 10px;
}

.quick-access-tiles {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
}
</style>