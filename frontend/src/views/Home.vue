<template>
  <div class="container">
    <!-- Hero Section -->
    <div class="row min-vh-75 align-items-center">
      <div class="col-lg-6">
        <h1 class="display-3 fw-bold text-primary">
          <i class="bi bi-airplane-engines"></i> Flying Blue
        </h1>
        <p class="lead text-muted mb-4">
          Réservez vos vols en toute simplicité. Des destinations du monde entier à portée de clic.
        </p>
        <router-link to="/recherche" class="btn btn-primary btn-lg">
          <i class="bi bi-search me-2"></i>Rechercher un vol
        </router-link>
      </div>
      <div class="col-lg-6">
        <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800" 
             alt="Avion" 
             class="img-fluid rounded shadow">
      </div>
    </div>

    <!-- Fonctionnalités -->
    <div class="row mt-5 g-4">
      <div class="col-md-4">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-body text-center">
            <i class="bi bi-search display-4 text-primary"></i>
            <h5 class="card-title mt-3">Recherche facile</h5>
            <p class="card-text text-muted">
              Trouvez le vol parfait en quelques clics.
            </p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-body text-center">
            <i class="bi bi-ticket-detailed display-4 text-primary"></i>
            <h5 class="card-title mt-3">Réservation instantanée</h5>
            <p class="card-text text-muted">
              Réservez votre vol et recevez votre carte d'embarquement.
            </p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-body text-center">
            <i class="bi bi-shield-check display-4 text-primary"></i>
            <h5 class="card-title mt-3">Gestion simplifiée</h5>
            <p class="card-text text-muted">
              Consultez et modifiez votre réservation à tout moment.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>
.min-vh-75 {
  min-height: 75vh;
}
</style>
