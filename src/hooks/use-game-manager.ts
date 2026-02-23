import { useCallback, useEffect, useState } from "react";
import type { Pokemon } from "../types/pokemon.interface";
import { pokemonService } from "../services/pokemon.service";

export const GameState = {
    Playing: "playing",
    Correct: "correct",
    Wrong: "wrong",
} as const;

export type GameState = (typeof GameState)[keyof typeof GameState];

interface GameStats {
    total: number;
    correct: number;
    wrong: number;
    streak: number;
    bestStreak: number;
}

const INITIAL_STATS: GameStats = {
    total: 0,
    correct: 0,
    wrong: 0,
    streak: 0,
    bestStreak: 0,
};

export const useGameManager = () => {
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [gameState, setGameState] = useState<GameState>(GameState.Playing);
    const [stats, setStats] = useState<GameStats>(INITIAL_STATS);

    const registerAttempt = useCallback((isCorrect: boolean) => {
        setStats((prev) => {
            const total = prev.total + 1;
            if (isCorrect) {
                const streak = prev.streak + 1;
                return {
                    ...prev,
                    total,
                    correct: prev.correct + 1,
                    streak,
                    bestStreak: Math.max(prev.bestStreak, streak),
                };
            }

            return {
                ...prev,
                total,
                wrong: prev.wrong + 1,
                streak: 0,
            };
        });
    }, []);

    const handlePokemonNameSubmit = useCallback(
        (userInput: string) => {
            if (!pokemon || gameState !== GameState.Playing) return;

            const isValid = pokemonService.isPokemonNameValid(pokemon.name, userInput);

            if (isValid) {
                setGameState(GameState.Correct);
                registerAttempt(true);
            } else {
                setGameState(GameState.Wrong);
                registerAttempt(false);
            }
        },
        [gameState, pokemon, registerAttempt]
    );

    const revealPokemon = useCallback(() => {
        if (!pokemon || gameState !== GameState.Playing) return;
        setGameState(GameState.Wrong);
        registerAttempt(false);
    }, [gameState, pokemon, registerAttempt]);

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

    useEffect(() => {
        loadNewPokemon();
    }, [loadNewPokemon]);

    return {
        pokemon,
        isLoading,
        error,
        loadNewPokemon,
        handlePokemonNameSubmit,
        revealPokemon,
        gameState,
        stats,
    };
};
