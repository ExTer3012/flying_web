<template>
  <div class="container">
    <h2 class="mb-4"><i class="bi bi-search me-2"></i>Rechercher un vol</h2>

    <!-- Formulaire de recherche -->
    <div class="card shadow-sm mb-4">
      <div class="card-body">
        <form @submit.prevent="rechercherVols">
          <div class="row g-3">
            <div class="col-md-4">
              <label class="form-label">Ville de départ</label>
              <input type="text" class="form-control" v-model="recherche.ville_depart" placeholder="Ex: Paris">
            </div>
            <div class="col-md-4">
              <label class="form-label">Ville d'arrivée</label>
              <input type="text" class="form-control" v-model="recherche.ville_arrivee" placeholder="Ex: New York">
            </div>
            <div class="col-md-4">
              <label class="form-label">Date de départ</label>
              <input type="date" class="form-control" v-model="recherche.date">
            </div>
          </div>
          <button type="submit" class="btn btn-primary mt-3">
            <i class="bi bi-search me-2"></i>Rechercher
          </button>
        </form>
      </div>
    </div>

    <!-- Résultats -->
    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>

    <div v-else-if="vols.length > 0">
      <h4 class="mb-3">{{ vols.length }} vol(s) trouvé(s)</h4>
      <div class="row g-3">
        <div class="col-md-6" v-for="vol in vols" :key="vol._id">
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <h5 class="card-title">
                <span class="badge bg-primary">{{ vol.numero_vol }}</span>
              </h5>
              <div class="d-flex justify-content-between align-items-center my-3">
                <div class="text-center">
                  <h6>{{ vol.aeroport_depart_id.ville }}</h6>
                  <small class="text-muted">{{ formatDate(vol.date_depart_utc) }}</small>
                </div>
                <div>
                  <i class="bi bi-arrow-right fs-4 text-primary"></i>
                </div>
                <div class="text-center">
                  <h6>{{ vol.aeroport_arrivee_id.ville }}</h6>
                  <small class="text-muted">{{ formatDate(vol.date_arrivee_utc) }}</small>
                </div>
              </div>
              <div class="mb-2">
                <small class="text-muted">
                  <i class="bi bi-airplane me-1"></i>{{ vol.avion_id.modele }}
                </small>
              </div>
              <div class="mb-3">
                <span :class="'badge ' + getStatutClass(vol.statut)">{{ vol.statut }}</span>
              </div>
              <router-link :to="'/reservation/' + vol._id" class="btn btn-primary w-100">
                Réserver ce vol
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="searched" class="alert alert-info">
      <i class="bi bi-info-circle me-2"></i>Aucun vol trouvé pour ces critères.
    </div>
  </div>
</template>

<script>
import api from '../api'

export default {
  name: 'RechercheVols',
  data() {
    return {
      recherche: {
        ville_depart: '',
        ville_arrivee: '',
        date: ''
      },
      vols: [],
      loading: false,
      searched: false
    }
  },
  methods: {
    async rechercherVols() {
      this.loading = true
      this.searched = true
      try {
        const params = {}
        if (this.recherche.ville_depart) params.ville_depart = this.recherche.ville_depart
        if (this.recherche.ville_arrivee) params.ville_arrivee = this.recherche.ville_arrivee
        if (this.recherche.date) params.date = this.recherche.date

        const response = await api.get('/vols/recherche', { params })
        this.vols = response.data
      } catch (error) {
        console.error('Erreur recherche:', error)
        alert('Erreur lors de la recherche des vols')
      } finally {
        this.loading = false
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    getStatutClass(statut) {
      const classes = {
        'planifie': 'bg-success',
        'en_vol': 'bg-warning',
        'atterri': 'bg-secondary',
        'annule': 'bg-danger'
      }
      return classes[statut] || 'bg-secondary'
    }
  },
  mounted() {
    this.rechercherVols()
  }
}
</script>
