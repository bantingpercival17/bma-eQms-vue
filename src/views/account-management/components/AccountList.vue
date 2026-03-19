<template>
    <v-list border rounded="lg" class="py-0" aria-busy="true" aria-label="transaction data">
        <v-list-item class="py-4 px-6" v-for="(item, i) in accountList" :key="i">
            <!-- Avatar -->
            <template v-slot:prepend>
                <v-avatar size="100" :image="item.image" rounded="md" />
            </template>

            <!-- Main Content -->
            <div class="d-flex flex-column">
                <h6 class="text-subtitle-1 mb-1">{{ item.fullname }}</h6>
                <span class="text-caption text-lightText mb-1">{{ item.email }}</span>

                <!-- Role and Status -->
                <div class="d-flex align-center gap-2">
                    <v-chip size="small" color="primary" variant="flat">{{ item.role }}</v-chip>
                    <v-chip class="ms-3" size="small" :color="item.status === 1 ? 'success' : 'error'" variant="flat">
                        {{ item.status === 1 ? 'Active' : 'Deactive' }}
                    </v-chip>
                </div>
            </div>

            <!-- Append -->
            <template v-slot:append>
                <div class="text-right">
                    <!-- Group Button with Dropdown -->
                    <v-menu>
                        <template v-slot:activator="{ props }">
                            <v-btn variant="tonal" color="secondary" v-bind="props">
                                ACTION
                            </v-btn>
                        </template>
                        <v-list border rounded="lg" density="compact" class="py-0" aria-busy="true"
                            aria-label="transaction data">

                            <v-list-item @click="viewProfile(item.id)">
                                <v-list-item-title>View</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="deleteUser(item)">
                                <v-list-item-title>Deactive</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="resetPassword(item)">
                                <v-list-item-title>Reset Password</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </div>
            </template>
        </v-list-item>
    </v-list>
    <ProfileView v-if="content.profile" v-model="showModal" :content="content" />

</template>
<script>
import { defineComponent } from 'vue';
import ProfileView from '../widgets/ProfileView.vue';
import { GeneralController } from '@/stores/GeneralController';

export default defineComponent({
    name: 'AccountList',
    data() {
        return {
            showModal: false,
            content: {
                profile: [],
                isModalLoading: true
            }
        }
    }, components: {
        ProfileView
    },
    props: {
        accountList: Object
    },
    methods: {
        async viewProfile(data) {
            this.showModal = true
            const response = await GeneralController.retrieveData('account/retrieve-account', { account: data }, 'profile')
            if (response) {
                this.content = {
                    profile: response,
                    isModalLoading: false
                }
            }
        }
    }
})
</script>