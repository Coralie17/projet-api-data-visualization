// API 1 - BARRE DE RECHERCHE + AFFICHAGE FICHES PERSONNAGES

const request1 = () => {

    // Récupération de la valeur de l'input de recherche
    const searchCharacter = document.getElementById("characterInput").value;
            
    // Modification de l'input pour correspondre à l'API (structure URL attendue) => exemple : 'Harry Potter' deviendra 'harry-potter'
    // a. Remplacer l'espace ' ' (saisi par l'utilisateur) par un tiret '-'
    const nom = searchCharacter.replaceAll(' ','-');
    // b. Convertir en minuscules
    const nomMin = nom.toLowerCase();

    // Requête fetch avec la syntaxe .then()
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


// _____________________________________________________

// API 2 - GRAPHIQUES + LISTE NOMS DES PERSONNAGES

const request2 = async () => {
    function premierGraph()
    {
        const ctx = document.getElementById('myChart');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Gryffindor', 'Slytherin', 'Ravenclaw', 'Hufflepuff'],
                datasets: [{
                    label: 'nombre de personnages par maison',
                    data: listCharactersByHouses,
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

    function deuxiemeGraph()
    {
        const ctx = document.getElementById('myChart1');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['male', 'female'],
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
    
    // Recupération des datas
	const url = "https://hp-api.onrender.com/api/characters"
	const response = await fetch(url)
	const posts = await response.json()

	// Affichage des datas
	// 1. Récupération de l'élément UL (pour contenir mes puces)
	const ulElement = document.getElementById("post-list")
    // 2. Création d'un dict (dictionary : structure de données "clé-valeur") pour faire la somme des persos par maison
    let dictHouses = {
        'Gryffindor': 0, 
        'Slytherin': 0, 
        'Ravenclaw': 0, 
        'Hufflepuff': 0
    }
    // 3. Création d'un dict (dictionary : structure de données "clé-valeur") pour faire la somme des persos par genre
    let dictGenders = {
        'male': 0,
        'female': 0
    }
	// 4. Pour chaque post, éxecuter le traitement suivant:
	for (const post of posts) {
		// a) Création d'un LI (d'une puce)
		const liElement = document.createElement('li')
		// b) Insertion du post dans la puce
		const detailElement = document.createElement('details')
		const summaryElement = document.createElement('summary')
        const genderElement = document.createElement ('p')
		const pElement = document.createElement('p')
        const imageElement = document.createElement('img')
		detailElement.appendChild(summaryElement)
        detailElement.appendChild(genderElement)
		detailElement.appendChild(pElement)
        detailElement.appendChild(imageElement)
		summaryElement.innerText = post.name
        genderElement.innerText = post.gender
		pElement.innerText = post.house
        imageElement.src = post.image
        //pElement.innerHTML += `<img src="${post.image}">`
        liElement.appendChild(detailElement)
		// c) Insertion de la puce (dans laquelle j'ai mis le post en b) dans l'élément UL
		ulElement.appendChild(liElement)

        /*ex : si l'élément 'house'=ravenclaw j'ajoute +1*/
        if(post.house == 'Gryffindor'){
            dictHouses.Gryffindor++
        }else if(post.house == 'Slytherin'){
            dictHouses.Slytherin++
        }else if(post.house == 'Ravenclaw'){
            dictHouses.Ravenclaw++
        }else if(post.house == 'Hufflepuff'){
            dictHouses.Hufflepuff++
        }else{
            console.log(post.house)// Vérifier que la maison est connue
        }

		if(post.gender == 'male'){
            dictGenders.male++
        }else if(post.gender == 'female'){
            dictGenders.female++
        }else{
            console.log(post.gender)
        }
        
	}
    console.log(dictHouses) // vérifier la valeur de dictHouses
    console.log(dictGenders)

    let listCharactersByHouses = [dictHouses.Gryffindor, dictHouses.Slytherin, dictHouses.Ravenclaw, dictHouses.Hufflepuff]
    console.log(listCharactersByHouses) // Variable contenant la liste du # de perso/maison(voir le résultat du console.log dans la page web)

    premierGraph()

    let listGenderByCharatecrs = [dictGenders.male,dictGenders.female]
    console.log(listGenderByCharatecrs)
    deuxiemeGraph()
}
request2()