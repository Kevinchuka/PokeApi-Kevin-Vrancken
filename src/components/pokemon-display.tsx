import type React from "react";
import { GameState } from "../hooks/use-game-manager";
import type { Pokemon } from "../types/pokemon.interface";
import Spinner from "./spinner";

interface Props {
    pokemon: Pokemon | null;
    isLoading: boolean;
    gameState: GameState;
    showHints: boolean;
    labels: {
        tag: string;
        question: string;
        hintPlaying: string;
        hintRevealed: string;
        typeLabel: string;
        heightLabel: string;
        weightLabel: string;
        genShort: string;
        imageAlt: (name?: string) => string;
    };
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

const PokemonDisplay = ({ pokemon, isLoading, gameState, showHints, labels }: Props) => {
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
                    <p className="game-card__tag">{labels.tag}</p>
                    <h2 className="game-card__title">
                        {showAnswer ? name?.toUpperCase() : labels.question}
                    </h2>
                </div>
                <span className="game-card__badge">
                    {labels.genShort} {pokemon ? getGenerationLabel(pokemon.id) : "?"}
                </span>
            </div>

            <div className="game-card__body">
                {isLoading ? (
                    <Spinner />
                ) : (
                    <div className="pokemon-figure__wrapper">
                        <img
                            src={image || ""}
                            alt={labels.imageAlt(name)}
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
                        <span className="info-item__label">{labels.typeLabel}</span>
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
                        <span className="info-item__label">{labels.heightLabel}</span>
                        <span className={`info-item__value ${revealHints ? "" : "info-item__value--mystery"}`}>
                            {pokemon ? (revealHints ? `${(pokemon.height / 10).toFixed(1)} m` : "???") : "--"}
                        </span>
                    </div>
                    <div className="info-item">
                        <span className="info-item__label">{labels.weightLabel}</span>
                        <span className={`info-item__value ${revealHints ? "" : "info-item__value--mystery"}`}>
                            {pokemon ? (revealHints ? `${(pokemon.weight / 10).toFixed(1)} kg` : "???") : "--"}
                        </span>
                    </div>
                </div>
                <p className="game-card__hint">
                    {showAnswer ? labels.hintRevealed : labels.hintPlaying}
                </p>
            </div>
        </section>
    );
};

export default PokemonDisplay;
