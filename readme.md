#Module météo d'une ville par code postale#


Ce module permet d'inserer la météo sur cinq jours dans une petite fenêttre pour un site afin d'avoir une option météo.


**Pour ce faire il est décomposé en deux partie :**

- une partie de recherche par code postale afin de détermier la localisation GPS.
- une partie de recherche et d'affichage avec décodage du Json de la météo de la localisation GPS trouvée en 1.


	##La récupération du code postale##
		
	La récupération du code postale de la ville se fait par un formulaire. Une fois que les 5 chiffres sont inscrit, il bloque le formulaire et lance la recherche par une méthode Json sur un Json de la poste afin d'afficher toutes les localitées correspondantes au code postale.
	
	##Recupération des données de la météo##
	
	Une fois la localisation GPS trouvé par le formulaire de choix de la ville. Elle est envoyé au site suisse : ....... pour une réponse sous forme de Json.  
	Cette réponse est analysée afin d' être affichée au bon format avec les bons termes.
	
	##Analyse et affichage des données réçus##
		
	###Récupération, analyse et traduction des abréviations de direction###
	 Pour l'analyse et la traduction des abréviations de direction en langage normale, J'ai mis en place une fonction pour une utilisation intensive : 


 



	
			

