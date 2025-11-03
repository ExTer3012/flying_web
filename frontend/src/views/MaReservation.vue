<template>
  <div class="container">
    <h2 class="mb-4"><i class="bi bi-ticket-perforated me-2"></i>Ma réservation</h2>

    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary"></div>
    </div>

    <div v-else-if="reservation" class="row">
      <div class="col-md-8">
        <div class="card shadow-sm mb-4">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0">Vol {{ reservation.vol_id.numero_vol }}</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6 mb-3">
                <h6><i class="bi bi-geo-alt-fill text-primary me-2"></i>Départ</h6>
                <p class="mb-0">{{ reservation.vol_id.aeroport_depart_id.ville }}</p>
                <small class="text-muted">{{ formatDate(reservation.vol_id.date_depart_utc) }}</small>
              </div>
              <div class="col-md-6 mb-3">
                <h6><i class="bi bi-geo-fill text-primary me-2"></i>Arrivée</h6>
                <p class="mb-0">{{ reservation.vol_id.aeroport_arrivee_id.ville }}</p>
                <small class="text-muted">{{ formatDate(reservation.vol_id.date_arrivee_utc) }}</small>
              </div>
            </div>
          </div>
        </div>

        <div class="card shadow-sm">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0">Passagers ({{ passagers.length }})</h5>
          </div>
          <div class="card-body">
            <table class="table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Prénom</th>
                  <th>Siège</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="passager in passagers" :key="passager._id">
                  <td>{{ passager.nom }}</td>
                  <td>{{ passager.prenom }}</td>
                  <td><span class="badge bg-info">{{ passager.numero_siege }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card shadow-sm mb-3">
          <div class="card-body">
            <h6 class="card-title">Informations</h6>
            <p class="mb-2">
              <small class="text-muted">Email</small><br>
              {{ reservation.email_contact }}
            </p>
            <p class="mb-0">
              <small class="text-muted">Statut</small><br>
              <span :class="'badge ' + (reservation.statut === 'active' ? 'bg-success' : 'bg-danger')">
                {{ reservation.statut }}
              </span>
            </p>
          </div>
        </div>

        <div class="card shadow-sm" v-if="reservation.statut === 'active' && peutModifier">
          <div class="card-body">
            <button class="btn btn-danger w-100" @click="annulerReservation">
              <i class="bi bi-x-circle me-2"></i>Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api'

export default {
  name: 'MaReservation',
  data() {
    return {
      reservation: null,
      passagers: [],
      loading: true
    }
  },
  computed: {
    peutModifier() {
      if (!this.reservation) return false
      const statut = this.reservation.vol_id.statut
      return statut !== 'en_vol' && statut !== 'atterri'
    }
  },
  methods: {
    async chargerReservation() {
      try {
        const response = await api.get(`/reservations/token/${this.$route.params.token}`)
        this.reservation = response.data.reservation
        this.passagers = response.data.passagers
      } catch (error) {
        alert('Réservation non trouvée')
      } finally {
        this.loading = false
      }
    },
    async annulerReservation() {
      if (!confirm('Êtes-vous sûr de vouloir annuler ?')) return
      try {
        await api.delete(`/reservations/token/${this.$route.params.token}`)
        alert('Réservation annulée')
        this.chargerReservation()
      } catch (error) {
        alert(error.response?.data?.message || 'Erreur')
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleString('fr-FR')
    }
  },
  mounted() {
    this.chargerReservation()
  }
}
</script>
