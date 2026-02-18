import { useState } from "react";
import type { GameState } from "../hooks/use-game-manager";

interface Props {
    handlePokemonNameSubmit: (userInput: string) => void;
    revealPokemon: () => void;
    onToggleHints: () => void;
    showHints: boolean;
    gameState: GameState;
    labels: {
        placeholder: string;
        submit: string;
        showHints: string;
        hideHints: string;
        surrender: string;
    };
}

const PokemonForm = ({ handlePokemonNameSubmit, revealPokemon, onToggleHints, showHints, gameState, labels }: Props) => {
    const [inputValue, setInputValue] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) {
            return;
        }
        handlePokemonNameSubmit(inputValue.trim().toLowerCase());
        setInputValue("");
    };

    const isPlaying = gameState === "playing";

    return (
        <form className="game-form" onSubmit={handleSubmit}>
            <div className="game-form__input">
                <i className="bi bi-search" />
                <input
                    type="text"
                    className="form-control"
                    placeholder={labels.placeholder}
                    aria-label={labels.placeholder}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    autoFocus
                    disabled={!isPlaying}
                />
            </div>
            <div className="game-form__actions">
                <button className="btn btn-primary" type="submit" disabled={!inputValue.trim() || !isPlaying}>
                    {labels.submit}
                </button>
                <button
                    className={`btn btn-outline-light ${showHints ? "is-active" : ""}`}
                    type="button"
                    disabled={!isPlaying}
                    onClick={onToggleHints}
                >
                    {showHints ? labels.hideHints : labels.showHints}
                </button>
                <button className="btn btn-outline-danger" type="button" disabled={!isPlaying} onClick={revealPokemon}>
                    {labels.surrender}
                </button>
            </div>
        </form>
    );
};

export default PokemonForm;
