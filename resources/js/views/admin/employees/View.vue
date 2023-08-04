<template>
    <div class="row justify-content-center my-5">
        <div class="col-md-6">
            <div class="card border-0 shadow-sm">
                <div class="card-body">
                    <form @submit.prevent="submitForm">
                        <!-- Title -->
                        <div class="mb-3">
                            <table class="table">
                                <tbody>
                                    <tr>
                                        <td><h3>First Name:</h3></td>
                                        <td><h5>{{ employee.first_name }}</h5></td>
                                    </tr>
                                    <tr>
                                        <td><h3>Last Name:</h3></td>
                                        <td><h5>{{ employee.last_name }}</h5></td>
                                    </tr>
                                    <tr>
                                        <td><h3>Company:</h3></td>
                                        <td><h5>{{ employee.company }}</h5></td>
                                    </tr>
                                    <tr>
                                        <td><h3>Email:</h3></td>
                                        <td><h5>{{ employee.email }}</h5></td>
                                    </tr>
                                    <tr>
                                        <td><h3>Phone:</h3></td>
                                        <td><h5>{{ employee.phone }}</h5></td>
                                    </tr>
                                </tbody>
                            </table>
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
import { useField } from "vee-validate";

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
        employee.company = employeeData.value.company
        employee.email = employeeData.value.email
        employee.phone = employeeData.value.phone

    })
</script>
