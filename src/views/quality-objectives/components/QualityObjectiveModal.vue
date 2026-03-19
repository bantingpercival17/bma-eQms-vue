<template>
    <v-dialog :model-value="modelValue" @update:model-value="formModalClose" max-width="1000px" persistent>
        <v-card>
            <v-card-title class="text-h5 d-flex align-center">
                QUALITY OBJECTIVES REPORT
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="formModalClose">Close</v-btn>
            </v-card-title>
            <v-window v-if="!formDetails.isModalLoading" v-model="formModalTab">
                <v-window-item value="one">
                    <div class="ps-5 pe-5">
                        <span class="fw-bold text-primary h4">
                            {{ formDetails.data.academic
                            }}
                        </span>
                        <br>
                        <small class="text-caption text-lightText">{{ formDetails.data.procedure }}</small><br>
                        <div class="iframe-container" style="height: 85%; margin-bottom: 20px;">
                            <iframe v-if="formDetails.link" :src="`${formDetails.link}#toolbar=0&navpanes=0`"
                                class="full-screen-iframe mt-3" frameborder="0" @contextmenu.prevent></iframe>
                        </div>
                    </div>
                </v-window-item>
            </v-window>
            <template v-else>
                <div class="d-flex flex-column justify-center align-center pa-5">
                    <img src="@/assets/images/loading.gif" alt="Loading" />
                    <p class="h3 text-success font-weight-bold mt-3">LOADING...</p>
                </div>
            </template>
        </v-card>
    </v-dialog>
</template>
<style scoped>
.full-screen-iframe {
    width: 100%;
    height: 80vh;
    border: none;
}
</style>

<script>
export default {
    name: 'QualityObjectiveModal',
    data() {
        return {
            formModalTab: null,
        }
    },
    props: {
        modelValue: {
            type: Boolean,
            required: true,
        },
        formDetails: Object,
    },
    emits: ['update:modelValue'],
    mounted() {
        console.log(this.formDetails)
    },
    methods: {
        formModalClose() {
            this.$emit('update:modelValue', false);
            this.formDetails.isModalLoading = false
        },
    },
};
</script>
