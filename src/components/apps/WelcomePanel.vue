<script lang="ts">
import { defineComponent, type PropType } from 'vue'; // Import PropType

export default defineComponent({
    name: 'WelcomePanel',
    props: {
        userName: {
            type: String,
            required: true,
        },
        userRole: {
            type: String,
            default: 'User',
        },
    },
});
</script>

<template>
    <v-card class="welcomeBanner text-surface overflow-hidden" elevation="0" rounded="lg">
        <v-card-text class="py-5 px-md-12 px-6">
            <v-row>
                <v-col cols="12" xl="6" md="7" sm="10">
                    <div class="pb-md-8 pt-md-7 pt-5 pb-6">
                        <h2 class="text-sm-h2 text-h3">Welcome {{ userName }}!</h2>
                        <p class="text-h6 mb-7">
                            To centralize all quality-related data and information into a single, easily searchable
                            repository, enabling quick retrieval and informed decision-making.
                        </p>
                        <!--  <v-btn color="white" variant="outlined" rounded="md">Exclusive on Themeforest</v-btn> -->
                    </div>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>
<style lang="scss">
.welcomeBanner {
    background: rgb(var(--v-theme-darksuccess));
    position: relative;

    &::after {
        content: '';
        background-image: url(@/assets/images/analytics/img-dropbox-bg.svg);
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: -1;
        opacity: 0.5;
        background-position: bottom right;
        background-size: 100%;
        background-repeat: no-repeat;
    }
}
</style>

<!-- <template>
    <div class="welcome-panel">
        <h1>Welcome, {{ userName }}!</h1>
        <p class="user-info">Role: {{ userRole }}</p>
        <p class="greeting">We're glad to have you here. Your dashboard provides quick access to important tasks.</p>
    </div>
</template>

<script>
export default {
    name: 'WelcomePanel',
    props: {
        userName: {
            type: String,
            required: true,
        },
        userRole: {
            type: String,
            default: 'User',
        },
    },
};
</script>

<style scoped>
.welcome-panel {
    background-color: #e0f2f7;
    /* Light blue background */
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.welcome-panel h1 {
    color: #2196f3;
    /* Blue heading */
    margin-bottom: 10px;
    font-size: 2.5em;
}

.welcome-panel .user-info {
    color: #666;
    font-size: 1.1em;
    margin-bottom: 15px;
}

.welcome-panel .greeting {
    color: #555;
    font-size: 1em;
    line-height: 1.5;
}
</style> -->