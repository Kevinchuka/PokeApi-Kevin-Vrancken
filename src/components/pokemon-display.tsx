import type React from "react";
import { GameState } from "../hooks/use-game-manager";
import type { Pokemon } from "../types/pokemon.interface";
import Spinner from "./spinner";

interface Props {
    pokemon: Pokemon | null;
    isLoading: boolean;
    gameState: GameState;
    showHints: boolean;
}

const getGenerationLabel = (id: number) => {
    if (id <= 151) return "Kanto";
    if (id <= 251) return "Johto";
    if (id <= 386) return "Hoenn";
    if (id <= 493) return "Sinnoh";
    if (id <= 649) return "Teselia";
    if (id <= 721) return "Kalos";
    if (id <= 809) return "Alola";
    if (id <= 905) return "Galar";
    return "Paldea";
};

const PokemonDisplay = ({ pokemon, isLoading, gameState, showHints }: Props) => {
    const showAnswer = gameState !== GameState.Playing;
    const image = pokemon?.image;
    const name = pokemon?.name;
    const revealHints = showHints || showAnswer;

    const handleDragStart = (e: React.DragEvent<HTMLImageElement>) => {
        e.preventDefault();
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
    };

    return (
        <section
            className={`game-card ${
                showAnswer ? (gameState === GameState.Correct ? "is-correct" : "is-wrong") : "is-playing"
            }`}
        >
            <div className="game-card__header">
                <div>
                    <p className="game-card__tag">PokéDesafío</p>
                    <h2 className="game-card__title">
                        {showAnswer ? name?.toUpperCase() : "¿Quién es ese Pokémon?"}
                    </h2>
                </div>
                <span className="game-card__badge">Gen {pokemon ? getGenerationLabel(pokemon.id) : "?"}</span>
            </div>

            <div className="game-card__body">
                {isLoading ? (
                    <Spinner />
                ) : (
                    <div className="pokemon-figure__wrapper">
                        <img
                            src={image || ""}
                            alt={name ? `Imagen de ${name}` : "Silueta del Pokémon"}
                            className={`pokemon-figure ${showAnswer ? "is-revealed" : "is-hidden"}`}
                            draggable={false}
                            onDragStart={handleDragStart}
                            onContextMenu={handleContextMenu}
                        />
                        <div className="pokemon-figure__glow" />
                    </div>
                )}
            </div>

            <div className="game-card__footer">
                <div className="info-grid">
                    <div className="info-item">
                        <span className="info-item__label">Tipo</span>
                        <div className="info-item__value">
                            {pokemon?.types.length ? (
                                pokemon.types.map((type) => (
                                    <span
                                        key={type}
                                        className={`type-chip ${revealHints ? "" : "type-chip--mystery"}`}
                                    >
                                        {revealHints ? type : "???"}
                                    </span>
                                ))
                            ) : (
                                <span className="type-chip type-chip--mystery">???</span>
                            )}
                        </div>
                    </div>
                    <div className="info-item">
                        <span className="info-item__label">Altura</span>
                        <span className={`info-item__value ${revealHints ? "" : "info-item__value--mystery"}`}>
                            {pokemon ? (revealHints ? `${(pokemon.height / 10).toFixed(1)} m` : "???") : "--"}
                        </span>
                    </div>
                    <div className="info-item">
                        <span className="info-item__label">Peso</span>
                        <span className={`info-item__value ${revealHints ? "" : "info-item__value--mystery"}`}>
                            {pokemon ? (revealHints ? `${(pokemon.weight / 10).toFixed(1)} kg` : "???") : "--"}
                        </span>
                    </div>
                </div>
                <p className="game-card__hint">
                    {showAnswer
                        ? "¡Bien jugado! Desbloqueaste todos los detalles del Pokémon."
                        : "Activa las pistas para obtener detalles adicionales sin revelar el nombre."}
                </p>
            </div>
        </section>
    );
};

export default PokemonDisplay;
