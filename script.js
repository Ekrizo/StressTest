document.addEventListener("DOMContentLoaded", () => {
    const randomPokemonButton = document.getElementById("random-pokemon-button");

    randomPokemonButton.addEventListener("click", () => {
        // Generate a random Pokémon ID (1 to 898, as of the latest Pokémon)
        const randomId = Math.floor(Math.random() * 898) + 1; // Random ID between 1 and 898
        const apiUrl = `https://pokeapi.co/api/v2/pokemon/${randomId}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                // Update the HTML with the Pokémon's information
                document.getElementById("pokemon-sprite").src = data.sprites.front_default;
                
                // Update the Pokémon name
                document.getElementById("name").innerText = data.name.charAt(0).toUpperCase() + data.name.slice(1); // Capitalize the first letter

                document.getElementById("height").innerText = data.height / 10; // Convert to meters
                document.getElementById("weight").innerText = data.weight / 10; // Convert to kg
                document.getElementById("base-experience").innerText = data.base_experience;

                // Abilities
                const abilities = data.abilities.map(ability => ability.ability.name).join(", ");
                document.getElementById("abilities").innerText = abilities;

                // Moves
                const movesContainer = document.getElementById("moves-container");
                movesContainer.innerHTML = ""; // Clear previous moves

                const moves = data.moves.slice(0, 4); // Get the first 4 moves
                moves.forEach(move => {
                    const button = document.createElement("button");
                    button.innerText = move.move.name.charAt(0).toUpperCase() + move.move.name.slice(1); // Capitalize the first letter
                    button.onclick = () => alert(`You clicked on ${button.innerText}`); // Action for the button click
                    movesContainer.appendChild(button);
                });

                // Audio for cries
                const cryAudio = document.getElementById("cry");
                cryAudio.src = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${randomId}.ogg`;
                cryAudio.controls = true;
            })
            .catch(error => console.error("Error fetching data:", error));
    });
});