import { GameState } from "../hooks/use-game-manager";
import type { Pokemon } from "../types/pokemon.interface";
import Spinner from "./spinner";

interface Props {
    pokemon: Pokemon | null;
    isLoading: boolean;
    gameState: GameState;
}

const PokemonDisplay = ({ pokemon, isLoading, gameState }: Props) => {
    const showAnswer = gameState !== GameState.Playing;
    const image = pokemon?.image;
    const name = pokemon?.name;

    // Evita el truco de arrastrar la imagen (drag preview) para ver el sprite
    const handleDragStart = (e: React.DragEvent<HTMLImageElement>) => {
        e.preventDefault();
    };

    // Evita menú contextual (guardar imagen / abrir en nueva pestaña, etc.)
    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
    };

    return (
        <div className="card">
            <div className="card-header">
                <h1 className="text-center">
                    {showAnswer ? name?.toUpperCase() : "¿Quién es ese Pokémon?"}
                </h1>
            </div>

            <div className="card-body">
                {isLoading ? (
                    <Spinner />
                ) : (
                    <img
                        src={image || ""}
                        alt=""
                        className="img-fluid mx-auto d-block"
                        draggable={false}
                        onDragStart={handleDragStart}
                        onContextMenu={handleContextMenu}
                        style={{
                            maxHeight: "300px",

                            // Sombra/silueta real del Pokémon
                            filter: showAnswer ? "none" : "brightness(0)",
                            transition: "filter 0.3s ease-in-out",

                            // Anti-selección / anti-arrastre
                            userSelect: "none",
                            WebkitUserSelect: "none",
                            MozUserSelect: "none",
                            msUserSelect: "none",

                            // Importante: NO uses pointerEvents none acá,
                            // porque sino no podrías capturar el contextmenu/dragstart en algunos casos
                            pointerEvents: "auto",
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default PokemonDisplay;
