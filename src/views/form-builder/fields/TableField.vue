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
                    <th width="60"></th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="(row, rowIndex) in rows" :key="rowIndex">
                    <td v-for="col in field.columns" :key="col.model">

                        <!-- TEXT / NUMBER -->
                        <v-text-field v-if="col.type === 'text' || col.type === 'number'" v-model="row[col.model]"
                            :type="col.type" density="compact" variant="plain" placeholder="Entry..." hide-details />

                        <!-- TEXTAREA -->
                        <v-textarea v-else-if="col.type === 'textarea'" v-model="row[col.model]" density="compact"
                            variant="plain" rows="1" auto-grow placeholder="Entry..." hide-details />

                    </td>

                    <!-- DELETE -->
                    <td class="text-center">
                        <v-btn icon size="x-small" v-if="rows.length > 1" @click="removeRow(rowIndex)">
                            <v-icon color="red">mdi-close</v-icon>
                        </v-btn>
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

<script>
export default {
    name: "TableField",
    props: {
        field: Object,
        modelValue: {
            type: Array,
            default: () => []
        }
    },
    emits: ["update:modelValue"],

    computed: {
        rows: {
            get() {
                return this.modelValue;
            },
            set(val) {
                this.$emit("update:modelValue", val);
            }
        }
    },

    mounted() {
        // ✅ AUTO ADD FIRST ROW (IMPORTANT)
        if (!this.rows || this.rows.length === 0) {
            this.addRow();
        }
    },

    methods: {
        addRow() {
            const newRow = {};

            this.field.columns.forEach(col => {
                newRow[col.model] = "";
            });

            this.rows.push(newRow);
        },

        removeRow(index) {
            this.rows.splice(index, 1);
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