<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="revisions"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Revision History</v-toolbar-title>
        </v-toolbar>
      </template>

      <!-- Optional formatting for date -->
      <template v-slot:item.updated_at="{ item }">
        {{ new Date(item.updated_at).toLocaleString() }}
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { defineComponent } from 'vue';
export default defineComponent({
  name:'VersionTableList',
    props:{
        headers:Object,
        revisions:{
            type:Object,
            required:true
        }
    },
})
</script>
