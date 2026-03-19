<template>

    <DepartmentHeadView v-if="user === 1" />
    <QMRView v-else-if="user === 2" />
    <SchoolDirector v-else />

</template>
<script>
import { defineComponent } from 'vue';
import DepartmentHeadView from './workflow/DepartmentHeadView.vue';
import QMRView from './workflow/QMRView.vue';
import SchoolDirector from './workflow/SchoolDirector.vue';

export default defineComponent({
    name: 'ApprovalWorkflow',
    data() {
        return {
            user: 1
        }
    },
    components: {
        DepartmentHeadView,
        QMRView,
        SchoolDirector,

    }
})
</script>