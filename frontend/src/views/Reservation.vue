<template>
  <div class="container">
    <h2 class="mb-4"><i class="bi bi-ticket-detailed me-2"></i>Réserver un vol</h2>

    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary"></div>
    </div>

    <div v-else-if="vol" class="row">
      <div class="col-md-6">
        <div class="card shadow-sm mb-4">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0">Détails du vol {{ vol.numero_vol }}</h5>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <strong>Départ :</strong> {{ vol.aeroport_depart_id.ville }}<br>
              <small class="text-muted">{{ formatDate(vol.date_depart_utc) }}</small>
            </div>
            <div class="mb-3">
              <strong>Arrivée :</strong> {{ vol.aeroport_arrivee_id.ville }}<br>
              <small class="text-muted">{{ formatDate(vol.date_arrivee_utc) }}</small>
            </div>
            <div>
              <strong>Avion :</strong> {{ vol.avion_id.modele }}<br>
              <small class="text-muted">{{ vol.avion_id.nombre_places }} places</small>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card shadow-sm">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0">Informations de réservation</h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="creerReservation">
              <div class="mb-3">
                <label class="form-label">Email de contact *</label>
                <input type="email" class="form-control" v-model="reservation.email_contact" required>
              </div>

              <div class="mb-3">
                <label class="form-label">Nombre de passagers *</label>
                <input type="number" class="form-control" v-model.number="reservation.nombre_passagers" 
                       min="1" max="10" required @change="updatePassagers">
              </div>

              <div v-for="(passager, index) in reservation.passagers" :key="index" class="mb-3">
                <h6>Passager {{ index + 1 }}</h6>
                <div class="row g-2">
                  <div class="col-md-6">
                    <input type="text" class="form-control" v-model="passager.nom" 
                           placeholder="Nom *" required>
                  </div>
                  <div class="col-md-6">
                    <input type="text" class="form-control" v-model="passager.prenom" 
                           placeholder="Prénom *" required>
                  </div>
                </div>
              </div>

              <button type="submit" class="btn btn-primary w-100" :disabled="submitting">
                <span v-if="submitting">
                  <span class="spinner-border spinner-border-sm me-2"></span>
                  Réservation en cours...
                </span>
                <span v-else>
                  <i class="bi bi-check-circle me-2"></i>Confirmer la réservation
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api'

export default {
  name: 'Reservation',
  data() {
    return {
      vol: null,
      loading: true,
      submitting: false,
      reservation: {
        email_contact: '',
        nombre_passagers: 1,
        passagers: [{ nom: '', prenom: '' }]
      }
    }
  },
  methods: {
    async chargerVol() {
      try {
        const response = await api.get(`/vols/${this.$route.params.volId}`)
        this.vol = response.data
      } catch (error) {
        alert('Erreur lors du chargement du vol')
        this.$router.push('/recherche')
      } finally {
        this.loading = false
      }
    },
    updatePassagers() {
      const nb = this.reservation.nombre_passagers
      this.reservation.passagers = Array.from({ length: nb }, (_, i) => 
        this.reservation.passagers[i] || { nom: '', prenom: '' }
      )
    },
    async creerReservation() {
      this.submitting = true
      try {
        const response = await api.post('/reservations', {
          vol_id: this.vol._id,
          nombre_passagers: this.reservation.nombre_passagers,
          email_contact: this.reservation.email_contact,
          passagers: this.reservation.passagers
        })

        alert('Réservation créée avec succès ! Vérifiez votre email.')
        this.$router.push(response.data.lien_acces)
      } catch (error) {
        alert(error.response?.data?.message || 'Erreur lors de la réservation')
      } finally {
        this.submitting = false
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleString('fr-FR')
    }
  },
  mounted() {
    this.chargerVol()
  }
}
</script>
