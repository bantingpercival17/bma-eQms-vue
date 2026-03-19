<template>
    <v-card>
        <v-card-title class="text-h5 d-flex align-center">
            {{ modal.form.qor_id ? 'UPDATE' : 'ADD' }}
            ADD QUALITY OBJECTIVE
            <v-spacer></v-spacer>
            <v-btn v-if="modal.form.qor_id" color="error" class="me-3"
                @click="$emit('removed', modal.form?.qor_id)">Remove</v-btn>
            <v-btn color="primary" @click="modal.show = false">Close</v-btn>
        </v-card-title>
        <v-card-text class="pa-5">
            <form @submit.prevent="$emit('store', formData)" class="mb-5">
                <div v-for="(input, index) in formInputs" :key="index" class="form-group">
                    <v-label color="info">{{ input.label }} <span>*</span></v-label>
                    <v-textarea v-model="formData[input.model]" variant="outlined" class="mt-2" color="success"
                        placeholder="" rows="3">
                    </v-textarea>
                </div>
                <v-btn type="submit" color="primary" class="mb-4">Save Objectives</v-btn>
            </form>
        </v-card-text>
    </v-card>
</template>
<script>

export default {
    name: 'AddObjectiveModal',
    props: {
        modal: Object
    },
    data() {
        return {
            formData: {}
        }
    },
    watch: {
        'modal.form': {
            immediate: true,
            deep: true,
            handler(val) {
                this.formData = { ...val }   // shallow copy
            }
        }
    },
    computed: {
        formInputs() {
            return [
                { label: 'QUALITY OBJECTIVE', model: 'quality_objective', rows: 3 },
                { label: 'TARGET', model: 'target', rows: 3 },
                { label: 'KEY PERFORMANCE INDICATOR', model: 'key_performance_indicator', rows: 3 },
                { label: 'MEASUREMENT', model: 'measurement_method', rows: 3 },
                { label: 'ACTUAL PERFORMANCE', model: 'actual_performance', rows: 3 },
                { label: 'TARGET MET (YES/NO)', model: 'target_met', rows: 3 },
                { label: 'TIME FRAME', model: 'time_frame', rows: 3 },
                { label: 'PROOF OF EVIDENCE', model: 'proof_of_evidence', rows: 3 },
                { label: 'FREQUENCY OF REPORT', model: 'frequency_of_report', rows: 3 }
            ]
        }
    },
    /*   data() {
          //const formData = new FormData()
          const formData = this.modal.form
          const formInputs = [
              { label: 'QUALITY OBJECTIVE', model: formData.quality_objective, rows: 3 },
              { label: 'TARGET', model: formData.target, rows: 3 },
              { label: 'KEY PERFORMANCE INDICTOR', model: formData.key_performance_indicator, rows: 3 },
              { label: 'MEASUREMENT', model: formData.measurement_method, rows: 3 },
              { label: 'ACTUAL PERFORMANCE', model: formData.actual_performance, rows: 3 },
              { label: 'TARGET MET (YES/NO)', model: formData.target_met, rows: 3 },
              { label: 'TIME FRAME', model: formData.time_frame, rows: 3 },
              { label: 'PROOF OF EVIDENCE', model: formData.proof_of_evidence, rows: 3 },
              { label: 'FREQUENCY OF REPORT', model: formData.frequency_of_report, rows: 3 }
  
          ]
          return {
              formInputs, formData
          }
      }, */
    emits: ['store', 'removed'],
}
</script>