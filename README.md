# module_meteo
Création d'un module qui affiche la météo depuis un Json d'un site suisse

Le choix de la ville se fait par la saisie du code postale, une fois tous les chiffres mis, la recherche se lance automatiquement par une methode Ajax sur un json de La Poste qui se trouve sur le site afin de trouver les coordonées GPS de la ville. 

Ces coordonées sont transmise par une méthode Ajax (encore) à un site météo suisse afin de recevoir une réponses par un fichier Json. Celui-ci est analysé afin d'être afficher dans le module.
