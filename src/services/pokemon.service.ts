import type { Pokemon } from "../types/pokemon.interface";
import { getRandomIntInclusive } from "../lib/random-number";

const POKEMON_API_URL = "https://pokeapi.co/api/v2/pokemon";
const MAX_POKEMON_COUNT = 1118;
const MAX_RETRIES = 5;

export const getRandomPokemon = async (): Promise<Pokemon> => {
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        const randomId = getRandomIntInclusive(1, MAX_POKEMON_COUNT);
        const response = await fetch(`${POKEMON_API_URL}/${randomId}`);

        if (!response.ok) {
            continue; // probamos otro ID (hay IDs que dan 404)
        }

        const data = await response.json();

        return {
            id: data.id,
            name: data.name,
            image: data?.sprites?.other?.["official-artwork"]?.front_default ?? null,
        };
    }

    throw new Error("Failed to fetch a valid Pokémon after several attempts");
};

const normalizePokemonName = (name: string): string => {
    return name
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
        .replace(/[^a-z0-9]+/g, ""); // Replace non-alphanumeric characters
};

const isPokemonNameValid = (pokemonName: string, userInput: string): boolean => {
    const normalizedPokemonName = normalizePokemonName(pokemonName);
    const normalizedUserInput = normalizePokemonName(userInput);

    return normalizedPokemonName === normalizedUserInput;
};

export const pokemonService = {
    getRandomPokemon,
    isPokemonNameValid,
};
