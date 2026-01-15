import { GameState } from "../hooks/use-game-manager";
import type { Pokemon } from "../types/pokemon.interface";

interface Props {
    loadNewPokemon: () => void;
    gameState: GameState;
    pokemon: Pokemon | null;
}

const PokemonResult = ({ loadNewPokemon, gameState, pokemon }: Props) => {
    if (gameState === GameState.Playing) {
        return null;
    }

    const isCorrect = gameState === GameState.Correct;

    return (
        <div className={`result-card ${isCorrect ? "result-card--success" : "result-card--fail"}`}>
            <div className="result-card__content">
                <div>
                    <h2>
                        {isCorrect ? "¡Correcto!" : "¡Incorrecto!"} {isCorrect ? "🎉" : "⚡"}
                    </h2>
                    <p>
                        {isCorrect
                            ? "Has atrapado la respuesta y subes tu racha."
                            : `Era ${pokemon?.name?.toUpperCase() ?? "ese Pokémon"}. ¡No te rindas!`}
                    </p>
                </div>
                <i className={`bi ${isCorrect ? "bi-stars" : "bi-shield-fill-x"}`} />
            </div>
            <button className="btn btn-light" onClick={loadNewPokemon}>
                Nueva ronda
            </button>
        </div>
    );
};

export default PokemonResult;
