<template>
    <v-dialog v-model="confirmData.show" max-width="400" persistent>
        <v-card class="text-center rounded-lg" elevation="12" color="white">

            <!-- Icon -->
            <v-card-text class="pt-6">
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
                        <path :d="iconPath" />
                    </svg>
                </div>
            </v-card-text>

            <!-- Title -->
            <v-card-title class="justify-center">
                <span class="text-h5 font-weight-bold">
                    {{ formattedTitle }}
                </span> <br>
                <span class="text-body-1">
                    {{ confirmData.message }}
                </span>
            </v-card-title>

            <!-- Actions Buttons -->
            <v-card-actions class="">
                <!-- Cancel Button -->
                <v-btn variant="outlined" color="grey" rounded class="" @click="confirmData.show = false">
                    Cancel
                </v-btn>

                <!-- Confirm Button -->
                <v-btn variant="outlined" color="primary" dark rounded class="" @click="onConfirm">
                    Confirm
                </v-btn>

            </v-card-actions>

        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: "ConfirmationDialog",

    props: {
        confirmData: Object,
        item: Object
    },
    /*  emits: ["update:modelValue", "confirm", "cancel"],*/
    computed: {
        formattedTitle() {
            return (this.confirmData.title || "").toUpperCase();
        },

        // SVG icon paths
        iconPath() {
            switch (this.confirmData.type) {
                case "success":
                    return "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z";
                case "error":
                    return "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z";
                case "warning":
                    return "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z";
                case "info":
                default:
                    return "M11 17h2v-6h-2v6zm0-8h2V7h-2v2zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z";
            }
        },

        iconColor() {
            return {
                success: "#4CAF50",
                error: "#F44336",
                warning: "#FF9800",
                info: "#2196F3",
            }[this.confirmData.type] || "#757575";
        },

        circleColor() {
            return {
                success: "rgba(76, 175, 80, 0.15)",
                error: "rgba(244, 67, 54, 0.15)",
                warning: "rgba(255, 152, 0, 0.15)",
                info: "rgba(33, 150, 243, 0.15)",
            }[this.confirmData.type] || "rgba(0,0,0,0.1)";
        },

        btnColor() {
            return {
                success: "success",
                error: "error",
                warning: "warning",
                info: "info",
            }[this.confirmData.type] || "primary";
        }
    },

    methods: {
        onConfirm() {
            const data = this.confirmData.data
            this.$emit("confirm", data);
            this.confirmData.show = false
        },
    }
};
</script>
