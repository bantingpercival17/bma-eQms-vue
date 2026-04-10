<template>
    <v-container>
        <v-toolbar flat class="d-flex justify-space-between align-center mb-3">
            <v-autocomplete class="m-5" v-model="formSelected" :items="formList" item-title="form_name" item-value="id"
                label="Search Forms" prepend-inner-icon="mdi-magnify" variant="outlined" color="primary" clearable
                return-object hint="Search by form name or code" persistent-hint>
                <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props" :subtitle="item.raw.form_code" />
                </template>
            </v-autocomplete>
        </v-toolbar>

        <v-card v-if="formSelected" class="mt-3">
            <PreviewForm :formSelected="formSelected" @store="$emit('store', $event)" />
        </v-card>
    </v-container>
</template>

<script>
import PreviewForm from './PreviewForm.vue';
export default {
    name: 'RequestForm',

    props: {
        formList: {
            type: Array,
            required: true
        }
    },
    components: {
        PreviewForm
    },
    data() {
        return {
            formSelected: null,
        };
    },
    emits: ['store']
};
</script>
