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
                            <span class="text-body-1 fw-bolder text-success">{{ item.form_code }} | </span>
                            <span class="text-body-2">{{ item.form_name }}</span>
                        </v-list-item>
                    </v-list>
                </div>
            </div>

            <!--  <FormModalView v-model="openModel" /> -->
            <FormModalView v-if="formInfo" v-model="openModel" :formDetails="formInfo" />
        </v-window-item>
        <v-window-item value="two" class="ps-5 pe-5 pt-4">
          <v-alert v-if="errorMessages != null" type="error" colored-border elevation="2" dismissible>
            An error occurred while saving your data. <br>
            <small color="error">{{ errorMessages }}</small>
        </v-alert>
            <label for="ADD" class="text-subtitle-1 text-success text-h3">ADD FORMS</label>
            <template v-if="formLoader">
                <div class="d-flex flex-column justify-center align-center pa-5">
                    <img src="@/assets/images/formLoader.gif" alt="Loading" />
                    <p class="h3 text-primary font-weight-bold mt-3">LOADING...</p>
                </div>
            </template>
            <v-form v-else @submit.prevent="submitForm">
                <v-row dense>
                    <!-- Form Name -->
                    <v-col cols="12">
                        <v-text-field v-model="formData.formName" label="FORM NAME*" placeholder="Enter form name"
                            variant="outlined" density="comfortable" color="success" required hide-details="auto"
                            class="mb-4"></v-text-field>
                    </v-col>

                    <!-- Form Code -->
                    <v-col cols="12">
                        <v-text-field v-model="formData.formCode" label="FORM CODE*" placeholder="e.g. ADM-001"
                            variant="outlined" density="comfortable" color="success" required hide-details="auto"
                            class="mb-4"></v-text-field>
                    </v-col>

                    <!-- Form Status -->
                    <v-col cols="12">
                        <v-select v-model="formData.formStatus" label="FORM STATUS*" :items="[
                            { title: 'GENERAL FORMS', value: '1' },
                            { title: 'DEPARTMENTAL FORMS', value: '0' }
                        ]" variant="outlined" density="comfortable" color="success" :error="!!errors['status']"
                            :error-messages="errors['status']" hide-details="auto" required class="mb-4"></v-select>
                    </v-col>

                    <!-- Retention Period -->
                    <v-col cols="12">
                        <v-select v-model="formData.formRetention" label="Retention Period*" :items="[
                            { title: 'Permanent', value: 'Permanent' },
                            { title: '1 Year', value: '1 Year' },
                            { title: '2 Years', value: '2 Years' },
                            { title: '3 Years', value: '3 Years' },
                            { title: '4 Years', value: '4 Years' },
                            { title: '5 Years', value: '5 Years' },
                            { title: 'Until Superseded', value: 'Until Superseded' }
                        ]" variant="outlined" density="comfortable" color="success" hide-details="auto" required
                            class="mb-4"></v-select>
                    </v-col>

                    <!-- File Input -->
                    <v-col cols="12">
                        <v-file-input v-model="formData.formFile" label="Attach PDF file" accept=".pdf"
                            variant="outlined" density="comfortable" color="success" prepend-icon="mdi-file-pdf-box"
                            show-size :error="!!fileError" :error-messages="fileError" hide-details="auto"
                            class="mb-4"></v-file-input>
                    </v-col>

                    <!-- Action Buttons -->
                    <v-col cols="12" class="pt-4 d-flex justify-end">
                        <v-btn variant="text" color="grey-darken-1" class="mr-2">Cancel</v-btn>
                        <v-btn color="success" type="submit" elevation="1" size="large">
                            Submit Form
                        </v-btn>
                    </v-col>
                </v-row>
            </v-form>
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
        procedure: String,
        formList: {
            type: Object
        }
    },
    data() {
        const formTab = this.formList.length > 0 ? null : 'two';
        const formData = {
            formName: null,
            formCode: null,
            formRetention: null,
            formStatus: null,
            formFile: [],
        }
        return {
            openModel: false,
            formLoader: false,
            formData,
            formInfo: {
                isModalLoading: true,
                content: [],
                link: null
            },
            formTab,
            selectedFile: [],
            fileError: '',
            errors: [],
            errorMessages:null
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
        async submitForm() {
            const formData = new FormData();
            this.formLoader = true;
            this.errorMessages = null;
            formData.append('procedure', this.procedure);
            // append normal fields
            for (let key in this.formData) {
                formData.append(key, this.formData[key]);
            }
            // ✅ append file properly
            /* if (this.formData.formFile && this.formData.formFile.length > 0) {
                formData.append('formFile', this.formData.formFile[0]);
            } */
            try {
                const response = await GeneralController.storeItemFiles('forms/store-forms', formData);
                console.log(response.formList);
                this.formTab = 'one';
                // ❗ emit instead of mutating prop
                this.$emit('update:formList', response.formList);
                this.alertSuccess = true;
                // reset form
                this.formData = {
                    formName: null,
                    formCode: null,
                    formRetention: null,
                    formStatus: null,
                    formFile: [],
                };
                } catch (error) {
                    console.log(error);
                // ✅ safer error handling (works for Axios & others)
                const data = error?.response?.data || null;
                if (data) {
                    this.errorMessages = data.message;
                    // optional: get specific field error
                    if (data.errors?.formFile) {
                        this.fileError = data.errors.formFile[0];
                    }
                } else {
                    this.errorMessages = error.message;
                }
            } finally {
                this.formLoader = false;
            }
        }
    }
});
</script>