<template>
    <div class="row justify-content-center my-2">
        <div class="col-md-12">
            <div class="card border-0">
                <div class="card-header bg-transparent">
                    <h5 class="float-start">Employees</h5>
                    <router-link v-if="can('employee-create')" :to="{ name: 'employees.create' }" class="btn btn-primary btn-sm float-end">
                        Create Employee
                    </router-link>
                </div>
                <div class="card-body shadow-sm">
                    <div class="mb-4">
                        <input v-model="search_global" type="text" placeholder="Search..."
                               class="form-control w-25">
                    </div>
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                            <tr>
                                <th class="px-6 py-3 bg-gray-50 text-left">
                                    <input v-model="search_id" type="text"
                                           class="inline-block mt-1 form-control"
                                           placeholder="Filter by ID">
                                </th>
                                <th class="px-6 py-3 bg-gray-50 text-left">
                                    <input v-model="search_first_name" type="text"
                                           class="inline-block mt-1 form-control"
                                           placeholder="Filter by First Name">
                                </th>
                                <th class="px-6 py-3 bg-gray-50 text-left">
                                    <select v-model="search_company" class="form-control w-100">
                                        <option value="">Select</option>
                                        <option v-for="company in companyList" v-bind:value="{ id: company.id, text: company.name }">
                                            {{ company.name }}
                                        </option>
                                    </select>
                                    <!-- <v-select v-model="search_company" :options="companyList"
                                              :reduce="company => company.id" label="text" class="form-control w-100"/> -->
                                </th>
                                <th class="px-6 py-3 bg-gray-50 text-left">
                                    <input v-model="search_email" type="text"
                                           class="inline-block mt-1 form-control"
                                           placeholder="Filter by Email">
                                </th>
                                <th class="px-6 py-3 text-start"></th>
                                <th class="px-6 py-3 text-start"></th>
                            </tr>
                            <tr>
                                <th class="px-6 py-3 text-start">
                                    <div class="flex flex-row"
                                         @click="updateOrdering('id')">
                                        <div class="font-medium text-uppercase"
                                             :class="{ 'font-bold text-blue-600': orderColumn === 'id' }">
                                            ID
                                        </div>
                                        <div class="select-none">
                                <span :class="{
                                  'text-blue-600': orderDirection === 'asc' && orderColumn === 'id',
                                  'hidden': orderDirection !== '' && orderDirection !== 'asc' && orderColumn === 'id',
                                }">&uarr;</span>
                                            <span :class="{
                                  'text-blue-600': orderDirection === 'desc' && orderColumn === 'id',
                                  'hidden': orderDirection !== '' && orderDirection !== 'desc' && orderColumn === 'id',
                                }">&darr;</span>
                                        </div>
                                    </div>
                                </th>
                                <th class="px-6 py-3 text-left">
                                    <div class="flex flex-row"
                                         @click="updateOrdering('first_name')">
                                        <div class="font-medium text-uppercase"
                                             :class="{ 'font-bold text-blue-600': orderColumn === 'first_name' }">
                                            First Name
                                        </div>
                                        <div class="select-none">
                                <span :class="{
                                  'text-blue-600': orderDirection === 'asc' && orderColumn === 'last_name',
                                  'hidden': orderDirection !== '' && orderDirection !== 'asc' && orderColumn === 'last_name',
                                }">&uarr;</span>
                                            <span :class="{
                                  'text-blue-600': orderDirection === 'desc' && orderColumn === 'last_name',
                                  'hidden': orderDirection !== '' && orderDirection !== 'desc' && orderColumn === 'last_name',
                                }">&darr;</span>
                                        </div>
                                    </div>
                                </th>
                                <th class="px-6 py-3 bg-gray-50 text-left">
                                    <span class="text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Last Name</span>
                                </th>
                                <th class="px-6 py-3 bg-gray-50 text-left">
                                    <span class="text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Company</span>
                                </th>
                                <th class="px-6 py-3 bg-gray-50 text-left">
                                    <span class="text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Email</span>
                                </th>
                                <th class="px-6 py-3 bg-gray-50 text-left">
                                    <span class="text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Phone</span>
                                </th>
                                <th class="px-6 py-3 bg-gray-50 text-left">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="employee in employees.data" :key="employee.id">
                                <td class="px-6 py-4 text-sm">
                                    {{ employee.id }}
                                </td>
                                <td class="px-6 py-4 text-sm">
                                    {{ employee.first_name }}
                                </td>
                                <td class="px-6 py-4 text-sm">
                                    {{ employee.last_name }}
                                </td>
                                <td class="px-6 py-4 text-sm">
                                    {{ employee.company }}
                                </td>
                                <td class="px-6 py-4 text-sm">
                                    {{ employee.email }}
                                </td>
                                <td class="px-6 py-4 text-sm">
                                    {{ employee.phone }}
                                </td>
                                <td class="px-6 py-4 text-sm">
                                    <router-link v-if="can('employee-edit')"
                                                 :to="{ name: 'employees.view', params: { id: employee.id } }" class="badge bg-primary">View
                                    </router-link>
                                    <router-link v-if="can('employee-edit')"
                                                 :to="{ name: 'employees.edit', params: { id: employee.id } }" class="ms-2 badge bg-primary">Edit
                                    </router-link>
                                    <a href="#" v-if="can('employee-delete')" @click.prevent="deleteEmployee(employee.id)"
                                       class="ms-2 badge bg-danger">Delete</a>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="card-footer">
                    <Pagination :data="employees" :limit="3"
                                @pagination-change-page="page => getEmployees(page, search_company, search_id, search_first_name,search_email, search_global, orderColumn, orderDirection)"
                                class="mt-4"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import {ref, onMounted, watch} from "vue";
    import useEmployees from "@/composables/employees";
    import useCompanies from "@/composables/companies";
    import {useAbility} from '@casl/vue'

    const search_company = ref('')
    const search_id = ref('')
    const search_first_name = ref('')
    const search_email = ref('')
    const search_global = ref('')
    const orderColumn = ref('created_at')
    const orderDirection = ref('desc')
    const {employees, getEmployees, deleteEmployee} = useEmployees()
    const {companyList, getCompanyList} = useCompanies()
    const {can} = useAbility();
    onMounted(() => {
        getEmployees()
        getCompanyList()
    })
    const updateOrdering = (column) => {
        orderColumn.value = column;
        orderDirection.value = (orderDirection.value === 'asc') ? 'desc' : 'asc';
        getEmployees(
            1,
            search_company.value,
            search_id.value,
            search_first_name.value,
            search_email.value,
            search_global.value,
            orderColumn.value,
            orderDirection.value
        );
    }
    watch(search_company, (current, previous) => {
        getEmployees(
            1,
            current,
            search_id.value,
            search_first_name.value,
            search_email.value,
            search_global.value
        )
    })
    watch(search_id, (current, previous) => {
        getEmployees(
            1,
            search_company.value,
            current,
            search_first_name.value,
            search_email.value,
            search_global.value
        )
    })
    watch(search_first_name, (current, previous) => {
        getEmployees(
            1,
            search_company.value,
            search_id.value,
            current,
            search_email.value,
            search_global.value
        )
    })
    watch(search_email, (current, previous) => {
        getEmployees(
            1,
            search_company.value,
            search_id.value,
            search_first_name.value,
            current,
            search_global.value
        )
    })
    watch(search_global, _.debounce((current, previous) => {
        getEmployees(
            1,
            search_company.value,
            search_id.value,
            search_first_name.value,
            search_email.value,
            current
        )
    }, 200))

</script>
