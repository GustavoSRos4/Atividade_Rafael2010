import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import PessoaListPage from '../pages/pessoas/PessoaListPage.vue'

const routes = [
    {
        path: '/',
        component: MainLayout,
        children: [
            { path: '', name: 'home', component: PessoaListPage },
            // adicione outras rotas aqui
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router