// *** API 1 - BARRE DE RECHERCHE + AFFICHAGE FICHES PERSONNAGES ***

const request1 = () => {

    // Récupération de la valeur de l'input de recherche
    const searchCharacter = document.getElementById("characterInput").value;
            
    // Modification de l'input pour correspondre à l'API (structure URL attendue) => exemple : 'Harry Potter' deviendra 'harry-potter'
    // a. Remplacer l'espace ' ' (saisi par l'utilisateur) par un tiret '-'
    const nom = searchCharacter.replaceAll(' ','-');
    // b. Convertir en minuscules
    const nomMin = nom.toLowerCase();

    // Requête fetch avec la méthode .then()
    const fetchPromise = fetch(`https://api.potterdb.com/v1/characters/${nomMin}`);

    fetchPromise
        .then((response) => {
            // Vérification de la réussite de la requête
            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }
            // Conversion de la réponse en JSON
            return response.json();
        })

        .then((json) => {
            // Récupération des éléments du DOM (Fiches Personnages)
            const image = document.getElementById("image");
            const name = document.getElementById("name");
            const house = document.getElementById("house");
            const gender = document.getElementById("gender");
            const species = document.getElementById("species");

            // Mise à jour des éléments du DOM avec les données récupérées depuis l'API
            image.src = json.data.attributes.image;
            image.alt =`Photo du personnage ${json.data.attributes.name}`;
            name.textContent = json.data.attributes.name;
            house.textContent =`House : ${json.data.attributes.house}`;
            gender.textContent =`Gender : ${json.data.attributes.gender}`;
            species.textContent =`Species : ${json.data.attributes.species}`;
        })     
      
        .catch((err) => {
            // Gestion des erreurs => Affichage d'un message d'erreur
            alert("Ce personnage n'existe pas", err);
        });
    
};

// Récupération de l'élément HTML formulaire de recherche
const searchForm = document.getElementById("searchForm");

// Ajout d'un Gestionnaire d'évènement 'submit'
// => cet évènement est déclenché lorsque l'utilisateur clique sur le bouton de 'Recherche' ou appuie sur la touche 'Entrée' dans le champ de saisie du formulaire
searchForm.addEventListener("submit", (event) => {
    event.preventDefault();  // empêche le comportement par défaut du formulaire => permet de récupérer les données sans les envoyer à un autre emplacement, ni recharger la page 
    request1();
});


// ______________________________________________________


// *** API 2 - GRAPHIQUES + LISTE NOMS DES PERSONNAGES ***

// Ici : Requête n°2 - Fetch & Gestion de l'asynchrone avec async / await
// Création des graphiques avec la bibliothèque Chart.js

const request2 = async () => {
    
    // *** GRAPHIQUES ***
    
    // Fonction pour créer le GRAPHIQUE n°1 : Nombre de personnages par maison
    function premierGraph() {
        // Récupération de l'élément canvas HTML avec l'ID "myChart" (ctx contexte)
        const ctx = document.getElementById('myChart'); 
        // Création d'un nouvel objet "Chart" (instance) en utilisant le contexte (ctx) spécifié (canvas HTML)
        new Chart(ctx, { 
            // Type de graphique : ici graphique en barres 
            type: 'bar', 
            // Définition des données à afficher sur le graphique
            data: {
                // Labels / Etiquettes pour l'axe X (les catégories)
                labels: ['Gryffindor', 'Slytherin', 'Ravenclaw', 'Hufflepuff'],
                // Données à afficher sur le graphique (nombre de personnages par maison)
                datasets: [{
                    label: 'nombre de personnages par maison', 
                    data: listCharactersByHouses,
                    borderWidth: 1           
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true // Début du graphique à 0 sur l'axe Y
                    }
                }
            }
        });
    }

    // Fonction pour créer le GRAPHIQUE n°2 : Répartition des personnages (masculin / féminin)
    function deuxiemeGraph () {
        const ctx = document.getElementById('myChart1');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['male', 'female'],  // Labels / Etiquettes pour l'axe X (les catégories)
                datasets: [{  
                    label: 'nombre de personnages masculins & féminins',
                    data: listGenderByCharatecrs,
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Création d'un dict (DICTIONARY : structure de données "clé-valeur") pour compter / faire la somme des personnages par maison
    let dictHouses = {
        'Gryffindor': 0, 
        'Slytherin': 0, 
        'Ravenclaw': 0, 
        'Hufflepuff': 0
    }
    // Création d'un dictionnaire pour compter / faire la somme des personnages par genre
    let dictGenders = {
        'male': 0,
        'female': 0
    }
    

    // *** RECUPERATION DES DONNEES des personnages depuis l'API : ***

    // URL API n°2
	const url = "https://hp-api.onrender.com/api/characters";

    // Requête HTTP GET à l'url de l'API en utilisant la fonction fetch()
    // La fonction fetch() renvoie une promesse qui représente la réponse HTTP de la requête
    // Utilisation du mot-clé 'await' pour attendre que la promesse soit résolue (= que la réponse de la requête soit disponible)
    // La réponse est ensuite stockée dans la variable 'response'
	const response = await fetch(url);

    // Transformer la réponse HTTP en données au format JSON, et les stocker dans la variable 'posts'
    // Utilisation du mot clé 'await' pour attendre que la promesse soit résolue (= que les données JSON soient disponibles)
	const posts = await response.json();


	// *** AFFICHAGE DES DONNEES => GRAPHIQUES + LISTE DES PERSONNAGES ***

    // 1. Récupération de l'élément <UL> dans le HTML (qui contiendra les puces)
	const ulElement = document.getElementById("characters-list");

	// 2. Pour chaque personnage (post), exécuter le traitement suivant :
	for (const post of posts) {

		// *** LISTE PERSONNAGES : ***
        // a) Création d'un élément <LI> (puce)
		const liElement = document.createElement('li'); 
        // b) Création des sous-éléments de la puce <LI>
		const detailElement = document.createElement('details');
		const summaryElement = document.createElement('summary');
        const p1Element = document.createElement ('p');
		const p2Element = document.createElement('p');
        const imageElement = document.createElement('img');
        // c) Ajouter les éléments créés comme 'enfants' de 'detailElement'
        detailElement.appendChild(summaryElement);
        detailElement.appendChild(p1Element);
		detailElement.appendChild(p2Element);
        detailElement.appendChild(imageElement); 
        // d) Insertion de detailElement (enfant) dans l'élement LI (parent)
        liElement.appendChild(detailElement);
        // e) Insertion de la puce LI (enfant) dans l'élement UL (parent)
        ulElement.appendChild(liElement);
        // f) Insertion des données souhaitées issues de l'API dans nos éléments HTML
		summaryElement.innerText = post.name;
        p1Element.innerText = post.gender;
		p2Element.innerText = post.house;
        imageElement.src = post.image;

		// *** GRAPHIQUES : ***
        // Mise à jour des dictionnaires avec le nombre de personnages par maison et par genre
        // ex : si l'élément 'house'=ravenclaw j'ajoute +1*
        if (post.house == 'Gryffindor') {
            dictHouses.Gryffindor++
        } else if (post.house == 'Slytherin') {
            dictHouses.Slytherin++
        } else if (post.house == 'Ravenclaw') {
            dictHouses.Ravenclaw++
        } else if(post.house == 'Hufflepuff') {
            dictHouses.Hufflepuff++
        } else {
            console.log(post.house) // Vérifier que la maison est connue
        }

		if (post.gender == 'male') {
            dictGenders.male++
        } else if (post.gender == 'female') {
            dictGenders.female++
        } else {
            console.log(post.gender)
        } 
	}

    console.log(dictHouses) // vérifier la valeur de dictHouses
    console.log(dictGenders)

    // Création des listes de données pour les graphiques
    let listCharactersByHouses = [dictHouses.Gryffindor, dictHouses.Slytherin, dictHouses.Ravenclaw, dictHouses.Hufflepuff]
    console.log(listCharactersByHouses) // Variable contenant la liste du # de perso/maison(voir le résultat du console.log dans la page web)
    
    // Affichage du 1er Graphique :
    premierGraph() 

    let listGenderByCharatecrs = [dictGenders.male,dictGenders.female]
    console.log(listGenderByCharatecrs)

    // Affichage du 2ème Graphique :
    deuxiemeGraph()
}

request2();