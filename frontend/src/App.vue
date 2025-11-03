<template>
  <div id="app">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <router-link class="navbar-brand" to="/">
          <i class="bi bi-airplane-fill me-2"></i>Flying Blue
        </router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/">Accueil</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/recherche">Rechercher un vol</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/admin/login">Admin</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Contenu principal -->
    <main class="py-4">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="bg-light text-center text-lg-start mt-5">
      <div class="text-center p-3 bg-primary text-white">
        © 2025 Flying Blue - Tous droits réservés
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}
</style>

