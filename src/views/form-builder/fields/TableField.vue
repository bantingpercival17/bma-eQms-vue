<template>
    <div class="pa-3 border rounded">

        <!-- LABEL -->
        <h4 class="text-subtitle-1 font-weight-bold mb-2">
            {{ field.label }}
        </h4>

        <!-- TABLE -->
        <v-table density="compact" class="border">
            <thead>
                <tr>
                    <th v-for="col in field.columns" :key="col.model">
                        {{ col.label }}
                    </th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="value in source" :key="value.id">
                    <td v-for="col in field.columns" :key="col.model">
                        <v-text-field v-if="col.type === 'text'" v-model="value[col.model]" density="comfortable"
                            hide-details="auto" variant="outlined" color="primary" width="200">
                        </v-text-field>
                        <v-textarea v-else-if="col.type === 'textarea'" v-model="value[col.model]" density="comfortable"
                            hide-details="auto" variant="outlined" color="primary">
                        </v-textarea>
                        <v-text-field v-else-if="col.type === 'number'" v-model="value[col.model]" type="number"
                            density="comfortable" hide-details="auto" variant="outlined" color="primary"></v-text-field>
                    </td>
                </tr>
            </tbody>
        </v-table>

        <!-- ADD ROW BUTTON -->
        <v-btn size="small" class="mt-2" @click="addRow">
            + Add Row
        </v-btn>

    </div>
</template>

<!-- <script>
export default {
    name: "TableField",
    props: {
        field: Object,
    },
    data() {
        return {
            source: []
        }
    },
    mounted() {
        // Initialize source with one empty row based on the columns defined in the field
        const initialRow = {};
        this.field.columns.forEach(col => {
            initialRow[col.model] = '';
        });
        this.source.push(initialRow);
    },
    methods: {
        addRow() {
            // How to add a new row to the table? We can push an empty object to the source array, and then use v-model in the table cells to bind the input values to the object properties.
            const newRow = {};
            this.field.columns.forEach(col => {
                newRow[col.model] = '';
            });
            this.source.push(newRow);
        },

        removeRow(index) {
            this.rows.splice(index, 1);
        }
    }
};
</script> -->
<script>
export default {
    name: "TableField",
    props: {
        field: Object,
        modelValue: [String, Number, Object] // ✅ receive data from parent
    },
    emits: ['update:modelValue'],

    data() {
        return {
            source: []
        }
    },

    mounted() {
        const initialRow = {};
        this.field.columns.forEach(col => {
            initialRow[col.model] = '';
        });
        this.source.push(initialRow);
    },

    watch: {
        source: {
            deep: true,
            handler(val) {
                this.$emit('update:modelValue', val); // ✅ send data to parent
            }
        }
    },

    methods: {
        addRow() {
            const newRow = {};
            this.field.columns.forEach(col => {
                newRow[col.model] = '';
            });
            this.source.push(newRow);
        },

        removeRow(index) {
            this.source.splice(index, 1);
        }
    }
};
</script>
<style scoped>
.border {
    border: 1px solid #e0e0e0;
    border-radius: 6px;
}
</style>