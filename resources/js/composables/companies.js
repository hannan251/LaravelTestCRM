import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'

export default function useCompanies() {
    const companies = ref({})
    const companyList = ref([])
    const company = ref({
        name: '',
        email: '',
        website: '',
        logo: '',
    })
    const router = useRouter()
    const validationErrors = ref({})
    const isLoading = ref(false)
    const swal = inject('$swal')

    const getCompanies = async (
        page = 1,
        search_category = '',
        search_id = '',
        search_title = '',
        search_content = '',
        search_global = '',
        order_column = 'created_at',
        order_direction = 'desc'
    ) => {
        axios.get('/api/companies?page=' + page +
            '&search_category=' + search_category +
            '&search_id=' + search_id +
            '&search_title=' + search_title +
            '&search_content=' + search_content +
            '&search_global=' + search_global +
            '&order_column=' + order_column +
            '&order_direction=' + order_direction)
            .then(response => {
                companies.value = response.data;
            })
    }

    const getCompany = async (id) => {
        axios.get('/api/companies/' + id)
            .then(response => {
                company.value = response.data.data;
            })
    }

    const storeCompany = async (company) => {
        if (isLoading.value) return;

        isLoading.value = true
        validationErrors.value = {}

        let serializedCompany = new FormData()
        console.log(serializedCompany);
        for (let item in company) {
            if (company.hasOwnProperty(item)) {
                serializedCompany.append(item, company[item])
            }
        }
        console.log(serializedCompany);

        axios.post('/api/companies', serializedCompany)
            .then(response => {
                router.push({name: 'companies.index'})
                swal({
                    icon: 'success',
                    title: 'Company saved successfully'
                })
            })
            .catch(error => {
                if (error.response?.data) {
                    validationErrors.value = error.response.data.errors
                }
            })
            .finally(() => isLoading.value = false)
    }

    const updateCompany = async (company) => {
        if (isLoading.value) return;

        isLoading.value = true
        validationErrors.value = {}
        let serializedCompanyU = new FormData()
        serializedCompanyU.append('_method', 'PATCH')
        for (let itemu in company) {
            if (company.hasOwnProperty(itemu)) {
                serializedCompanyU.append(itemu, company[itemu])
            }
        }
        console.log(serializedCompanyU);

        axios.post(
            '/api/companies/' + company.id,
            serializedCompanyU,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(response => {
                router.push({name: 'companies.index'})
                swal({
                    icon: 'success',
                    title: 'Company updated successfully'
                })
            })
            .catch(error => {
                if (error.response?.data) {
                    validationErrors.value = error.response.data.errors
                }
            })
            .finally(() => isLoading.value = false)
    }

    const deleteCompany = async (id) => {
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
                    axios.delete('/api/companies/' + id)
                        .then(response => {
                            getCompanies()
                            router.push({name: 'companies.index'})
                            swal({
                                icon: 'success',
                                title: 'Company deleted successfully'
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
    const getCompanyList = async () => {
        axios.get('/api/company-list')
            .then(response => {
                console.log(response.data.data);
                companyList.value = response.data.data;
            })
    }

    return {
        companyList,
        companies,
        company,
        getCompanies,
        getCompanyList,
        getCompany,
        storeCompany,
        updateCompany,
        deleteCompany,
        validationErrors,
        isLoading
    }
}
