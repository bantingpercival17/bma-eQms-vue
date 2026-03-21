<template>
    <v-row>
        <v-col cols="5">
            <CardHeader title="PROCEDURES" class="overflow-hidden">
                <div class="">
                    <template v-if="contentLoading">
                        <div class="d-flex justify-center align-center pa-5">
                            <img src="@/assets/images/loading.gif" alt="Loading" />
                        </div>

                    </template>
                    <template v-else>
                        <v-list border class="" aria-busy="true" aria-label="project list">
                            <v-list-item class="py-2 px-4" v-for="(item, index) in procedureList" :key="index"
                                :value="item.id" rounded="md" @click="viewProcedure(encrypt(item.id))">
                                <span class="text-body-1">{{ item.procedureName }}</span>
                                <template v-slot:append>
                                    <v-chip class="ms-3" size="small" color="success " variant="flat">
                                        {{ item.formCount }}
                                    </v-chip>
                                </template>
                            </v-list-item>
                        </v-list>
                    </template>

                </div>
            </CardHeader>
        </v-col>
        <v-col cols="7">
            <template v-if="subContentLoading">
                <div class="d-flex flex-column justify-center align-center pa-5">
                    <img src="@/assets/images/loading.gif" alt="Loading" />
                    <p class="h3 text-primary font-weight-bold mt-3">LOADING...</p>
                </div>
            </template>
            <DetailedView :detailed="procedureDetails" v-else />
        </v-col>
    </v-row>
</template>
<script>
import CardHeader from '@/components/shared/CardHeader.vue';
import { defineComponent } from 'vue';
import { GeneralController } from '@/stores/GeneralController';
import DetailedView from './procedure/DetailedView.vue';

export default defineComponent({
    name: 'Procedure',
    data() {
        return {
            procedureList: [],
            procedureDetails: {
                prodName: 'PROCEDURE NAME',
                prodVersion: 'VERSION', fileID: 0,
                formList: null
            },
            contentLoading: true,
            subContentLoading: false
        }
    },
    components: {
        CardHeader, DetailedView
    },
    methods: {
        async loadData() {
            return await GeneralController.retrieveData('procedure/retrieve/list', { search: null }, 'procedures')
        },
        async viewProcedure(data) {
            // /retrieve/view
            this.subContentLoading = true
            const response = await GeneralController.retrieveData('procedure/retrieve/view', { procedure: data }, 'procedure')
            if (response) {
                this.procedureDetails = {
                    prodId: this.encrypt(response.id),
                    prodName: response.procedure_name,
                    prodVersion: `VERSION ${response.file.version}`,
                    formLists: response.forms,
                    fileID: this.encrypt(response.file.id)
                }
                this.subContentLoading = false
            }
        },
        encrypt(data) {
            return btoa(data)
        },
    },
    async created() {
        this.procedureList = await this.loadData()
        if (this.procedureList) {
            this.contentLoading = false
        }
    }
})
</script>