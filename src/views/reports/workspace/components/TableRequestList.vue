<template>
    <v-container>
        <v-toolbar flat class="d-flex justify-space-between align-center">
            <v-toolbar-title class="text-h6 font-weight-bold">
                LIST OF REQUESTS
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
            <template v-slot:item.created_at="{ item }">
                <span>
                    {{ convertDate(item.created_at) }}
                </span>

            </template>
            <template v-slot:item.status="{ item }">
                <template v-if="item.status !== null">
                    <v-chip dark>
                        View Report
                    </v-chip>
                </template>
                <template v-else>
                    <v-chip color="secondary">Draft</v-chip>
                    <v-chip @click="$emit('submit', item)" class="ms-3" color="primary" dark>Submit</v-chip>
                </template>
            </template>
            <template v-slot:item.form_name="{ item }">
                <v-menu>
                    <template v-slot:activator="{ props }">
                        <label v-bind="props" class="text-primary fw-bolder"><b>{{ (item.form_name) }}</b></label>
                    </template>
                    <v-list border rounded="lg" density="compact" class="py-0" aria-busy="true"
                        aria-label="transaction data">
                        <v-list-item @click="$emit('view', item)">
                            <v-list-item-title>VIEW</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="$emit('edit', item)">
                            <v-list-item-title>EDIT</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="$emit('removed', item)">
                            <v-list-item-title>REMOVE</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
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
    emits: ['edit', 'view', 'removed'],
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
    },
    methods: {
        convertDate(current) {
            const date = new Date(current);

            const formatted = date.toLocaleDateString('en-US', {
                month: 'long',  // F
                day: '2-digit', // d
                year: 'numeric' // Y
            });
            return formatted;
        }
    }
}
</script>