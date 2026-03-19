<template>
    <v-container>
        <v-toolbar flat class="d-flex justify-space-between align-center">
            <v-toolbar-title class="text-h6 font-weight-bold">
                LIST OF QUALITY OBJECTIVE
            </v-toolbar-title>

            <div class="d-flex align-center">
                <v-select v-model="selectedYear" :items="years" label="Select Filter" variant="outlined" hide-details
                    density="compact" style="width: 150px;" class="me-3"></v-select>
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
            <template v-slot:item.registeredRisk="{ item }">
                <div v-for="(riskRegister, index) in item.registeredRisk">
                    <p>{{ index + 1 }}.{{ riskRegister.risks_description }}</p>
                </div>

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
            <!-- Activity Button + Menu -->
            <template v-slot:item.academic="{ item }">
                <v-menu>
                    <template v-slot:activator="{ props }">
                        <label v-bind="props" class="text-primary fw-bolder"><b>{{ (item.academic) }}</b></label>
                    </template>
                    <v-list border rounded="lg" density="compact" class="py-0">
                        <v-list-item @click="$emit('view', item)">
                            <v-list-item-title>View</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="$emit('viewPDF', item)">
                            <v-list-item-title>View as PDF</v-list-item-title>
                        </v-list-item>
                        <template v-if="role == 5">
                            <v-list-item @click="$emit('validate', item)">
                                <v-list-item-title>Validate</v-list-item-title>
                            </v-list-item>
                        </template>
                        <template v-else>
                            <v-list-item @click="$emit('removed', item)">
                                <v-list-item-title>Remove</v-list-item-title>
                            </v-list-item>
                        </template>
                    </v-list>
                </v-menu>
            </template>
        </v-data-table>


    </v-container>
    <v-dialog v-model="validationAlert.show" persistent max-width="400">
        <v-card>
            <v-card-title class="text-h6">Validation Information</v-card-title>
            <v-card-text>{{ validationAlert.content.status }}</v-card-text>
            <v-card-actions>
                <v-btn v-if="role == 2" color="success" @click="$emit('submit', validationAlert.content)">Submit
                    Again</v-btn>
                <v-spacer></v-spacer>
                <v-btn text @click="validationAlert.show = false">Cancel</v-btn>
                <v-btn color="primary" @click="open(validationAlert.content)">Open</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: 'QualityObjectiveList',
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
            selectedYear: null,
            validationAlert: {
                content: [],
                show: false
            }
        };
    },
    computed: {
        filteredItems() {
            /*  if (this.role == 5) {
                 return this.data.filter(i => {
                     const yearMatch = this.selectedYear
                         ? new Date(i.date_created).getFullYear() === this.selectedYear
                         : true;
                     const searchMatch =
                         i.department.toLowerCase().includes(this.search.toLowerCase()) ||
                         i.process.toLowerCase().includes(this.search.toLowerCase());
                     return yearMatch && searchMatch;
                 });
 
             } else if (this.role == 2) {
                 return this.data.filter(i => {
                     const statusMatch = this.selectedYear
                         ? (this.selectedYear === 'Draft'
                             ? !i.status
                             : i.status && ((this.selectedYear === 'Pending' && i.status.is_approved === 2) ||
                                 (this.selectedYear === 'Approved' && i.status.is_approved === 1) ||
                                 (this.selectedYear === 'Rejected' && i.status.is_approved === 0)))
                         : true;
                     const searchMatch =
                         i.activity.toLowerCase().includes(this.search.toLowerCase());
                     return statusMatch && searchMatch;
                 });
 
             } else {
                 return this.data.filter(i => {
                     const statusMatch = this.selectedYear
                         ? (this.selectedYear === 'Draft'
                             ? !i.status
                             : i.status && ((this.selectedYear === 'Pending' && i.status.is_approved === 2) ||
                                 (this.selectedYear === 'Approved' && i.status.is_approved === 1) ||
                                 (this.selectedYear === 'Rejected' && i.status.is_approved === 0)))
                         : true;
                     const searchMatch =
                         i.activity.toLowerCase().includes(this.search.toLowerCase());
                     return statusMatch && searchMatch;
                 });
 
             } */
            return this.data.filter(i => {
                const yearMatch = this.selectedYear
                    ? new Date(i.createdAt).getFullYear() === this.selectedYear
                    : true;
                const searchMatch =
                    i.procedure.toLowerCase().includes(this.search.toLowerCase());
                return yearMatch && searchMatch;
            });

        },
        years() {
            if (this.role != 1) {
                return ['Draft', 'Pending', 'Approved', 'Rejected'];
            } else {
                const uniqueYears = [...new Set(this.data.map(i => new Date(i.date_created).getFullYear()))];
                return uniqueYears.sort((a, b) => b - a);
            }

        },
    },
    methods: {
        getStatusColor(status) {
            return status == 1 ? 'success' : (status == 0 ? 'error' : 'warning')
        },
        statusName(status) {
            return status == 1 ? 'Approved' : (status == 0 ? 'Rejected' : 'Pending')
        },
        exportCSV() {
            const csvContent = [
                ['ACADEMIC YEAR', 'DEPARTMENT', 'Activity/Process/Procedure:', 'Hazards/Risks Description', 'Who/What is at Risks?', 'Action'],
                ...this.filteredItems.map(row => [
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
        },
        showValidation(data) {
            this.validationAlert = {
                content: data,
                show: true
            }
        },
        open(item) {
            window.location.href = `/risk/risk-management/view/${item.riskId}`;
        },
    }
};
</script>