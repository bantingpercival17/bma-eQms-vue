<template>
    <v-tabs v-model="formTab" color="success">
        <v-tab value="one" class="font-weight-medium">LIST OF FORM</v-tab>
        <v-tab value="two" class="font-weight-medium">ADD FORM</v-tab>
    </v-tabs>
    <v-window v-model="formTab">
        <v-window-item value="one">
            <div v-if="formList !== null">
                <div v-if="formList.length > 0" class="form-list-container">
                    <v-list border class="" aria-busy="true" aria-label="project list">
                        <v-list-item class="py-2 px-4" v-for="(item, index) in formList" :key="index" :value="item.id"
                            rounded="md" @click="viewForm(encrypt(item.id))">
                            <span class="text-body-1">{{ item.form_name }}</span>
                        </v-list-item>
                    </v-list>
                </div>
            </div>

            <!--  <FormModalView v-model="openModel" /> -->
            <FormModalView v-if="formInfo" v-model="openModel" :formDetails="formInfo" />
        </v-window-item>
        <v-window-item value="two" class="ps-5 pe-5 pt-4">
            <label for="ADD" class="text-subtitle-1 text-success text-h3">ADD FORMS</label>
            <form action="" method="post">
                <div class="form-group">
                    <v-label class="text-default">FORM NAME*</v-label>
                    <v-text-field hide-details="auto" required variant="outlined" class="mt-2" color="success"
                        placeholder="">
                    </v-text-field>
                </div>
                <div class="form-group mt-3">
                    <v-label class="text-default">FORM CODE*</v-label>
                    <v-text-field hide-details="auto" required variant="outlined" class="mt-2" color="success"
                        placeholder="">
                    </v-text-field>
                </div>
                <!--   <v-col cols="12">
                <v-select v-model="formData.status" :items="[
                    { text: 'GENERAL FORMS', value: '1' },
                    { text: 'DEPARTMENTAL FORMS', value: '0' }
                ]" label="FORM STATUS" variant="outlined" density="compact" :error="!!errors['status']"
                    :error-messages="errors['status']" item-title="text" item-value="value" hide-details="auto"
                    required></v-select>
            </v-col> -->

            </form>
        </v-window-item>
    </v-window>
</template>
<script>
import { defineComponent } from 'vue';
import FormModalView from '../widgets/FormModalView.vue';
import { GeneralController } from '@/stores/GeneralController';
export default defineComponent({
    name: 'FormProcedure',
    components: {
        FormModalView
    },
    props: {
        formList: {
            type: Object
        }
    },
    data() {
        const formTab = this.formList.length > 0 ? null : 'two';
        return {
            openModel: false,
            formInfo: {
                isModalLoading: true,
                content: [],
                link: null
            },
            formTab
        }
    },
    methods: {
        async viewForm(form) {
            this.openModel = true
            const response = await GeneralController.retrieveFile({ link: form }, 'forms/retrieve-file');
            const blob = new Blob([response], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            this.formInfo = {
                content: await GeneralController.retrieveData('forms/retrieve', { form: form }, 'form'),
                link: url,
                isModalLoading: false,
            }
            console.log(this.formInfo)
        },
        encrypt(data) {
            return btoa(data)
        },
    }
});
</script>