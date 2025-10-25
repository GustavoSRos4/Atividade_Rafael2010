<template>
    <q-page class="q-pa-md">
        <q-card>
            <q-card-section>
                <div class="text-h6">Lista de Pessoas</div>
                <q-btn color="primary" icon="add" label="Adicionar Pessoa" @click="abrirDialogAdicionar" />
            </q-card-section>
            <q-card-section>
                <q-table :rows="pessoas" :columns="columns" row-key="id" :loading="loading"
                    :pagination="{ rowsPerPage: 10 }">
                    <template v-slot:loading>
                        <q-inner-loading showing color="primary" />
                    </template>
                    <template v-slot:body-cell-acoes="props">
                        <q-td :props="props">
                            <q-btn flat round icon="delete" color="negative" @click="confirmarDeletar(props.row)" />
                        </q-td>
                    </template>
                </q-table>
            </q-card-section>
        </q-card>

        <!-- Dialog para adicionar/editar pessoa -->
        <q-dialog v-model="dialogAberto">
            <q-card style="min-width: 300px">
                <q-card-section>
                    <div class="text-h6">{{ editando ? 'Editar Pessoa' : 'Adicionar Pessoa' }}</div>
                </q-card-section>
                <q-card-section>
                    <q-form @submit="salvarPessoa">
                        <q-input v-model="pessoaForm.nome" label="Nome" required />
                        <q-input v-model.number="pessoaForm.idade" label="Idade" type="number" required />
                        <q-card-actions align="right">
                            <q-btn flat label="Cancelar" v-close-popup />
                            <q-btn type="submit" color="primary" label="Salvar" :loading="salvando" />
                        </q-card-actions>
                    </q-form>
                </q-card-section>
            </q-card>
        </q-dialog>

        <!-- Dialog de confirmação para deletar -->
        <q-dialog v-model="dialogConfirmarDeletar">
            <q-card>
                <q-card-section class="row items-center">
                    <q-avatar icon="delete" color="negative" text-color="white" />
                    <span class="q-ml-sm">Tem certeza que deseja deletar {{ pessoaParaDeletar?.nome }}?</span>
                </q-card-section>
                <q-card-actions align="right">
                    <q-btn flat label="Cancelar" v-close-popup />
                    <q-btn flat label="Deletar" color="negative" @click="deletarPessoa" />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-page>
</template>

<script setup>
import { pessoaService } from 'src/services'
import { ref, onMounted } from 'vue'

const pessoas = ref([])
const loading = ref(false)
const salvando = ref(false)

const columns = [
    { name: 'id', label: 'ID', field: 'id', align: 'left' },
    { name: 'nome', label: 'Nome', field: 'nome', align: 'left' },
    { name: 'idade', label: 'Idade', field: 'idade', align: 'left' },
    { name: 'acoes', label: 'Ações', align: 'center' }
]

const dialogAberto = ref(false)
const dialogConfirmarDeletar = ref(false)
const editando = ref(false)
const pessoaForm = ref({ nome: '', idade: 0 })
const pessoaParaDeletar = ref(null)

onMounted(async () => {
    await carregarPessoas()
})

async function carregarPessoas() {
    loading.value = true
    try {
        pessoas.value = await pessoaService.listarPessoas()
    } catch (error) {
        console.error('Erro ao carregar pessoas:', error)
        // Pode adicionar notificação de erro
    } finally {
        loading.value = false
    }
}

function abrirDialogAdicionar() {
    editando.value = false
    pessoaForm.value = { nome: '', idade: 0 }
    dialogAberto.value = true
}

// function abrirDialogEditar(pessoa) {
//     editando.value = true
//     pessoaForm.value = { ...pessoa }
//     dialogAberto.value = true
// }

function confirmarDeletar(pessoa) {
    pessoaParaDeletar.value = pessoa
    dialogConfirmarDeletar.value = true
}

async function salvarPessoa() {
    salvando.value = true
    try {
        if (editando.value) {
            // Para editar, assumindo que o backend tem PUT /api/pessoas/{id}
            // Mas o controller atual não tem PUT, só POST para criar
            // Vou usar POST para criar e DELETE para remover, mas para editar, talvez precise adicionar no backend
            // Por enquanto, deletar e criar nova
            await pessoaService.deletarPessoa(pessoaForm.value.id)
            const novaPessoa = await pessoaService.criarPessoa({ nome: pessoaForm.value.nome, idade: pessoaForm.value.idade })
            const index = pessoas.value.findIndex(p => p.id === pessoaForm.value.id)
            if (index !== -1) {
                pessoas.value[index] = novaPessoa
            }
        } else {
            const novaPessoa = await pessoaService.criarPessoa(pessoaForm.value)
            pessoas.value.push(novaPessoa)
        }
        dialogAberto.value = false
    } catch (error) {
        console.error('Erro ao salvar pessoa:', error)
    } finally {
        salvando.value = false
    }
}

async function deletarPessoa() {
    try {
        await pessoaService.deletarPessoa(pessoaParaDeletar.value.id)
        pessoas.value = pessoas.value.filter(p => p.id !== pessoaParaDeletar.value.id)
        dialogConfirmarDeletar.value = false
    } catch (error) {
        console.error('Erro ao deletar pessoa:', error)
    }
}
</script>
