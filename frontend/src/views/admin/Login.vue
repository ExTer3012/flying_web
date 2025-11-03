<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-5">
        <div class="card shadow">
          <div class="card-header bg-primary text-white text-center">
            <h4 class="mb-0">
              <i class="bi bi-shield-lock me-2"></i>Administration
            </h4>
          </div>
          <div class="card-body p-4">
            <form @submit.prevent="login">
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" v-model="credentials.email" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Mot de passe</label>
                <input type="password" class="form-control" v-model="credentials.password" required>
              </div>
              <div v-if="error" class="alert alert-danger">
                {{ error }}
              </div>
              <button type="submit" class="btn btn-primary w-100" :disabled="loading">
                <span v-if="loading">
                  <span class="spinner-border spinner-border-sm me-2"></span>
                  Connexion...
                </span>
                <span v-else>Se connecter</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../api'

export default {
  name: 'AdminLogin',
  data() {
    return {
      credentials: {
        email: '',
        password: ''
      },
      loading: false,
      error: ''
    }
  },
  methods: {
    async login() {
      this.loading = true
      this.error = ''
      try {
        const response = await api.post('/auth/login', this.credentials)
        localStorage.setItem('token', response.data.token)
        this.$router.push('/admin/dashboard')
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur de connexion'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
