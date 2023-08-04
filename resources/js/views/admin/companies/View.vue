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
                                        <td><h3>Name:</h3></td>
                                        <td><h5>{{ company.name }}</h5></td>
                                    </tr>
                                    <tr>
                                        <td><h3>Email:</h3></td>
                                        <td><h5>{{ company.email }}</h5></td>
                                    </tr>
                                    <tr>
                                        <td><h3>Website:</h3></td>
                                        <td><h5>{{ company.website }}</h5></td>
                                    </tr>
                                    <tr>
                                        <td><h3>Logo:</h3></td>
                                        <td><img :src="`/storage/${company.logo}`" width="75" height="75"/></td>
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
import { useField } from "vee-validate";

    const { value: name } = useField('name', null, { initialValue: '' });
    const { company: companyData, getCompany, validationErrors, isLoading } = useCompanies()
    const company = reactive({
        name,
        email: '',
        website: '',
        logo:''
    })

    const route = useRoute()
    function submitForm() {
        validate().then(form => { if (form.valid) updateCategory(category) })
    }
    onMounted(() => {
        getCompany(route.params.id)
    })
    // https://vuejs.org/api/reactivity-core.html#watcheffect
    watchEffect(() => {
        company.name = companyData.value.name
        company.email = companyData.value.email
        company.website = companyData.value.website
        company.logo = companyData.value.logo

    })
</script>
