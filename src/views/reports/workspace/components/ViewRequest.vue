<template>
    <v-dialog :model-value="modelValue" @update:model-value="formModalClose" max-width="500">
        <v-card>
            <!-- Header -->
            <v-card-title class="text-h5 d-flex align-center">
                <v-card-title class="text-h5">
                    Preview Request
                </v-card-title>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="formModalClose">
                    Close
                </v-btn>
            </v-card-title>
            <v-card-text class="d-flex flex-column gap-4">
                <iframe :src="preview.pdfLink + '#toolbar=0&navpanes=0&scrollbar=0'" class="full-screen-iframe"
                    frameborder="0"></iframe>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn text @click="formModalClose">Cancel</v-btn>
            </v-card-actions>

        </v-card>
    </v-dialog>
</template>
<script>
export default {
    name: 'ViewRequest',
    props: {
        modelValue: {
            type: Boolean,
            required: true,
        },
        preview: Object,
    },
    methods: {
        formModalClose() {
            this.$emit('update:modelValue', false);
        },
    }
}
</script>
<style scoped>
.full-screen-iframe {
    width: 100%;
    height: 70vh;
    border: none;
}
</style>