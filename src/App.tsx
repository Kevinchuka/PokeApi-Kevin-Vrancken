import { useEffect, useState } from "react";
import { useWindowSize } from "react-use";
import PokemonDisplay from "./components/pokemon-display";
import PokemonForm from "./components/pokemon-form";
import PokemonResult from "./components/pokemonResult";
import { GameState, useGameManager } from "./hooks/use-game-manager";
import ReactConfetti from "react-confetti";

const App = () => {
  const {
    loadNewPokemon,
    pokemon,
    error,
    isLoading,
    gameState,
    handlePokemonNameSubmit,
    revealPokemon,
    stats,
  } = useGameManager();
  const { width, height } = useWindowSize();
  const [showHints, setShowHints] = useState(false);

  useEffect(() => {
    setShowHints(false);
  }, [pokemon?.id]);

  if (error) {
    return <div className="alert alert-danger text-center">Error: {error}</div>;
  }

  return (
    <div className="app-shell">
      <div className="ambient-orb orb-1" />
      <div className="ambient-orb orb-2" />
      <div className="ambient-orb orb-3" />

      {gameState === GameState.Correct && (
        <ReactConfetti width={width} height={height} numberOfPieces={300} recycle={false} />
      )}

      <div className="container my-5">
        <header className="hero mb-4">
          <div className="hero__content">
            <span className="hero__eyebrow">PokeApi Arena</span>
            <h1 className="hero__title">¿Quién es ese Pokémon?</h1>
            <p className="hero__subtitle">
              Adivina el Pokémon oculto, desbloquea pistas épicas y mantén la racha. Cada ronda es
              un nuevo desafío.
            </p>
          </div>
          <div className="hero__stats">
            <div className="stat-card">
              <p className="stat-card__label">Intentos</p>
              <p className="stat-card__value">{stats.total}</p>
            </div>
            <div className="stat-card">
              <p className="stat-card__label">Aciertos</p>
              <p className="stat-card__value">{stats.correct}</p>
            </div>
            <div className="stat-card">
              <p className="stat-card__label">Racha</p>
              <p className="stat-card__value">{stats.streak}</p>
            </div>
            <div className="stat-card">
              <p className="stat-card__label">Mejor racha</p>
              <p className="stat-card__value">{stats.bestStreak}</p>
            </div>
          </div>
        </header>

        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            <PokemonDisplay
              pokemon={pokemon}
              isLoading={isLoading}
              gameState={gameState}
              showHints={showHints}
            />
            <PokemonForm
              gameState={gameState}
              handlePokemonNameSubmit={handlePokemonNameSubmit}
              revealPokemon={revealPokemon}
              showHints={showHints}
              onToggleHints={() => setShowHints((prev) => !prev)}
            />
            <PokemonResult loadNewPokemon={loadNewPokemon} gameState={gameState} pokemon={pokemon} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
