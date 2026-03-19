<template>
    <v-toolbar flat class="d-flex justify-space-between align-center">
        <v-toolbar-title class="text-h6 font-weight-bold">
            LIST OF RISK DESCRIPTION
        </v-toolbar-title>

        <div class="d-flex align-center">
            <v-text-field v-model="search" label="Search" variant="outlined" hide-details density="compact" class="mr-3"
                style="width: 250px;"></v-text-field>

            <v-btn color="primary" variant="flat" class="mr-3" @click="$emit('add')">
                Add Risks
            </v-btn>
        </div>
    </v-toolbar>


    <!-- Data Table -->
    <v-data-table :items="filteredData" :headers="headers" class="elevation-1" :search="search">

        <!-- Status Badge -->
        <template v-slot:item.status="{ item }">
            <v-chip :color="getStatusColor(item.status)">
                {{ item.status }}
            </v-chip>
        </template>
        <!--Draft Action Buttons -->
        <template v-slot:item.actionBtn="{ item }">
            <v-menu>
                <template v-slot:activator="{ props }">
                    <v-btn variant="tonal" color="primary" v-bind="props">
                        ACTION
                    </v-btn>
                </template>
                <v-list border rounded="lg" density="compact" class="py-0" aria-busy="true"
                    aria-label="transaction data">

                    <v-list-item @click="$emit('edit', item)">
                        <v-list-item-title>EDIT</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="$emit('removed', item)">
                        <v-list-item-title>REMOVE</v-list-item-title>
                    </v-list-item>
                    <!-- <v-list-item @click="$emit('remove', item.id)">
                            <v-list-item-title>Remove</v-list-item-title>
                        </v-list-item> -->
                </v-list>
            </v-menu>
        </template>

    </v-data-table>
</template>

<script>
export default {
    name: 'RiskTableList',
    emits: ['add', 'edit', 'removed',],
    props: {
        data: {
            type: Array,
            required: true
        },
        headers: Object
    },
    data() {
        return {
            search: '',
            statusFilter: null,
        };
    },
    computed: {
        filteredData() {
            if (!this.statusFilter) return this.data;
            return this.data.filter(item =>
                item.status.toLowerCase() === this.statusFilter.toLowerCase()
            );
        }
    },
    methods: {
        exportCSV() {
            const csvContent = [
                ['ACADEMIC YEAR', 'DEPARTMENT', 'Activity/Process/Procedure:', 'Hazards/Risks Description', 'Who/What is at Risks?', 'Action'],
                ...this.filteredData.map(row => [
                    row.id,
                    row.amendment_control,
                    row.model,
                    row.description_of_changes,
                    new Date(row.updated_at).toLocaleString(),
                    row.status
                ])
            ]
                .map(e => e.join(','))
                .join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.setAttribute('download', 'amendments.csv');
            link.click();
        }
    }
};
</script>
<!-- <style scoped>
.v-data-table thead {
    display: table-header-group !important;
    visibility: visible !important;
    opacity: 1 !important;
}

.v-data-table thead th {
    background-color: #ec0303;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.85rem;
    color: #333;
}

.custom-link {
    color: blue;
    text-decoration: none;
    font-weight: bold;
    transition: color 0.3s;
}

.custom-link:hover {
    color: darkblue;
}
</style> -->