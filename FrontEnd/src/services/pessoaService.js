import apiClient from './apiClient.js'

const pessoaService = {
  // Listar todas as pessoas
  async listarPessoas() {
    try {
      const response = await apiClient.get('/pessoas')
      return response.data
    } catch (error) {
      console.error('Erro ao listar pessoas:', error)
      throw error
    }
  },

  // Buscar pessoa por ID
  async buscarPessoa(id) {
    try {
      const response = await apiClient.get(`/pessoas/${id}`)
      return response.data
    } catch (error) {
      console.error('Erro ao buscar pessoa:', error)
      throw error
    }
  },

  // Criar nova pessoa
  async criarPessoa(pessoa) {
    try {
      const response = await apiClient.post('/pessoas', pessoa)
      return response.data
    } catch (error) {
      console.error('Erro ao criar pessoa:', error)
      throw error
    }
  },

  // Deletar pessoa por ID
  async deletarPessoa(id) {
    try {
      await apiClient.delete(`/pessoas/${id}`)
    } catch (error) {
      console.error('Erro ao deletar pessoa:', error)
      throw error
    }
  },
}

export default pessoaService
