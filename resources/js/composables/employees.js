import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'

export default function useEmployees() {
    const employees = ref({})
    const employee = ref({
        title: '',
        content: '',
        company_id: '',
        thumbnail: ''
    })
    const router = useRouter()
    const validationErrors = ref({})
    const isLoading = ref(false)
    const swal = inject('$swal')

    const getEmployees = async (
        page = 1,
        search_category = '',
        search_id = '',
        search_title = '',
        search_content = '',
        search_global = '',
        order_column = 'created_at',
        order_direction = 'desc'
    ) => {
        axios.get('/api/employees?page=' + page +
            '&search_category=' + search_category +
            '&search_id=' + search_id +
            '&search_title=' + search_title +
            '&search_content=' + search_content +
            '&search_global=' + search_global +
            '&order_column=' + order_column +
            '&order_direction=' + order_direction)
            .then(response => {
                employees.value = response.data;
            })
    }

    const getEmployee = async (id) => {
        axios.get('/api/employees/' + id)
            .then(response => {
                employee.value = response.data.data;
            })
    }

    const storeEmployee = async (employee) => {
        if (isLoading.value) return;

        isLoading.value = true
        validationErrors.value = {}

        let serializedEmployee = new FormData()
        for (let item in employee) {
            if (employee.hasOwnProperty(item)) {
                serializedEmployee.append(item, employee[item])
            }
        }

        axios.post('/api/employees', serializedEmployee)
            .then(response => {
                router.push({name: 'employees.index'})
                swal({
                    icon: 'success',
                    title: 'Employee saved successfully'
                })
            })
            .catch(error => {
                if (error.response?.data) {
                    validationErrors.value = error.response.data.errors
                }
            })
            .finally(() => isLoading.value = false)
    }

    const updateEmployee = async (employee) => {
        if (isLoading.value) return;

        isLoading.value = true
        validationErrors.value = {}

        axios.put('/api/employees/' + employee.id, employee)
            .then(response => {
                router.push({name: 'employees.index'})
                swal({
                    icon: 'success',
                    title: 'Employee updated successfully'
                })
            })
            .catch(error => {
                if (error.response?.data) {
                    validationErrors.value = error.response.data.errors
                }
            })
            .finally(() => isLoading.value = false)
    }

    const deleteEmployee = async (id) => {
        swal({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this action!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            confirmButtonColor: '#ef4444',
            timer: 20000,
            timerProgressBar: true,
            reverseButtons: true
        })
            .then(result => {
                if (result.isConfirmed) {
                    axios.delete('/api/employees/' + id)
                        .then(response => {
                            getEmployees()
                            router.push({name: 'employees.index'})
                            swal({
                                icon: 'success',
                                title: 'Employee deleted successfully'
                            })
                        })
                        .catch(error => {
                            swal({
                                icon: 'error',
                                title: 'Something went wrong'
                            })
                        })
                }
            })

    }

    return {
        employees,
        employee,
        getEmployees,
        getEmployee,
        storeEmployee,
        updateEmployee,
        deleteEmployee,
        validationErrors,
        isLoading
    }
}
