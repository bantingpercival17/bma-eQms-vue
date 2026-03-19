<template>
    <v-container>
        <!-- Toolbar Header -->
        <v-toolbar flat color="white" class="mb-4">
            <v-toolbar-title>📄 List of Amendments</v-toolbar-title>

            <!-- Status Filter -->
            <v-select v-model="statusFilter" :items="statusOptions" label="Filter by Status" dense outlined class="mr-2"
                style="max-width: 180px;"></v-select>

            <!-- Search -->
            <v-text-field v-model="search" label="Search" dense outlined class="mr-2"
                style="max-width: 200px;"></v-text-field>

            <!-- Export Button -->
            <v-btn color="primary" @click="exportCSV">
                Export CSV
            </v-btn>
        </v-toolbar>

        <!-- Data Table -->
        <v-data-table :items="filteredData" :headers="headers" class="elevation-1" :search="search">
            <!-- Date formatting -->
            <template v-slot:item.updated_at="{ item }">
                {{ new Date(item.updated_at).toLocaleString() }}
            </template>
            <!-- Status Badge -->
            <template v-slot:item.status="{ item }">
                <v-chip :color="getStatusColor(item.status)">
                    {{ item.status }}
                </v-chip>
            </template>
            <!-- Status Badge -->
            <template v-slot:item.createdAt="{ item }">
                <v-chip color="primary">
                    {{ item.createdAt }}
                </v-chip>
            </template>
            <template v-slot:item.amendmentControl="{ item }">
                <router-link class="custom-link" :to="`/qms/approval-workflow/view/${item.id}`">{{ item.amendmentControl }}</router-link>
            </template>
            <!--Draft Action Buttons -->
            <template v-slot:item.draftAction="{ item }">
                <v-menu>
                    <template v-slot:activator="{ props }">
                        <v-btn variant="tonal" color="primary" v-bind="props">
                            ACTION
                        </v-btn>
                    </template>
                    <v-list border rounded="lg" density="compact" class="py-0" aria-busy="true"
                        aria-label="transaction data">

                        <v-list-item @click="$emit('view', item)">
                            <v-list-item-title>View</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="$emit('submit', item.id)">
                            <v-list-item-title>Submit</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="$emit('remove', item.id)">
                            <v-list-item-title>Remove</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </template>

        </v-data-table>

    </v-container>
</template>
<style scoped>
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
</style>
<script>
export default {
    name: 'AmendmentTableList',
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
            statusOptions: ['Approved', 'Pending', 'Rejected'],
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
        getStatusColor(status) {
            return status?.toLowerCase() == 'approved' ? 'success' : (status?.toLowerCase() == 'pending' ? 'warning' : (status?.toLowerCase() == 'rejected' ? 'error' : 'grey'))
        },
        exportCSV() {
            const csvContent = [
                ['ID', 'Amendment Control', 'Model', 'Description of Changes', 'Updated At', 'Status'],
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
