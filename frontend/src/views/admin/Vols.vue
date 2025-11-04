<template>
  <div class="container">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2><i class="bi bi-calendar-event me-2"></i>Gestion des Vols</h2>
      <button class="btn btn-primary" @click="showModal = true">
        <i class="bi bi-plus-circle me-2"></i>Planifier un vol
      </button>
    </div>

    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary"></div>
    </div>

    <div v-else class="table-responsive">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>N° Vol</th>
            <th>Départ</th>
            <th>Arrivée</th>
            <th>Date départ</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="vol in volsAVenir" :key="vol._id">
            <td>{{ vol.numero_vol }}</td>
            <td>{{ vol.aeroport_depart_id?.ville }}</td>
            <td>{{ vol.aeroport_arrivee_id?.ville }}</td>
            <td>{{ formatDate(vol.date_depart_utc) }}</td>
            <td>
              <span :class="'badge ' + getStatutClass(vol.statut)">{{ vol.statut }}</span>
            </td>
            <td>
              <div class="btn-group">
                <button class="btn btn-sm btn-primary me-1" 
                        @click="voirPassagers(vol)">
                  <i class="bi bi-people"></i>
                </button>
                <button v-if="vol.statut === 'planifie'" class="btn btn-sm btn-warning me-1" 
                        @click="modifierVol(vol)">
                  <i class="bi bi-pencil"></i>
                </button>
                <button v-if="vol.statut === 'planifie'" class="btn btn-sm btn-success me-1" 
                        @click="decoller(vol._id)">
                  Décoller
                </button>
                <button v-if="vol.statut === 'en_vol'" class="btn btn-sm btn-info me-1" 
                        @click="atterrir(vol._id)">
                  Atterrir
                </button>
                <button v-if="vol.statut === 'planifie'" class="btn btn-sm btn-danger" 
                        @click="annulerVol(vol._id)">
                  Annuler
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Ajout/Modification -->
    <div v-if="showModal || showEditModal" class="modal d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ showEditModal ? 'Modifier le vol' : 'Planifier un vol' }}</h5>
            <button type="button" class="btn-close" @click="fermerModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="ajouterVol">
              <div class="mb-3">
                <label class="form-label">Numéro de vol</label>
                <input type="text" class="form-control" v-model="nouveauVol.numero_vol" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Aéroport de départ</label>
                <select class="form-select" v-model="nouveauVol.aeroport_depart_id" required>
                  <option value="">Sélectionner...</option>
                  <option v-for="a in aeroports" :key="a._id" :value="a._id">{{ a.ville }}</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Aéroport d'arrivée</label>
                <select class="form-select" v-model="nouveauVol.aeroport_arrivee_id" required>
                  <option value="">Sélectionner...</option>
                  <option v-for="a in aeroports" :key="a._id" :value="a._id">{{ a.ville }}</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Avion</label>
                <select class="form-select" v-model="nouveauVol.avion_id" required>
                  <option value="">Sélectionner...</option>
                  <option v-for="av in avions" :key="av._id" :value="av._id">
                    {{ av.modele }} ({{ av.identification }})
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Date/Heure départ (UTC)</label>
                <input type="datetime-local" class="form-control" v-model="nouveauVol.date_depart_utc" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Date/Heure arrivée (UTC)</label>
                <input type="datetime-local" class="form-control" v-model="nouveauVol.date_arrivee_utc" required>
              </div>
              <button type="submit" class="btn btn-primary">
                {{ showEditModal ? 'Enregistrer les modifications' : 'Planifier' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Passagers -->
    <div v-if="showPassagersModal" class="modal d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              Passagers du vol {{ volSelectionne?.numero_vol }}
              <span class="badge bg-secondary ms-2">
                {{ passagersVol.length }} passager(s)
              </span>
            </h5>
            <button type="button" class="btn-close" @click="showPassagersModal = false"></button>
          </div>
          <div class="modal-body">
            <div v-if="passagersVol.length === 0" class="alert alert-info">
              <i class="bi bi-info-circle me-2"></i>Aucun passager sur ce vol.
            </div>
            <div v-else>
              <table class="table">
                <thead>
                  <tr>
                    <th>Siège</th>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Email de contact</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="passager in passagersVol" :key="passager._id">
                    <td>
                      <span class="badge bg-primary">{{ passager.numero_siege }}</span>
                    </td>
                    <td>{{ passager.nom }}</td>
                    <td>{{ passager.prenom }}</td>
                    <td>{{ passager.reservation_id?.email_contact }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../api'

export default {
  name: 'AdminVols',
  data() {
    return {
      vols: [],
      avions: [],
      aeroports: [],
      loading: true,
      showModal: false,
      showEditModal: false,
      showPassagersModal: false,
      nouveauVol: {
        numero_vol: '',
        aeroport_depart_id: '',
        aeroport_arrivee_id: '',
        avion_id: '',
        date_depart_utc: '',
        date_arrivee_utc: ''
      },
      volAModifier: null,
      passagersVol: [],
      volSelectionne: null
    }
  },
  computed: {
    volsAVenir() {
      const maintenant = new Date()
      return this.vols
        .filter(vol => {
          const dateDepart = new Date(vol.date_depart_utc)
          return dateDepart >= maintenant || vol.statut === 'en_vol'
        })
        .sort((a, b) => new Date(a.date_depart_utc) - new Date(b.date_depart_utc))
    }
  },
  methods: {
    async chargerDonnees() {
      try {
        const [vols, avions, aeroports] = await Promise.all([
          api.get('/vols'),
          api.get('/avions'),
          api.get('/aeroports')
        ])
        this.vols = vols.data
        this.avions = avions.data
        this.aeroports = aeroports.data
      } catch (error) {
        alert('Erreur chargement')
      } finally {
        this.loading = false
      }
    },
    async voirPassagers(vol) {
      this.volSelectionne = vol
      this.showPassagersModal = true
      this.passagersVol = []
      
      try {
        // Chercher toutes les réservations pour ce vol
        const reservationsResponse = await api.get(`/reservations/vol/${vol._id}`)
        const reservations = reservationsResponse.data

        if (reservations.length === 0) {
          return
        }

        // Récupérer tous les passagers de toutes les réservations
        const passagersPromises = reservations.map(async reservation => {
          try {
            const response = await api.get(`/reservations/passagers/${reservation._id}`)
            return response.data
          } catch (err) {
            return []
          }
        })

        const passagersResponses = await Promise.all(passagersPromises)
        
        // Fusionner tous les passagers avec leurs informations de réservation
        this.passagersVol = passagersResponses
          .flatMap(response => response || [])
          .map(passager => ({
            ...passager,
            reservation_id: reservations.find(r => r._id === passager.reservation_id)
          }))
          .sort((a, b) => (a.numero_siege || '').localeCompare(b.numero_siege || ''))

      } catch (error) {
        alert('Erreur lors du chargement des passagers')
        this.showPassagersModal = false
      }
    },

    fermerModal() {
      this.showModal = false
      this.showEditModal = false
      this.volAModifier = null
      this.nouveauVol = {
        numero_vol: '',
        aeroport_depart_id: '',
        aeroport_arrivee_id: '',
        avion_id: '',
        date_depart_utc: '',
        date_arrivee_utc: ''
      }
    },
    modifierVol(vol) {
      this.volAModifier = vol
      this.nouveauVol = {
        numero_vol: vol.numero_vol,
        aeroport_depart_id: vol.aeroport_depart_id._id,
        aeroport_arrivee_id: vol.aeroport_arrivee_id._id,
        avion_id: vol.avion_id._id,
        date_depart_utc: new Date(vol.date_depart_utc).toISOString().slice(0, 16),
        date_arrivee_utc: new Date(vol.date_arrivee_utc).toISOString().slice(0, 16)
      }
      this.showEditModal = true
    },
    async ajouterVol() {
      try {
        if (this.showEditModal) {
          // Modification
          await api.put(`/vols/${this.volAModifier._id}`, this.nouveauVol)
          alert('Vol modifié')
        } else {
          // Création
          await api.post('/vols', this.nouveauVol)
          alert('Vol planifié')
        }
        this.fermerModal()
        this.chargerDonnees()
      } catch (error) {
        alert(error.response?.data?.message || 'Erreur')
      }
    },
    async decoller(id) {
      try {
        await api.put(`/vols/${id}/decoller`)
        alert('Avion décollé')
        this.chargerDonnees()
      } catch (error) {
        alert(error.response?.data?.message || 'Erreur')
      }
    },
    async atterrir(id) {
      try {
        await api.put(`/vols/${id}/atterrir`)
        alert('Avion atterri')
        this.chargerDonnees()
      } catch (error) {
        alert(error.response?.data?.message || 'Erreur')
      }
    },
    async annulerVol(id) {
      if (!confirm('Annuler ce vol ?')) return
      try {
        await api.delete(`/vols/${id}`)
        alert('Vol annulé')
        this.chargerDonnees()
      } catch (error) {
        alert('Erreur')
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleString('fr-FR')
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
    this.chargerDonnees()
  }
}
</script>
