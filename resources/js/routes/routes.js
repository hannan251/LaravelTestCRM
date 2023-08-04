import Cookies from 'js-cookie'
import store from "../store";

const AuthenticatedLayout = () => import('../layouts/Authenticated.vue')
const GuestLayout = ()  => import('../layouts/Guest.vue');


function requireLogin(to, from, next) {
    let isLogin = false;
    isLogin = !!store.state.auth.authenticated;

    if (isLogin) {
        next()
    } else {
        next('/login')
    }
}

function guest(to, from, next) {
    let isLogin;
    isLogin = !!store.state.auth.authenticated;

    if (isLogin) {
        next('/')
    } else {
        next()
    }
}

export default [
    {
        path: '/',
        // redirect: { name: 'login' },
        component: GuestLayout,
        children: [
            {
                path: '/',
                name: 'home',
                component: () => import('../views/home/index.vue'),
            },
            {
                path: 'login',
                name: 'auth.login',
                component: () => import('../views/login/Login.vue'),
                beforeEnter: guest,
            },
            {
                path: 'register',
                name: 'auth.register',
                component: () => import('../views/register/index.vue'),
                beforeEnter: guest,
            },
        ]
    },
    {
        path: '/admin',
        component: AuthenticatedLayout,
        // redirect: {
        //     name: 'admin.index'
        // },
        beforeEnter: requireLogin,
        children: [
            {
                name: 'admin.index',
                path: '',
                component: () => import('../views/admin/index.vue'),
                meta: { breadCrumb: 'Admin' }
            },
            {
                name: 'profile.index',
                path: 'profile',
                component: () => import('../views/admin/profile/index.vue'),
                meta: { breadCrumb: 'Profile' }
            },
            {
                name: 'companies.index',
                path: 'companies',
                component: () => import('../views/admin/companies/index.vue'),
                meta: { breadCrumb: 'Companies' }
            },
            {
                name: 'companies.create',
                path: 'companies/create',
                component: () => import('../views/admin/companies/create.vue'),
                meta: { breadCrumb: 'Add new Company' }
            },
            {
                name: 'companies.edit',
                path: 'companies/edit/:id',
                component: () => import('../views/admin/companies/edit.vue'),
                meta: { breadCrumb: 'Edit Company' }
            },
            {
                name: 'companies.view',
                path: 'companies/view/:id',
                component: () => import('../views/admin/companies/view.vue'),
                meta: { breadCrumb: 'View Company' }
            },
            {
                name: 'employees.index',
                path: 'employees',
                component: () => import('../views/admin/employees/index.vue'),
                meta: { breadCrumb: 'Employees' }
            },
            {
                name: 'employees.create',
                path: 'employees/create',
                component: () => import('../views/admin/employees/create.vue'),
                meta: { breadCrumb: 'Add new Employee' }
            },
            {
                name: 'employees.edit',
                path: 'employees/edit/:id',
                component: () => import('../views/admin/employees/edit.vue'),
                meta: { breadCrumb: 'Edit Employee' }
            },
            {
                name: 'employees.view',
                path: 'employees/view/:id',
                component: () => import('../views/admin/employees/view.vue'),
                meta: { breadCrumb: 'View Employee' }
            },
            {
                name: 'users.index',
                path: 'users',
                component: () => import('../views/admin/users/index.vue'),
                meta: { breadCrumb: 'Users' }
            },
        ]
    },
    {
        path: "/:pathMatch(.*)*",
        name: 'NotFound',
        component: () => import("../views/errors/404.vue"),
    },
];
