
<h1 style="color: red;" >Module météo d'une ville par code postale</h1>


Ce module permet d'inserer la météo sur cinq jours dans une petite fenêttre pour un site afin d'avoir une option météo.


<b><u>Pour ce faire il est décomposé en deux partie :</u></b>
	
<ol>

<li>une partie de recherche par code postal afin de détermier la localisation GPS.</li>
<li>une partie qui renvoie les coordonnées GPS trouvés en 1 à un site météorologique afin de recevoir sous forme de Json la météo de la localisation désiré en 1.</li>
</ol>


<h2> 1 - La récupération du code postal</h2>

<section>
	
<p>La récupération de la ville se fait par un formulaire où nous saisissons le code postal de la ville recherchée.</p>

<p>
Une fois que les 5 chiffres sont inscrit, il bloque le formulaire et lance la recherche par une méthode Ajax sur un Json de la poste ( citué sur le serveur ) afin d'afficher toutes les localitées correspondantes au code postal saisie.
</p>

<p>
Une fois l'affichage des différentes villes dans le formulaire, on choisi celle qui nous intéresse et on valide, afin d'envoyer au site de météo les coordonées de la ville recherchée.
</p>

</section>

<h2>2 - Affichage de la météo reçus.</h2>

<h3>Recupération des données de la météo par envoie des coordonées GPS de la ville.</h3>

Une fois la localisation GPS trouvé par le formulaire de choix de la ville. Elle est envoyé par une méthode Ajax au site suisse : ....... afin de recevoir une réponse sous forme de ficher Json.  
Cette réponse Json est analysée et décortiquée afin d'être affichée au bon format avec les bons termes.

<h3>Analyse et affichage des données réçus</h3>
	
<h4>Récupération, analyse et traduction des abréviations de direction</h4>

Pour l'analyse et la traduction des abréviations de direction en langage normale, J'ai mis en place une fonction pour une utilisation intensive : 

<h4>Analyse des données reçus par le Json et transcription pour affichage</h4>

Nous avons différentes données qui arrive par le Json :

<ul>
	<li>La météo du jour.</li>
	<li>La météo jour par jour sur 5 jours.</li>
</ul>
		









		

