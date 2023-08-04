<template>
    <div class="row justify-content-center my-5">
        <div class="col-md-6">
            <div class="card border-0 shadow-sm">
                <div class="card-body">
                    <form @submit.prevent="submitForm">
                        <!-- Name -->
                        <div class="mb-3">
                            <label for="company-name" class="form-label">
                                Name
                            </label>
                            <input v-model="company.name" id="company-name" type="text" class="form-control">
                            <div class="text-danger mt-1">
                                {{ errors.name }}
                            </div>
                            <div class="text-danger mt-1">
                                <div v-for="message in validationErrors?.name">
                                    {{ message }}
                                </div>
                            </div>
                        </div>
                        <!-- Email -->
                        <div class="mb-3">
                            <label for="company-email" class="form-label">
                                Email
                            </label>
                            <input v-model="company.email" id="company-email" type="email" class="form-control">
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
                            <label for="company-website" class="form-label">
                                Website
                            </label>
                            <input v-model="company.website" id="company-website" type="text" class="form-control">
                            <div class="text-danger mt-1">
                                {{ errors.website }}
                            </div>
                            <div class="text-danger mt-1">
                                <div v-for="message in validationErrors?.website">
                                    {{ message }}
                                </div>
                            </div>
                        </div>
                        <!-- Logo -->
                        <div class="mb-3">
                            <label for="logo" class="form-label">
                                Logo
                            </label>
                            <input @change="company.logo = $event.target.files[0]" type="file" class="form-control" id="logo" />
                            <div class="text-danger mt-1">
                                <div v-for="message in validationErrors?.logo">
                                    {{ message }}
                                </div>
                            </div>
                        </div>
                        <div class="mb-3">
                            <img :src="`/storage/${company.logo}`" width="100" height="100"/>
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
    import { useForm, useField, defineRule } from "vee-validate";
    import { required, min } from "../../../validation/rules"
    defineRule('required', required)
    defineRule('min', min);

    // Define a validation schema
    const schema = {
        name: 'required',
    }
    // Create a form context with the validation schema
    const { validate, errors, resetForm } = useForm({ validationSchema: schema })
    // Define actual fields for validation
    const { value: name } = useField('name', null, { initialValue: '' });
    const { company: companyData, getCompany, updateCompany, validationErrors, isLoading } = useCompanies()
    const company = reactive({
        name,
        email: '',
        website: '',
        logo:''
    })
    const route = useRoute()
    function submitForm() {
        console.log(company);
        validate().then(form => { if (form.valid) updateCompany(company) })
    }
    onMounted(() => {
        getCompany(route.params.id)
    })
    // https://vuejs.org/api/reactivity-core.html#watcheffect
    watchEffect(() => {
        company.id = companyData.value.id
        company.name = companyData.value.name
        company.email = companyData.value.email
        company.website = companyData.value.website
        company.logo = companyData.value.logo
    })
</script>
