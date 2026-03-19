<template>
    <div v-if="error" class="mt-3">
        <span class="text-center p-3">PDF DISPLAY ERROR</span>

    </div>
    <div v-else>
        <iframe v-if="pdfFile" :src="`${pdfFile}#toolbar=0&navpanes=0`" class=" full-screen-iframe" frameborder="0"
            @contextmenu.prevent></iframe>
        <div v-else class="pa-5">

            <div v-if="fileID !== 0" class="d-flex flex-column justify-center align-center pa-5">
                <img src="@/assets/images/loading.gif" alt="Loading" />
                <p class="h3 text-primary font-weight-bold mt-3">LOADING...</p>
            </div>
        </div>
    </div>
</template>
<style scoped>
.full-screen-container {
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
    overflow: hidden;
    /* Prevent scrollbars */
}

.full-screen-iframe {
    width: 100%;
    height: 100vh;
    border: none;
    /* Remove iframe border */
}

.interaction-group {
    display: flex;
    /*  justify-content: space-between; */
    /*   padding: 10px; */
}

ion-button span {
    margin-left: 5px;
    font-size: 16px;
}
</style>
<script>
import { defineComponent } from 'vue';
import { GeneralController } from '@/stores/GeneralController';
export default defineComponent({
    name: 'ProcedurePDFViewer',
    data() {
        return {
            pdfFile: null,
            error: null
        }
    },
    props: {
        fileID: {
            type: String,
            required: true,
        },
        model: {
            type: String,
            requred: true
        },
    },
    methods: {
        async loadFile() {
            this.error = null;
            try {
                const response = await GeneralController.retrieveFile({ link: this.fileID }, 'procedure/documents/view');
                const blob = new Blob([response], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                this.pdfFile = url;

            } catch (error) {
                console.error(error);
                this.error = 'Unable to load PDF. Check the password or PDF file.';
                this.errorMessage = error.message;
            }
        },
        encrypt(data) {
            return btoa(data)
        },
    },
    mounted() {
        if (this.fileID !== 0) {
            this.loadFile()
        }
    },
})
</script>