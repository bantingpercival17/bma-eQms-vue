<template>
    <v-card>
        <v-list>
            <v-list-subheader class="">
                <v-row>
                    <v-col cols="8">
                        <span class="text-success">OBJECTIVES LIST</span>
                    </v-col>
                    <v-col>
                        <v-btn icon variant="outlined" color="primary" size="x-small" @click="$emit('add')">
                            <v-icon icon="mdi-plus"></v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-list-subheader>
            <template v-if="objectives.length > 0">
                <v-list-item v-for="(item, i) in objectives" :key="i" :value="item" color="primary" rounded="xl">
                    <!-- <template v-slot:prepend>
                        <v-icon :icon="item.icon"></v-icon>
                    </template> -->
                    <v-list-item-title @click="$emit('view', item.id)">
                        {{ item.quality_objective }}
                    </v-list-item-title>
                </v-list-item>
            </template>
            <template v-else>
                <v-list-item>
                    <v-list-item-title>No Objective</v-list-item-title>
                </v-list-item>
            </template>

        </v-list>
    </v-card>


</template>
<script>
export default {
    name: 'ListObjective',
    props: {
        objectives: Object,
    },
    emits: ['add','view'],
}
</script>