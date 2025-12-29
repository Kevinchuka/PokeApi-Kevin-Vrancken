import { useCallback, useEffect, useState } from "react";
import type { Pokemon } from "../types/pokemon.interface";
import { pokemonService } from "../services/pokemon.service";

export const GameState = {
    Playing: "playing",
    Correct: "correct",
    Wrong: "wrong",
} as const;

export type GameState = (typeof GameState) [keyof typeof GameState];

export const useGameManager = () => {
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [gameState, setGameState] = useState<GameState>(GameState.Playing);

    const handlePokemonNameSubmit = useCallback((
        userInput: string
    ) => {
        if (!pokemon) return;

        const isValid = pokemonService.isPokemonNameValid(pokemon.name, userInput);
        
        if (isValid) {
            setGameState(GameState.Correct);
        } else {
            setGameState(GameState.Wrong);
        }
    },[pokemon] )

    const loadNewPokemon = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setGameState(GameState.Playing);
        try {
            const randomPokemon = await pokemonService.getRandomPokemon();
            setPokemon(randomPokemon);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect (() => {
        loadNewPokemon();
    }, [loadNewPokemon]);

    return {
        pokemon,
        isLoading,
        error,
        loadNewPokemon,
        handlePokemonNameSubmit,
        gameState,
        }
}
