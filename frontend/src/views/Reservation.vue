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

        <!-- Section Vols Retour -->
        <div v-if="volsRetour.length > 0" class="card shadow-sm mt-4">
          <div class="card-header bg-info text-white">
            <h5 class="mb-0">
              <i class="bi bi-arrow-return-right me-2"></i>Vols Retour Disponibles
            </h5>
          </div>
          <div class="card-body">
            <div v-if="loadingVolsRetour" class="text-center py-3">
              <div class="spinner-border text-primary"></div>
            </div>
            <div v-else>
              <p class="text-muted mb-3">
                Sélectionnez un vol retour (optionnel)
              </p>
              <div class="list-group">
                <button v-for="volRetour in volsRetour" 
                        :key="volRetour._id"
                        type="button"
                        class="list-group-item list-group-item-action"
                        :class="{ active: volRetour._id === volRetourSelectionne?._id }"
                        @click="volRetourSelectionne = volRetourSelectionne?._id === volRetour._id ? null : volRetour">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{{ volRetour.numero_vol }}</strong>
                      <br>
                      <small>{{ formatDate(volRetour.date_depart_utc) }}</small>
                    </div>
                    <div class="text-end">
                      <span class="badge bg-primary">Retour</span>
                    </div>
                  </div>
                </button>
              </div>
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
                <label class="form-label">Nombre de passagers * ({{ vol.places_disponibles }} places disponibles)</label>
                <input type="number" class="form-control" v-model.number="reservation.nombre_passagers" 
                       min="1" :max="vol.places_disponibles" required @change="updatePassagers"
                       :class="{'is-invalid': reservation.nombre_passagers > vol.places_disponibles}">
                <div class="invalid-feedback" v-if="reservation.nombre_passagers > vol.places_disponibles">
                  Il ne reste que {{ vol.places_disponibles }} place(s) disponible(s) sur ce vol
                </div>
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

              <button type="submit" class="btn btn-primary w-100" 
                      :disabled="submitting || !canSubmit">
                <span v-if="submitting">
                  <span class="spinner-border spinner-border-sm me-2"></span>
                  Réservation en cours...
                </span>
                <span v-else-if="!canSubmit">
                  Pas assez de places disponibles
                </span>
                <span v-else>
                  <i class="bi bi-check-circle me-2"></i>
                  Confirmer la réservation 
                  <template v-if="volRetourSelectionne">aller-retour</template>
                  <template v-else>aller simple</template>
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
      volsRetour: [],
      volRetourSelectionne: null,
      loading: true,
      loadingVolsRetour: false,
      submitting: false,
      reservation: {
        email_contact: '',
        nombre_passagers: 1,
        passagers: [{ nom: '', prenom: '' }]
      }
    }
  },
  computed: {
    canSubmit() {
      if (!this.vol || this.vol.places_disponibles < this.reservation.nombre_passagers) {
        return false;
      }
      if (this.volRetourSelectionne && 
          this.volRetourSelectionne.places_disponibles < this.reservation.nombre_passagers) {
        return false;
      }
      return true;
    }
  },
  computed: {
    canSubmit() {
      const allerOk = this.vol && this.vol.places_disponibles >= this.reservation.nombre_passagers;
      const retourOk = !this.volRetourSelectionne || 
        (this.volRetourSelectionne.places_disponibles >= this.reservation.nombre_passagers);
      return allerOk && retourOk;
    }
    },
  methods: {
    async chargerVol() {
      try {
        const response = await api.get(`/vols/${this.$route.params.volId}`)
        this.vol = response.data
        this.chercherVolsRetour()
      } catch (error) {
        alert('Erreur lors du chargement du vol')
        this.$router.push('/recherche')
      } finally {
        this.loading = false
      }
    },

    async chercherVolsRetour() {
      this.loadingVolsRetour = true
      try {
        const dateArrivee = new Date(this.vol.date_arrivee_utc)
        const dateLimite = new Date(dateArrivee)
        dateLimite.setDate(dateLimite.getDate() + 14)

        const params = {
          ville_depart: this.vol.aeroport_arrivee_id.ville,
          ville_arrivee: this.vol.aeroport_depart_id.ville,
          date_depart_min: dateArrivee.toISOString().split('T')[0],
          date_depart_max: dateLimite.toISOString().split('T')[0]
        }

        const response = await api.get('/vols/recherche', { params })
        this.volsRetour = response.data.filter(vol => 
          vol.statut === 'planifie' && 
          new Date(vol.date_depart_utc) >= dateArrivee
        ).sort((a, b) => new Date(a.date_depart_utc) - new Date(b.date_depart_utc))
      } catch (error) {
        console.error('Erreur recherche vols retour:', error)
      } finally {
        this.loadingVolsRetour = false
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
        // Créer la réservation aller
        const reservationAller = await api.post('/reservations', {
          vol_id: this.vol._id,
          nombre_passagers: this.reservation.nombre_passagers,
          email_contact: this.reservation.email_contact,
          passagers: this.reservation.passagers
        })

        // Si un vol retour est sélectionné, créer la réservation retour
        if (this.volRetourSelectionne) {
          await api.post('/reservations', {
            vol_id: this.volRetourSelectionne._id,
            nombre_passagers: this.reservation.nombre_passagers,
            email_contact: this.reservation.email_contact,
            passagers: this.reservation.passagers
          })
          alert('Réservations aller-retour créées avec succès ! Vérifiez votre email.')
        } else {
          alert('Réservation créée avec succès ! Vérifiez votre email.')
        }
        
        this.$router.push(reservationAller.data.lien_acces)
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
