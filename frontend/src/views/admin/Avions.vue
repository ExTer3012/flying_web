<template>
  <div class="container">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2><i class="bi bi-airplane me-2"></i>Gestion des Avions</h2>
      <button class="btn btn-primary" @click="showModal = true">
        <i class="bi bi-plus-circle me-2"></i>Ajouter un avion
      </button>
    </div>

    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary"></div>
    </div>

    <div v-else class="table-responsive">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Modèle</th>
            <th>Identification</th>
            <th>Places</th>
            <th>Dimension (m)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="avion in avions" :key="avion._id">
            <td>{{ avion.modele }}</td>
            <td>{{ avion.identification }}</td>
            <td>{{ avion.nombre_places }}</td>
            <td>{{ avion.dimension }}</td>
            <td>
              <button class="btn btn-sm btn-danger" @click="supprimerAvion(avion._id)">
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
            <h5 class="modal-title">Ajouter un avion</h5>
            <button type="button" class="btn-close" @click="showModal = false"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="ajouterAvion">
              <div class="mb-3">
                <label class="form-label">Modèle</label>
                <input type="text" class="form-control" v-model="nouvelAvion.modele" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Identification</label>
                <input type="text" class="form-control" v-model="nouvelAvion.identification" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Nombre de places</label>
                <input type="number" class="form-control" v-model.number="nouvelAvion.nombre_places" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Dimension (mètres)</label>
                <input type="number" step="0.01" class="form-control" v-model.number="nouvelAvion.dimension" required>
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
  name: 'AdminAvions',
  data() {
    return {
      avions: [],
      loading: true,
      showModal: false,
      nouvelAvion: {
        modele: '',
        identification: '',
        nombre_places: 0,
        dimension: 0
      }
    }
  },
  methods: {
    async chargerAvions() {
      try {
        const response = await api.get('/avions')
        this.avions = response.data
      } catch (error) {
        alert('Erreur chargement avions')
      } finally {
        this.loading = false
      }
    },
    async ajouterAvion() {
      try {
        await api.post('/avions', this.nouvelAvion)
        alert('Avion ajouté')
        this.showModal = false
        this.chargerAvions()
        this.nouvelAvion = { modele: '', identification: '', nombre_places: 0, dimension: 0 }
      } catch (error) {
        alert(error.response?.data?.message || 'Erreur')
      }
    },
    async supprimerAvion(id) {
      if (!confirm('Supprimer cet avion ?')) return
      try {
        await api.delete(`/avions/${id}`)
        alert('Avion supprimé')
        this.chargerAvions()
      } catch (error) {
        alert('Erreur suppression')
      }
    }
  },
  mounted() {
    this.chargerAvions()
  }
}
</script>
