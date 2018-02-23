$(document).ready( function(){



	/**
	 *  ventDirectionCardinal (windDirection)
	 *
	 * 	fonction qui permet de récupérer et de transcrire en terme long
	 * 	les abrégés du Json de la direction du vent en point cardinal
	 * 	
	 *  @param string [windDirection] [direction du vent en abégé]
	 *  @return string [traduction des abrègés en terme long]
	 */
		function ventDirectionCardinal (windDirection) {

			if ( windDirection == 'S' ) {
				var ventDirectionCardinaux = 'Sud';
			} else if ( windDirection == 'SO' ) {
				var ventDirectionCardinaux = 'Sud Ouest';
			} else if ( windDirection == 'SE' ) {
				var ventDirectionCardinaux = 'Sud Est';
			} else if ( windDirection == 'N' ) {
				var ventDirectionCardinaux = 'Nord';
			} else if ( windDirection == 'NE' ) {
				var ventDirectionCardinaux = 'Nord Est';
			} else if ( windDirection == 'NO' ) {
				var ventDirectionCardinaux = 'Nord Ouest';
			} else if ( windDirection == 'O' ) {
				var ventDirectionCardinaux = 'Ouest';
			} else if ( windDirection =='E' ) {
				var ventDirectionCardinaux = 'Est';
			} else {
				var ventDirectionCardinaux = 'Coordonée inconue';
			}

			return ventDirectionCardinaux;
		//Fin de la fonction ventDirectionCardinal	
		}


	/*
		Script pour l'affichage de la liste des villes 
		après saisie du code postale
	*/
		$('#code_postal').keyup(function(event){

			// empechement de la declaration de l'evenement 
			event.preventDefault();
			// annuler la touche [ENTER]
			if (event.keyCode == 13) {
					event.preventDefault();
						// annulation des valeurs dans la balise input
						$('#code_postal').val('0');
						var annulValeurSubmit = $('#submit').val();
						console.log('Je passe bien ici ...');
						var annulValeurInput = $('#code_postal').val();
						console.log('la valeur annuler est : '+annulValeurInput);
						console.log('la valeur du submit est :'+annulValeurSubmit);
					}

			// caché les balises
			$('#selecteVille').html('').hide();
			$('#submit').html('').hide();
			$('#code_postal').next('span').html('');

			/*
				Controle d'un bug si l'on tape trop vite le code postale
				pour cela on va calculer le nombre de caractères de la variable si celle-ci est
				egale à 5 caractère on fait appel a l'ajax sinon on passe 
			*/
			
				// initialisation de la variable de controle
				// en ne prenant que les nombres
					var controle_chaine = parseInt( $('#code_postal').val() );
					//console.log('controle chaine : '+controle_chaine);

				//  Controle de la longueur de la variable de controle 
				//  en transformant les nombres en chaine afin de vérifier la longueur
					var longueur_chaine = controle_chaine.toString().length;
					//console.log('longueur de la chaine : '+longueur_chaine);

				
					if ( longueur_chaine === 5 ){

						// affichage du message d'attente
							var messageAttente = 'Recherche en cour...';
							$('#messageAttente').html(messageAttente);

						$.ajax ({

							type: "POST",
							// Json minimal pour la recherche contient aussi les coordonées GPS
							url: "json/laposte_hexasmal.json",
							dataType: "json",

							success : function(data, status) {
								
							var code_postal = parseInt( $('#code_postal').val() );
								//console.log("Code postale saisie : "+code_postal);
								console.log('Variable data : ');
								console.log(data);
								
								// boucle
								$.each(data, function(i, donnees){

									//condition pour le rajout des options
										if (donnees['fields']['code_postal'] == code_postal ){
											
											// Condition pour l'affichage de la ligne 5
											
											if (donnees['fields']['ligne_5'] != null ){
												$('#selecteVille').append('<option value="'
																			+donnees['fields']['ligne_5']
																			+'" longitude="'+donnees['geometry']['coordinates']['0']
																			+'" latitude="'+donnees['geometry']['coordinates']['1']
																			+'" >'+donnees['fields']['ligne_5']+'</option>');
												
											} else {
												$('#selecteVille').append('<option value="'
																			+donnees['fields']['nom_de_la_commune']
																			+'" longitude="'+donnees['geometry']['coordinates']['0']
																			+'" latitude="'+donnees['geometry']['coordinates']['1']
																			+'" >'+donnees['fields']['nom_de_la_commune']+'</option>');
												
											}
										}
										
								// fin du each
								});

								// essai avec deplacement de l'affichage des balises
									$('#selecteVille').show();
									$('#submit').show();
									$('#messageAttente').html('');


							// fin du success
							},

							error : function(result, status, error) {
								console.log("Réponse jquery : ");
								console.log(result);
								console.log("Status de requete : " + status);
								console.log(status);
								console.log("Type d'erreur : "+error);
								console.log(error);
							},


						// fin ajax
						});
					// fin de la condition de vérification de la longueur de la chaine
					};
		// fin de la fonction de recherche de la ville par le code postal
		});


		// Fin de l'affichage de la liste des villes
	 

	/*
		Envoie du formulaire avec le choix de la ville 
		en recuperant la longitude et la latitude au site 
		de renseigment et de renvoie par json du resultat de la ville
		pour cela on travail sur la click du submit du formulaire
	*/
		$('#submit').on('click', function(event){
			// annulation de la réaction automatique du click
				event.preventDefault();
				if ( event.keyCode == 13 ){event.preventDefault();}
			/* 
				Récupération des données 
			*/
				// récuperation de la ville
				var ville_selectionnee = $("#selecteVille :selected").val();
				    ville_selectionnee = ville_selectionnee.substring(0,1).toUpperCase()+ville_selectionnee.substring(1).toLowerCase();
				// récuperation de la longitude
				var longitude          = $("#selecteVille :selected").attr('longitude');
				// récupération de la latitude
				var latitude           = $('#selecteVille :selected').attr('latitude');
				
			// affichage dans le dom
				
				var affichage_page = ('<section id="donneesGenerales" >'
									+'<h2>'+ville_selectionnee+'</h2>'
									+'<p> Longitude : '+Math.round(longitude*100)/100+'°.</p>'
									+'<p> Latitude : '+Math.round(latitude*100)/100+'°.</p>');

				$('#meteo_ville').html(affichage_page);

				/*
					Ajax pour la récupération du Json de météo
				 */
				
				 	// creation de la variable pour l'url
				 		// par gps
				 			var nouvelle_latitude  = latitude;
							var nouvelle_longitude = longitude;
							var url_json           = 'http://www.prevision-meteo.ch/services/json/lat='+nouvelle_latitude+'lng='+nouvelle_longitude;
				 			
					$.ajax ({
						method : 'POST',
						url : url_json,
						dataType : 'json',
													
						success : function(data, status) {
							/*
								Conditions actuelles
							*/
								
								// affichage de controle du Json reçus
								console.log(data);

								// initialisation des variables
								var leveSoleilKyou                 = data['city_info']['sunrise'];
								var coucheSoleilKyou               = data['city_info']['sunset'];
								var image_courant                  = data['current_condition']['icon_big'];
								var condition_courant              = data['current_condition']['condition'];
								var direction_vent_courant         = ventDirectionCardinal (data['current_condition']['wnd_dir']);
								var vitesse_vent_courant           = data['current_condition']['wnd_spd'];
								var vitesse_vent_raffal_courant    = data['current_condition']['wnd_gust'];
								var temperature_courant            = data['current_condition']['tmp'];
								var pression_atmospherique_courant = data['current_condition']['pressure'];
								var humidite_courant               = data['current_condition']['humidity'];
								var heure_courant                  = data['current_condition']['hour'];

								// affichage sur le dom des conditions actuelles
									$('#meteo_ville').append(
										 '<p> Levé du soleil : '+leveSoleilKyou+'</p>'
										+'<p> Couché du soleil : '+coucheSoleilKyou+'</p>'
										+'</section>'
										+'<section id="actuelle" >'
											+'<h3>Conditions actuelles</h3>'
											+'<p class="imageMeteo" > '
												+'<img src="'+image_courant+'"'+' title="'+condition_courant+'" alt="'+condition_courant+'" >'+'</img>  '
											+'</p>'
											+'<p> Mise à jour à '+heure_courant+' Heure Suisse </p>'
											+'<p> Température : '+temperature_courant+' °C </p>'
											+'<p> Direction du vent : '+direction_vent_courant+'</p>'
											+'<p> Vitesse du vent : '+vitesse_vent_courant+' Km/h </p>'
											+'<p> Vitesse du vent en rafale : '+vitesse_vent_raffal_courant+' Km/h </p>'
											+'<p> Préssion atmosphérique : '+pression_atmospherique_courant+' Hpa </p>'
											+'<p> Humidité : '+humidite_courant+'%</p>'
										+'</section>');
								// fin des conditions meteos actuelles

							/*
								affichage des Jours
							*/
						
								// Gestion meteo j
									// récupération des données jour J, j1, j2, j3, j4
										var jour_j = [
														data['fcst_day_0']['day_long'], 
														data['fcst_day_1']['day_long'],
														data['fcst_day_2']['day_long'],
														data['fcst_day_3']['day_long'],
														data['fcst_day_4']['day_long'] 
													];

										var date_j = [
														data['fcst_day_0']['date'],
														data['fcst_day_1']['date'],
														data['fcst_day_2']['date'],
														data['fcst_day_3']['date'],
														data['fcst_day_4']['date']
													];
										
									// récupération des donnes de chaque jour par une boucle
										var imageMeteoJour     = [data['fcst_day_0']['icon_big']];
										var conditionMeteoJour = [data['fcst_day_0']['condition']];
										var tempMaxMeteoJour   = [data['fcst_day_0']['tmax']];
										var tempMiniMeteoJour  = [data['fcst_day_0']['tmin']];
										var donneesHeure       = [data['fcst_day_0']['hourly_data']];

										for (var i = 1; i < jour_j.length; i++) {
											imageMeteoJour.push(data['fcst_day_'+i]['icon_big']);
											conditionMeteoJour.push(data['fcst_day_'+i]['condition']);
											tempMaxMeteoJour.push(data['fcst_day_'+i]['tmax']);
											tempMiniMeteoJour.push(data['fcst_day_'+i]['tmin']);

											// Mise en variable des données horaires du json
											donneesHeure.push(data['fcst_day_'+i]['hourly_data']);
											
											// Fin de For pour la récupération des données de chaque jours
											};

									/* 
										Affichage des données des jours par jours et création des 
										section pour l'affichage heure par heure
									*/ 
										for (var i = 0; i< jour_j.length; i++) {

											/*
											 	affichage de la météo journalières et création des sections pour l'affichage heure par heure
											*/	
												$('#meteo_ville').append(	
													'<section id="jour'+i+'" >'
														// création d'une Div pour le positionnement (n'altere pas avec le contenu juste la présentation)
														+'<div class="titreJourChevron" >'
															+'<h3>'+jour_j[i]+' '+date_j[i]+'</h3>'
															+'<a alt="ouverture des prédiction du jour" class="ouverture_prediction" >'
																+'<i class="fa fa-chevron-down predictionJour" aria-hidden="true"></i>'
															+'</a>'
														+'</div>'

														+'<section class="sectionPredictionJour" >'
															// création d'une DIV pour ajencement du code coté présentation
															+'<div>'
																+'<p>Mini : '+tempMiniMeteoJour[i]+'°C.  </p>'
																+'<p class="imageMeteo" >'
																	+'<img src="'+imageMeteoJour[i]+'" title="'+conditionMeteoJour[i]+'" alt="'+conditionMeteoJour[i]+'" />'
																+'</p>'
																+'<p>  Max : '+tempMaxMeteoJour[i]+'°C.</p>'
															+'</div>'	
															+'<section id="'+jour_j[i]+'" >'
																+'<div class="titreJourChevron titreOuvertureHeure" >'
																	+'<h3>heures par heures</h3>'
																	// mise en place d'un chevron pour ouverture de la section
																	+'<a alt="ouverture des prédiction des heures" class="ouverture_prediction" >'
																		+'<i class="fa fa-chevron-down predictionJour" aria-hidden="true"></i>'
																	+'</a>'
																+'</div>'
																// creation d'une section pour l'ouverture et la fermeture des heures par heure
																+'<section name="c_est_trouver" >'
																+'</section>'
															// fin de la section de l'affichage des données heures / heures
															+'</section>'
														// fin de la section d'ouverture / fermeture de la fenetre
														+'</section>'
													// fin de la section de l'affichage jour / jour
													+'</section>'
													// fin de l'append pour affichage dans le dom
													);
											/*
												 Affichage des données heures par heure
											*/
												// récupération du nom de l'id de la section pour insertion de l'html
												var idNomDuJour = '#'+jour_j[i]+' section:first';
												// fermeture de la section 
												$(idNomDuJour).hide();

																							
												$.each(donneesHeure[i], function(i, donnees){
																																				
													// récupération et traduction du type de précipitation 
														if (donnees['ISSNOW'] === 1) {
															var precipitationType = 'neige';
														} else if (donnees['ISSNOW'] === 0) {
															var precipitationType = 'pluie';
														} else if (donnees['ISSNOW'] === 2) {
															var precipitationType = 'pluie et neige mélée';
														} else { precipitationType = 'inconnue'; }

														// Phrase de la précipitation
															if (donnees['APCPsfc'] == 0 ) {
																var precipitationAttendu = 'Il n\'y a aucune précipitation attendue.';

															} else {
																var precipitationAttendu = 'A cette heure, il est attendu '+donnees['APCPsfc']+' mm de '+precipitationType+'.';
															}

													// Récupération et traduction des données de la trajectoire 
													// du vent par données cardinales
														var ventDirectionCardinaux = ventDirectionCardinal (donnees['WNDDIRCARD10']);


													// Récupération et traduction de l'humidex et du rafraichissement eolien (facteur vent)
														var humidex = donnees['HUMIDEX'];
														var refroidissementEolien = donnees['WINDCHILL2m'];

														// vérification de la nulité de la variable et la transphormé en 0 au lieu de null
															if ( humidex == null ){ humidex = 0 ; }
															if ( refroidissementEolien == null ) { refroidissementEolien = 0 ; }

														// traduction des donnees
															// humidex
																if ( humidex <= 30  ){
																	var tradHumidex = 'aucun inconfort.';
																} else if ( humidex > 30 && humidex <= 40 ) {
																	var tradHumidex = 'Certain inconfort.';
																} else if ( humidex > 40 && humidex <= 45 ) {
																	var tradHumidex = 'Beaucoup d\'inconfort.';
																} else if ( humidex > 45 && humidex <= 54 ) {
																	var tradHumidex = 'il y a danger un coup de chaleur est probable.';
																} else if ( himidex > 54 ) {
																	var tradHumidex = ' un coup de chaleur est imminent.'
																} else {
																	var tradHumidex = 'Erreur inconnue...';
																}

															// refroidissement eolien
																if ( refroidissementEolien >= 0 ) {
																	var tradRefroidissementEolien = 'Sans risque de gelures ni d\'hypothermie.';
																} else if ( refroidissementEolien > 0 && refroidissementEolien > -10 ) { 
																	var tradRefroidissementEolien = 'Faible risque de gelures';
																} else if ( refroidissementEolien >= -10 && refroidissementEolien > -28 ) {
																	var tradRefroidissementEolien = 'Faible risque de gelures et d\'hypothermie.'
																} else if ( refroidissementEolien >= -40 && refroidissementEolien > -48 ) {
																	var tradRefroidissementEolien = 'Risque élevé de gelures en 5 à 10 minutes de la peau exposée et d’hypothermie';
																} else if ( refroidissementEolien >= 48 && refroidissementEolien > -55 ) {
																	var tradRefroidissementEolien = 'Risque très élevé de gelures en 2 à 5 minutes sans protection intégrale ni activité.';
																} else if ( refroidissementEolien >= -55 ) {
																	var tradRefroidissementEolien = 'Danger ! Risque extrêmement élevé de gelures en moins de 2 minutes et d\'hypothermie.';

																} else {
																	var tradRefroidissementEolien = 'Erreur inconnue...'; 
																}




													/*
													  Insertion dans le DOM de la météo heure par heure
													*/
														
														$(idNomDuJour).append(
															'<section class="heureParHeure" >'
																// creation du chevron d'ouverture de la section
																+'<div class="titreJourChevron titreOuvertureHeure" >'
																	+'<h4 class="heure" >'+i+'</h4>'
																	// mise en place d'un chevron pour ouverture de la section
																	+'<a alt="ouverture des prédiction des heures" class="ouverture_prediction" >'
																		+'<i class="fa fa-chevron-down predictionJour" aria-hidden="true"></i>'
																	+'</a>'
																+'</div>'
																// creation d'une section pour afficher avec click les heures que l'on veut
																+'<section class="sectionPredictionHeure">'
																	// Image et température
																	+'<section class="debutHeure" >'
																		+'<img src="'+donnees['ICON']+'" title="'+donnees["CONDITION"]+'" alt="'+donnees["CONDITION"]+'" />'
																		+'<p>  /  '+donnees['TMP2m']+'°C </p>'
																	+'</section>'

																	// Générale
																	+'<section class="generaleHeure" >'
																		// création d'une liste pour les données générales
																		// ou ne pouvant pas être regroupées
																		+'<ul class="listeGeneraleHeure" >'
																		 
																			+'<li>La rosée à 2 mètres se produit à '+donnees['DPT2m']+'°C. </li>'
																			+'<li>La préssion atmosphérique est de '+donnees['PRMSL']+' Hpa. </li>'
																			+'<li>Le potentiel orageux est de '+donnees['KINDEX']+'. </li>'
																			+'<li>'+precipitationAttendu+'</li>'
																			+'<li>Le taux d\'humidité relative est de '+donnees['RH2m']+'%.'
																		+'</ul>'
																	+'</section>'

																	// Section Humidex + erefroidissement eolien (facteur vent)
																	+'<section class="humidexFacteurVent" >'
																		+'<h5>Risques</h5>'
																		+'<ul>'
																			+'<li>L\'humidex est de : '+ humidex +' </li>'
																			+'<li>'+tradHumidex+'</li>'
																			+'<li>Refroidissement éolien : '+refroidissementEolien+'</li>'
																			+'<li>'+tradRefroidissementEolien+'</li>'
																		+'</ul>'
																	+'</section>'

																	// Section nuages
																	+'<section class="nuageHeure" >'
																		+'<h5>Nuages</h5>'
																		+'<ul class="listeNuageHeure" >'
																			+'<li>Haute altitude ..: '+donnees['HCDC']+'</li>'
																			+'<li>Moyènne altitude : '+donnees['MCDC']+'</li>'
																			+'<li>Basse altitude ..: '+donnees['LCDC']+'</li>'
																		+'</ul>'
																	+'</section>'

																	// Section vent
																	+'<section class="ventHeure" >'
																		+'<h5>Vents</h5>'
																		+'<ul class="listeVentHeure" >'
																			+'<li>Direction à 10m en degré : '+donnees['WNDDIR10m']+'°.</li>'
																			+'<li>Direction à 10m : '+ventDirectionCardinaux+'.</li>'
																			+'<li>Vitesse à 10m : '+donnees['WNDSPD10m']+' Km/h.</li>'
																			+'<li>Rafale à 10m : '+donnees['WNDGUST10m']+' Km/h.</li>'
																		+'</ul>'
																		// fin de la section vent
																	+'</section>'
																	// fin de la section pour le click
																+'</section>'
																// fin de la section heureParHeure
															+'</section>'
															// fin de l'append pour l'affichage heure par heure 
															);
													// fin de la boucle each
													});
											// Fin de la boucle d'affichage des jours et création des id nomDuJour
											};
									// fin gestion J
							

							/*
								Ouverture / Fermeture de la fenetre des jours
							*/
								$('.ouverture_prediction').on('click', function(event){
									// annulation de l'evenement
									event.preventDefault();
								
									// récupération
									var etatChevron = $('.predictionJour',this).attr('class');

									// création du chemin pour l'ouverture de la fenettre
									var cheminFenetre = $(this).parent().next('section:first');
									//var cheminFenetre = $(this).parent().next();

									// effectuer le changement de la classe pour changement du chevron
									$('.predictionJour', this).toggleClass('fa-chevron-down');
									$('.predictionJour', this).toggleClass('fa-chevron-up');

									// Ouverture / fermeture de la fenetre
									cheminFenetre.slideToggle();

									// Fin de la fonction click sur le chevron 
									});
								// Fin de l'ouverture / Fermeture des jours 	
								

							// fin du succes
							},

						error : function(result, status, error) {
							console.log("Réponse jquery : "+result);
							console.log(result);
							console.log("Status de requete : " + status);
							console.log(status);
							console.log("Type d'erreur : "+error);
							console.log(error);
							},
						});
						// Fin de la procédure Ajax

			// fin de la fonction du click sur le submit du formulaire
			});
		// fin du traitement du formulaire du choix de la ville
		
// fin du script javaScript / jQuery
});