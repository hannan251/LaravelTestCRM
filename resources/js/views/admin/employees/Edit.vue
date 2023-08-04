<template>
    <div class="row justify-content-center my-5">
        <div class="col-md-6">
            <div class="card border-0 shadow-sm">
                <div class="card-body">
                    <form @submit.prevent="submitForm">
                        <!-- First Name -->
                        <div class="mb-3">
                            <label for="employee-first-name" class="form-label">
                                First Name
                            </label>
                            <input v-model="employee.first_name" id="employee-first-name" type="text" class="form-control">
                            <div class="text-danger mt-1">
                                {{ errors.first_name }}
                            </div>
                            <div class="text-danger mt-1">
                                <div v-for="message in validationErrors?.first_name">
                                    {{ message }}
                                </div>
                            </div>
                        </div>
                        <!-- Last Name -->
                        <div class="mb-3">
                            <label for="employee-last-name" class="form-label">
                                Last Name
                            </label>
                            <input v-model="employee.last_name" id="employee-last_name" type="text" class="form-control">
                            <div class="text-danger mt-1">
                                {{ errors.last_name }}
                            </div>
                            <div class="text-danger mt-1">
                                <div v-for="message in validationErrors?.last_name">
                                    {{ message }}
                                </div>
                            </div>
                        </div>
                        <!-- Company -->
                        <div class="mb-3">
                            <label for="employee-company" class="form-label">
                                Company
                            </label>
                            <v-select v-model="employee.company_id" :options="companyList" :reduce="company => company.id" label="name" class="form-control" />
                            <div class="text-danger mt-1">
                                {{ errors.company_id }}
                            </div>
                            <div class="text-danger mt-1">
                                <div v-for="message in validationErrors?.company_id">
                                    {{ message }}
                                </div>
                            </div>
                        </div>
                        <!-- Email -->
                        <div class="mb-3">
                            <label for="employee-email" class="form-label">
                                Email
                            </label>
                            <input v-model="employee.email" id="employee-email" type="email" class="form-control">
                            <div class="text-danger mt-1">
                                {{ errors.email }}
                            </div>
                            <div class="text-danger mt-1">
                                <div v-for="message in validationErrors?.email">
                                    {{ message }}
                                </div>
                            </div>
                        </div>
                        <!-- Website -->
                        <div class="mb-3">
                            <label for="employee-phone" class="form-label">
                                Phone
                            </label>
                            <input v-model="employee.phone" id="employee-phone" type="text" class="form-control">
                            <div class="text-danger mt-1">
                                {{ errors.phone }}
                            </div>
                            <div class="text-danger mt-1">
                                <div v-for="message in validationErrors?.phone">
                                    {{ message }}
                                </div>
                            </div>
                        </div>
                        <!-- Buttons -->
                        <div class="mt-4">
                            <button :disabled="isLoading" class="btn btn-primary">
                                <div v-show="isLoading" class=""></div>
                                <span v-if="isLoading">Processing...</span>
                                <span v-else>Save</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
    import { onMounted, reactive, watchEffect } from "vue";
    import { useRoute } from "vue-router";
    import useCompanies from "@/composables/companies";
    import useEmployees from "@/composables/employees";
    import { useForm, useField, defineRule } from "vee-validate";
    import { required, min } from "../../../validation/rules"
    defineRule('required', required)
    defineRule('min', min);

    // Define a validation schema
    const schema = {
        first_name: 'required',
        last_name: 'required',
        company_id: 'required'
    }
    // Create a form context with the validation schema
    const { validate, errors, resetForm } = useForm({ validationSchema: schema })
    // Define actual fields for validation
    const { value: first_name } = useField('first_name', null, { initialValue: '' });
    const { value: last_name } = useField('last_name', null, { initialValue: '' });
    const { value: company_id } = useField('company_id', null, { initialValue: '', label: 'company' });
    const { companyList, getCompanyList } = useCompanies()
    const { employee: employeeData, getEmployee, updateEmployee, validationErrors, isLoading } = useEmployees()
    const employee = reactive({
        first_name,
        last_name,
        company_id,
        email: '',
        phone:''
    })
    const route = useRoute()
    function submitForm() {
        validate().then(form => { if (form.valid) updateEmployee(employee) })
    }
    onMounted(() => {
        getEmployee(route.params.id)
        getCompanyList()
    })
    // https://vuejs.org/api/reactivity-core.html#watcheffect
    watchEffect(() => {
        employee.id = employeeData.value.id
        employee.first_name = employeeData.value.first_name
        employee.last_name = employeeData.value.last_name
        employee.company_id = employeeData.value.company
        employee.email = employeeData.value.email
        employee.phone = employeeData.value.phone

    })
</script>
