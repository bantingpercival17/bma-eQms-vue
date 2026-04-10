<template>
    <v-container>
        <v-toolbar flat class="d-flex justify-space-between align-center">
            <v-toolbar-title class="text-h6 font-weight-bold">
                LIST OF REQUESTS
            </v-toolbar-title>

            <div class="d-flex align-center">
                <v-select v-model="selectedStatus" :items="statusOptions" label="Select Filter" variant="outlined"
                    hide-details density="compact" style="width: 150px;" class="me-3"></v-select>
                <v-text-field v-model="search" label="Search" variant="outlined" hide-details density="compact"
                    class="mr-3" style="width: 250px;"></v-text-field>
            </div>
        </v-toolbar>


        <!-- Data Table -->
        <v-data-table :items="filteredItems" :headers="headers" :search="search"
            class="elevation-1 text-body-2 custom-table">
            <!-- Year only -->
            <template v-slot:item.date_created="{ item }">
                <span v-if="role == 2">
                    {{ new Date(item.date_created).getFullYear() }}
                </span>
                <span v-else>
                    {{ item.date_created }}
                </span>
            </template>
            <template v-slot:item.status="{ item }">
                <template v-if="item.status">
                    <v-chip v-if="item.status.is_approved == 0" :color="getStatusColor(item.status.is_approved)" dark
                        @click="showValidation(item)">
                        {{ statusName(item.status.is_approved) }}
                    </v-chip>
                    <v-chip v-else :color="getStatusColor(item.status.is_approved)" dark>{{
                        statusName(item.status.is_approved) }}
                    </v-chip>
                </template>
                <template v-else>
                    <v-chip color="secondary">Draft</v-chip>
                    <v-chip @click="$emit('submit', item)" class="ms-3" color="primary" dark>Submit</v-chip>
                </template>
            </template>

        </v-data-table>


    </v-container>
</template>
<script>
export default {
    name: 'RequestTableList',
    props: {
        data: {
            type: Array,
            required: true
        },
        headers: Object,
        role: Number
    },
    emits: ['submit', 'validate', 'view', 'removed', 'viewPDF'],
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
            return this.data.filter(i => {
                const statusMatch = this.selectedStatus
                    ? i.status.is_approved === this.selectedStatus
                    : true;
                return statusMatch;
            });
        }
    }
}
</script>