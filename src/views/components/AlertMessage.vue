<template>
    <v-dialog v-model="alertMessage.show" persistent max-width="500">
        <scale-transition>
            <v-card v-if="alertMessage.show" class="text-center rounded-lg" elevation="12" color="white">

                <!-- Icon with colored circle -->
                <v-card-text>
                    <div class="mx-auto" :style="{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: circleColor,
                    }">
                        <svg width="48" height="48" viewBox="0 0 24 24" :fill="iconColor">
                            <path :d="alertSVGPath" />
                        </svg>
                    </div>
                </v-card-text>

                <!-- Title -->
                <v-card-title class="justify-center text-h5 font-weight-bold">
                    <span class="text-h5 font-weight-bold">
                        {{ alertTitle }}
                    </span> <br>
                    <span class="text-body-1">
                        {{ alertMessage.text }}
                    </span>
                </v-card-title>

                <!-- Button -->
                <v-card-actions class="justify-center pb-6">
                    <v-btn class="text-white" rounded dark @click="alertMessage.show = false"
                        :style="{ backgroundColor: btnColor }">
                        OKAY
                    </v-btn>
                </v-card-actions>

            </v-card>
        </scale-transition>
    </v-dialog>

</template>
<script>
export default {
    props: {
        alertMessage: Object
    },
    computed: {
        alertSVGPath() {
            switch (this.alertMessage.type) {
                case 'success': return "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z"; // check-circle
                case 'error': return "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"; // error
                case 'warning': return "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"; // warning
                case 'info': return "M11 17h2v-6h-2v6zm0-8h2V7h-2v2zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"; // info
                default: return "M12 2L2 22h20L12 2z";
            }
        },
        iconColor() {
            switch (this.alertMessage.type) {
                case 'success': return '#4CAF50'; // green
                case 'error': return '#F44336'; // red
                case 'warning': return '#FF9800'; // orange
                case 'info': return '#2196F3'; // blue
                default: return '#757575'; // grey
            }
        },
        circleColor() {
            switch (this.alertMessage.type) {
                case 'success': return 'rgba(76, 175, 80, 0.1)';
                case 'error': return 'rgba(244, 67, 54, 0.1)';
                case 'warning': return 'rgba(255, 152, 0, 0.1)';
                case 'info': return 'rgba(33, 150, 243, 0.1)';
                default: return 'rgba(0,0,0,0.05)';
            }
        },
        btnColor() {
            switch (this.alertMessage.type) {
                case 'success': return 'rgba(76, 175, 80, 0.8)';
                case 'error': return 'rgba(244, 67, 54, 0.8)';
                case 'warning': return 'rgba(255, 152, 0, 0.8)';
                case 'info': return 'rgba(33, 150, 243, 0.8)';
                default: return 'rgba(0,0,0,0.05)';
            }
        },
        alertTitle() {
            switch (this.alertMessage.type) {
                case 'success': return 'Success';
                case 'error': return 'Error';
                case 'warning': return 'Warning';
                case 'info': return 'Info';
                default: return 'rgba(0,0,0,0.05)';
            }
        }


    }
}


</script>