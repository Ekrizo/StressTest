const pokemon1Sprite = document.getElementById('pokemon1-sprite');
const pokemon1Name = document.getElementById('pokemon1-name');
const pokemon1Hp = document.getElementById('pokemon1-hp');
const pokemon1Moves = document.getElementById('pokemon1-moves');
const pokemon1SelectedMove = document.getElementById('pokemon1-selected-move');

const pokemon2Sprite = document.getElementById('pokemon2-sprite');
const pokemon2Name = document.getElementById('pokemon2-name');
const pokemon2Hp = document.getElementById('pokemon2-hp');
const pokemon2Moves = document.getElementById('pokemon2-moves');
const pokemon2SelectedMove = document.getElementById('pokemon2-selected-move');

const battleLog = document.getElementById('battle-log');
const generateButton = document.getElementById('generate-button');
const battleButton = document.getElementById('battle-button');

let pokemon1, pokemon2;

async function fetchPokemon() {
    const randomId = Math.floor(Math.random() * 898) + 1; // PokeAPI has 898 Pokémon
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    return response.json();
}

async function generatePokemons() {
    pokemon1 = await fetchPokemon();
    pokemon2 = await fetchPokemon();

    displayPokemon(pokemon1, pokemon1Sprite, pokemon1Name, pokemon1Hp, pokemon1Moves);
    displayPokemon(pokemon2, pokemon2Sprite, pokemon2Name, pokemon2Hp, pokemon2Moves);

    // Clear the battle log when new Pokémon are generated
    battleLog.textContent = '';

    battleButton.disabled = false;
}

function displayPokemon(pokemon, spriteElement, nameElement, hpElement, movesElement) {
    spriteElement.src = pokemon.sprites.front_default;
    nameElement.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    hpElement.textContent = `HP: ${pokemon.stats[0].base_stat}`;

    movesElement.innerHTML = '';
    pokemon.moves.slice(0, 4).forEach(move => {
        const moveButton = document.createElement('button');
        moveButton.textContent = move.move.name;
        moveButton.onclick = () => selectMove(move.move.name, nameElement);
        movesElement.appendChild(moveButton);
    });
}

// Add these variables to store the selected moves
let pokemon1SelectedMoveName = '';
let pokemon2SelectedMoveName = '';

// Modify the selectMove function to save the selected move name
function selectMove(moveName, nameElement) {
    if (nameElement === pokemon1Name) {
        pokemon1SelectedMoveName = moveName;
        pokemon1SelectedMove.textContent = `Selected Move: ${moveName}`;
    } else {
        pokemon2SelectedMoveName = moveName;
        pokemon2SelectedMove.textContent = `Selected Move: ${moveName}`;
    }
}

// Function to fetch move data from PokéAPI
async function fetchMoveData(moveName) {
    const response = await fetch(`https://pokeapi.co/api/v2/move/${moveName}`);
    return response.json();
}

// Function to calculate damage
function calculateDamage(basePower, attackStat, isSTAB, typeEffectiveness) {
    let damage = basePower;

    // Apply STAB
    if (isSTAB) {
        damage *= 1.5;
    }

    // Apply type effectiveness
    damage *= typeEffectiveness;

    // Final damage calculation (simplified)
    return Math.floor(damage * (attackStat / 100)); // Example scaling
}

async function startBattle() {
    // Fetch move data for both selected moves
    const pokemon1MoveData = await fetchMoveData(pokemon1SelectedMoveName);
    const pokemon2MoveData = await fetchMoveData(pokemon2SelectedMoveName);

    // Get base power and calculate damage
    const pokemon1BasePower = pokemon1MoveData.power || 0; // Default to 0 if no power
    const pokemon2BasePower = pokemon2MoveData.power || 0; // Default to 0 if no power

    const pokemon1AttackStat = pokemon1.stats[1].base_stat; // Assuming Attack is the second stat
    const pokemon2AttackStat = pokemon2.stats[1].base_stat; // Assuming Attack is the second stat

    const isSTAB1 = pokemon1.types.some(type => pokemon1MoveData.type.name === type.type.name);
    const isSTAB2 = pokemon2.types.some(type => pokemon2MoveData.type.name === type.type.name);

    const typeEffectiveness1 = 1; // You can implement type effectiveness logic here
    const typeEffectiveness2 = 1; // You can implement type effectiveness logic here

    // Calculate damage for both Pokémon
    const pokemon1Damage = calculateDamage(pokemon1BasePower, pokemon1AttackStat, isSTAB1, typeEffectiveness2);
    const pokemon2Damage = calculateDamage(pokemon2BasePower, pokemon2AttackStat, isSTAB2, typeEffectiveness1);

    // Update HP
    const pokemon1CurrentHp = parseInt(pokemon1Hp.textContent.split(': ')[1]) - pokemon2Damage;
    const pokemon2CurrentHp = parseInt(pokemon2Hp.textContent.split(': ')[1]) - pokemon1Damage;

    pokemon1Hp.textContent = `HP: ${pokemon1CurrentHp}`;
    pokemon2Hp.textContent = `HP: ${pokemon2CurrentHp}`;

    battleLog.textContent += `\n${pokemon1Name.textContent} dealt ${pokemon1Damage} damage to ${pokemon2Name.textContent}.`;
    battleLog.textContent += `\n${pokemon2Name.textContent} dealt ${pokemon2Damage} damage to ${pokemon1Name.textContent}.`;

    if (pokemon1CurrentHp <= 0) {
        battleLog.textContent += `\n${pokemon1Name.textContent} fainted! ${pokemon2Name.textContent} wins!`;
        battleButton.disabled = true;
    } else if (pokemon2CurrentHp <= 0) {
        battleLog.textContent += `\n${pokemon2Name.textContent} fainted! ${pokemon1Name.textContent} wins!`;
        battleButton.disabled = true;
    }
}

generateButton.addEventListener('click', generatePokemons);
battleButton.addEventListener('click', startBattle);