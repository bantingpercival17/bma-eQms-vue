<template>
    <CardHeader title="ACCOUNT MANAGEMENT" class="overflow-hidden">
        <div class="">
            <template v-if="contentLoading">
                <div class="d-flex justify-center align-center pa-5">
                    <img src="@/assets/images/loading.gif" alt="Loading" />
                </div>
            </template>
            <template v-else>
                <v-tabs v-model="tab" color="success" class="px-6">
                    <v-tab value="one" class="font-weight-medium">EMPLOYEE LIST</v-tab>
                    <v-tab value="two" class="font-weight-medium">CREATE ACCOUNT</v-tab>
                </v-tabs>
                <v-window v-model="tab">
                    <v-window-item value="one">
                        <AccountList :accountList="accountList" />
                    </v-window-item>
                    <v-window-item value="two">
                        <CreateAccount :departments="departments" :roles="roles" />
                    </v-window-item>
                </v-window>
            </template>

        </div>
    </CardHeader>
</template>
<script>
import { defineComponent } from 'vue';
import { GeneralController } from '@/stores/GeneralController';
import CardHeader from '@/components/shared/CardHeader.vue';
import AccountList from './components/AccountList.vue';
import CreateAccount from './components/CreateAccount.vue';

export default defineComponent({
    name: 'VersionControl',
    data() {
        return {
            tab: null,
            contentLoading: true,
            accountList: [],
            departments: [],
            roles: [],
        }
    },
    components: {
        CardHeader, AccountList, CreateAccount
    },
    async mounted() {
        const response = await GeneralController.retrieveData('account/retrieve-accounts', { search: null }, 'content');
        if (response) {
            this.accountList = response.accounts;
            this.departments = response.departments;
            this.roles = response.roles;
            this.contentLoading = false
        }
    }
})
</script>