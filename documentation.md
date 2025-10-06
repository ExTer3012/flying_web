Titre du projet : Flying WEB

Vous allez réaliser une application web à destination d’une compagnie aérienne nommée « Flying Web » sont besoin est assez complexe mais dans les grandes lignes il s’agit d’une application Web Responsive séparé en 2 parties.
L’entreprise Flying Blue doit pouvoir ajouter et configurer des aéroports pour proposer des destinations à venir.
Les utilisateurs (clients / internautes) doivent pouvoir choisir une destination, et imprimer leur billet d’embarquement.

Partie Back
Accessible uniquement via une authentification cette partie permet à l’équipe « Flygin Web les fonctionnalités suivantes :
-	Données de base :
    CRUD Avion : Un avion est composé d’un modèle (A320, A315, B747 …), d’une identification, d’un nombre de place passager et d’une dimension (en mètre)
    CRUD Aéroport : Un aéroport est composé d’une ville, d’une longueur d’avion compatible maximale
-	Planification :
	« Flying Blue » doit pouvoir planifier un vol à venir : Aéroport de départ, date et heure UTC de départ, Aéroport d’arrivée, date et heure UTC d’arrivée, Avion concerné, numéro de vol (unique)
	Lister /consulter / annuler les vols à venir
	Lister /consulter /annuler les passagers par vol
	Faire voler et atterrir un avion
-	Règle de gestion
	Un avion ne peut pas décoller s’il n’a pas atterri 
	Un avion trop grand ne peut pas être affectée à une piste trop courte
	Les réservations ne peuvent plus être modifiée après le décollage de l’avion.

Partie Front
-	Réservation : 
	Un client doit pouvoir consulter la liste des vols à revenir Grace à un moteur de recherche (date de départ, ville de départ, ville d’arrivée), avec une tolérance de plus ou moins X jours
	En fonction de la date d’arrivée le système propose un ou plusieurs vol retour pour permettre au voyageur de revenir chez lui
	La réservation d’un vol demande plusieurs informations :
	    Nombre de passagers
	    Nom et prénom des passagers
	Après validation de la réservation, le voyageur reçoit par mail un lien pour consulter / annuler / Modifier le nombre de passager sur sa réservation (token dans l’url)
	Il reçoit par mail aussi une carte d’embarquement PDF qui récapitule les informations du vol y compris le n° de siège par passager. Cette carte d’embarquement contient un QR Code correspondant au lien Web de consultation de réservation


Grille d'évaluation:

BDD:	    La modélisation est cohérente	
BACK:	Accès protégé par mot de passe (mot de passe hasché)	
BACK:	CRUD Avion fonctionnel	
BACK:	CRUD Aéroport  fonctionnel	
Planification:	Il est possible de planifier un vol avec les données nécessaire selon les règles de gestion imposées	
Planification:	Il est possible de lister les vol à venir, les modifier tant que l'avion n'a pas décollé	
Planification:	Il est possible de liste les passagers d'un vol et connaitre leur n° de siège	
Planificaiton:	Fonctionnalité de décollage / aterrisage	
FRONT:	Moteur de recherche pour consulter les vols à venir	
FRONT:	Proposition des vols retours	
FRONT:	Le système de réservation de vol est fonctionnel en regard des règles de gestions imposées.	
FRONT:	Un mail est envoyé il contient un lien unique (via Token) 	
PDF:    Le mail contient aussi la carte d'embarquement PDF avec les informations nécessaires	
