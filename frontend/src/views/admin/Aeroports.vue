<template>
  <div class="container">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2><i class="bi bi-building me-2"></i>Gestion des Aéroports</h2>
      <button class="btn btn-primary" @click="showModal = true">
        <i class="bi bi-plus-circle me-2"></i>Ajouter un aéroport
      </button>
    </div>

    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary"></div>
    </div>

    <div v-else class="table-responsive">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Ville</th>
            <th>Longueur max (m)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="aeroport in aeroports" :key="aeroport._id">
            <td>{{ aeroport.ville }}</td>
            <td>{{ aeroport.longueur_max }}</td>
            <td>
              <button class="btn btn-sm btn-danger" @click="supprimerAeroport(aeroport._id)">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Ajout -->
    <div v-if="showModal" class="modal d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Ajouter un aéroport</h5>
            <button type="button" class="btn-close" @click="showModal = false"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="ajouterAeroport">
              <div class="mb-3">
                <label class="form-label">Ville</label>
                <input type="text" class="form-control" v-model="nouvelAeroport.ville" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Longueur maximale (mètres)</label>
                <input type="number" step="0.1" class="form-control" v-model.number="nouvelAeroport.longueur_max" required>
              </div>
              <button type="submit" class="btn btn-primary">Ajouter</button>
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
  name: 'AdminAeroports',
  data() {
    return {
      aeroports: [],
      loading: true,
      showModal: false,
      nouvelAeroport: {
        ville: '',
        longueur_max: 0
      }
    }
  },
  methods: {
    async chargerAeroports() {
      try {
        const response = await api.get('/aeroports')
        this.aeroports = response.data
      } catch (error) {
        alert('Erreur chargement aéroports')
      } finally {
        this.loading = false
      }
    },
    async ajouterAeroport() {
      try {
        await api.post('/aeroports', this.nouvelAeroport)
        alert('Aéroport ajouté')
        this.showModal = false
        this.chargerAeroports()
        this.nouvelAeroport = { ville: '', longueur_max: 0 }
      } catch (error) {
        alert(error.response?.data?.message || 'Erreur')
      }
    },
    async supprimerAeroport(id) {
      if (!confirm('Supprimer cet aéroport ?')) return
      try {
        await api.delete(`/aeroports/${id}`)
        alert('Aéroport supprimé')
        this.chargerAeroports()
      } catch (error) {
        alert('Erreur suppression')
      }
    }
  },
  mounted() {
    this.chargerAeroports()
  }
}
</script>
