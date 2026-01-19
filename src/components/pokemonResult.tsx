import { GameState } from "../hooks/use-game-manager";
import type { Pokemon } from "../types/pokemon.interface";

interface Props {
    loadNewPokemon: () => void;
    gameState: GameState;
    pokemon: Pokemon | null;
    labels: {
        correctTitle: string;
        wrongTitle: string;
        correctMessage: string;
        wrongMessage: (name?: string) => string;
        newRound: string;
    };
}

const PokemonResult = ({ loadNewPokemon, gameState, pokemon, labels }: Props) => {
    if (gameState === GameState.Playing) {
        return null;
    }

    const isCorrect = gameState === GameState.Correct;

    return (
        <div className={`result-card ${isCorrect ? "result-card--success" : "result-card--fail"}`}>
            <div className="result-card__content">
                <div>
                    <h2>
                        {isCorrect ? labels.correctTitle : labels.wrongTitle} {isCorrect ? "🎉" : "⚡"}
                    </h2>
                    <p>
                        {isCorrect ? labels.correctMessage : labels.wrongMessage(pokemon?.name?.toUpperCase())}
                    </p>
                </div>
                <i className={`bi ${isCorrect ? "bi-stars" : "bi-shield-fill-x"}`} />
            </div>
            <button className="btn btn-light" onClick={loadNewPokemon}>
                {labels.newRound}
            </button>
        </div>
    );
};

export default PokemonResult;
