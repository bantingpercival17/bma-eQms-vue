<template>
    <AmendmentTableList :data="amendmentList" :headers="verificationHeaders" />
</template>

<script>
import { defineComponent } from 'vue';
import AmendmentTableList from './components/AmendmentTableList.vue';

export default defineComponent({
    name: 'QMRView',
    components: {
        AmendmentTableList
    },
    data() {
        const verificationHeaders = [
            { title: 'Status', key: 'status', align: 'start' },
            { title: 'Amendment Control', key: 'amendmentControl', align: 'start' },
            { title: 'Procedure / Forms Name', key: 'name', align: 'start' },
            { title: 'Creator', key: 'createBy', align: 'start' },
            { title: 'Description', key: 'descriptionOfChanges', align: 'start' },
            { title: 'Submission Date', key: 'submittedData', align: 'start' },
        ];
        return {
            verificationHeaders
        }
    },
    props: {
        amendmentList: Object
    }
})
</script>