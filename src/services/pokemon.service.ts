
import type { Pokemon } from "../types/pokemon.interface";
import { getRandomIntInclusive } from "../lib/random-number";

const POKEMON_API_URL = 'https://pokeapi.co/api/v2/pokemon';
const MAX_POKEMON_COUNT = 600;

export const getRandomPokemon = async (): Promise<Pokemon> => {
    const randomId = getRandomIntInclusive(1, MAX_POKEMON_COUNT);
    const response = await fetch(`${POKEMON_API_URL}/${randomId}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch Pokémon with ID ${randomId}`);
}

const data = await response.json();
    return {
        id: data.id,
        name: data.name,
        image: data.sprites.other["official-artwork"].front_default,
    };
}

const normalizePokemonName = (name: string): string => {
    return name
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-z0-9]+/g, ""); // Replace non-alphanumeric characters
};

const isPokemonNameValid = (
    pokemonName: string,
    userInput:string
): boolean => {
    const normalizedPokemonName = normalizePokemonName(pokemonName);
    const normalizedUserInput = normalizePokemonName(userInput);

    return normalizedPokemonName === normalizedUserInput;
}

export const pokemonService = {
    getRandomPokemon,
    isPokemonNameValid
};