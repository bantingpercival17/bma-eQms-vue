<template>
    <v-container>
        <div v-if="isSubmit" class="">
            <div class="d-flex flex-column justify-center align-center pa-5">
                <img src="@/assets/images/formLoader.gif" alt="Loading" />
                <p class="h3 text-primary font-weight-bold mt-3">LOADING...</p>
            </div>
        </div>
        <v-form v-else ref="accountForm" @submit.prevent="submitForm">
            <!-- First Name -->
            <v-text-field v-model="firstName" :rules="[rules.required]" label="First Name" required></v-text-field>

            <!-- Last Name -->
            <v-text-field v-model="lastName" :rules="[rules.required]" label="Last Name" required></v-text-field>

            <!-- Email (Optional) -->
            <v-text-field v-model="email" :rules="[rules.optionalEmail]" label="Email (Optional)"></v-text-field>

            <!-- Role Dropdown -->
            <v-select v-model="role" :items="roles" item-title="name" item-value="id" :rules="[rules.required]"
                label="Role" required></v-select>

            <!-- Department Dropdown -->
            <v-select v-model="department" :items="departments" item-title="name" item-value="id"
                :rules="[rules.required]" label="Department" required></v-select>

            <!-- Submit Button -->
            <v-btn type="submit" color="primary" class="mt-4">Create Account</v-btn>
        </v-form>
    </v-container>
</template>
<script>
import { GeneralController } from '@/stores/GeneralController';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'CreateAccount',
    data() {
        return {

            isSubmit: false,
            firstName: '',
            lastName: '',
            role: '',
            department: '',
            email: '',
            rules: {
                required: value => !!value || 'This field is required',
                optionalEmail: value =>
                    !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Email must be valid'
            }
        }
    },
    props: {
        roles: Object,
        departments: Object
    },
    methods: {
        async submitForm() {
            const isValid = await this.$refs.accountForm.validate();
            if (!isValid.valid) {
                // Show error or stop the process
                console.warn('Form validation failed');
                return;
            }

            this.isSubmit = true;

            const formData = new FormData();
            formData.append('first_name', this.firstName);
            formData.append('last_name', this.lastName);
            formData.append('email', this.email || '');
            formData.append('role', this.role);
            formData.append('department', this.department);

            try {
                const response = await GeneralController.storeItem('account/create-account', formData);
                console.log('Account created:', response);
                if (response.ok) {
                    this.isSubmit = false;
                    this.firstName = '';
                    this.lastName = '';
                    this.email = '';
                    this.role = '';
                    this.department = '';
                }
                // Optionally reset form or give success feedback
            } catch (error) {
                console.error('Failed to create account:', error);
                // Handle server errors here (e.g. show error to user)
            }
        }
    }
})
</script>