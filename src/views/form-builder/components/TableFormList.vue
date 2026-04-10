<template>
    <v-container>
        <v-toolbar flat class="d-flex justify-space-between align-center">
            <v-toolbar-title class="text-h6 font-weight-bold">
                LIST OF FILLABLE FORMS
            </v-toolbar-title>

            <div class="d-flex align-center">

                <v-text-field v-model="search" label="Search" variant="outlined" hide-details density="compact"
                    class="mr-3" style="width: 250px;"></v-text-field>
            </div>
        </v-toolbar>


        <!-- Data Table -->
        <v-data-table :items="filteredItems" :headers="headers" :search="search"
            class="elevation-1 text-body-2 custom-table">
            <!-- Year only -->
            <template v-slot:item.action="{ item }">
                <v-btn color="info" variant="elevated" @click="$emit('edit', item.id)">
                    EDIT
                </v-btn>
                <v-btn color="success" variant="elevated" class="ms-2" @click="$emit('preview', item.id)">
                    PREVIEW
                </v-btn>
                <v-btn variant="elevated" class="ms-2" @click="$emit('export', item)">
                    EXPORT
                </v-btn>
            </template>

        </v-data-table>


    </v-container>
</template>
<script>
export default {
    name: 'TableFormList',
    emits: ['edit', 'preview'],
    props: {
        data: {
            type: Array,
            required: true
        },
        headers: Object,
        role: Number
    },
    data() {
        return {
            search: '',
            selectedStatus: null,
            validationAlert: {
                content: [],
                show: false
            }
        };
    },
    computed: {
        filteredItems() {
            return this.data?.filter(i => {
                const searchMatch =
                    i.form_name.toLowerCase().includes(this.search.toLowerCase());
                return searchMatch;
            });
        }
    }
}
</script>