<template>
  <div class="container">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2><i class="bi bi-speedometer2 me-2"></i>Tableau de bord</h2>
      <button class="btn btn-outline-danger" @click="logout">
        <i class="bi bi-box-arrow-right me-2"></i>Déconnexion
      </button>
    </div>

    <div class="row g-4">
      <div class="col-md-4">
        <router-link to="/admin/avions" class="text-decoration-none">
          <div class="card text-center shadow-sm h-100">
            <div class="card-body">
              <i class="bi bi-airplane display-4 text-primary"></i>
              <h5 class="card-title mt-3">Avions</h5>
              <p class="text-muted">Gérer les avions</p>
            </div>
          </div>
        </router-link>
      </div>
      <div class="col-md-4">
        <router-link to="/admin/aeroports" class="text-decoration-none">
          <div class="card text-center shadow-sm h-100">
            <div class="card-body">
              <i class="bi bi-building display-4 text-success"></i>
              <h5 class="card-title mt-3">Aéroports</h5>
              <p class="text-muted">Gérer les aéroports</p>
            </div>
          </div>
        </router-link>
      </div>
      <div class="col-md-4">
        <router-link to="/admin/vols" class="text-decoration-none">
          <div class="card text-center shadow-sm h-100">
            <div class="card-body">
              <i class="bi bi-calendar-event display-4 text-warning"></i>
              <h5 class="card-title mt-3">Vols</h5>
              <p class="text-muted">Planifier les vols</p>
            </div>
          </div>
        </router-link>
      </div>
    </div>

    <div class="alert alert-info mt-4">
      <i class="bi bi-info-circle me-2"></i>
      Bienvenue dans l'espace d'administration Flying Web
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminDashboard',
  methods: {
    logout() {
      localStorage.removeItem('token')
      this.$router.push('/admin/login')
    }
  }
}
</script>
