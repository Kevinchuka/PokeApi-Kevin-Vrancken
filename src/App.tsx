import { useEffect, useMemo, useState } from "react";
import { useWindowSize } from "react-use";
import PokemonDisplay from "./components/pokemon-display";
import PokemonForm from "./components/pokemon-form";
import PokemonResult from "./components/pokemonResult";
import { GameState, useGameManager } from "./hooks/use-game-manager";
import ReactConfetti from "react-confetti";

const App = () => {
  type Language = "en" | "es";
  type Theme = "light" | "dark";

  const translations = useMemo(
    () => ({
      en: {
        heroEyebrow: "PokeApi Arena",
        heroTitle: "Who's that Pokémon?",
        heroSubtitle:
          "Guess the hidden Pokémon, unlock epic hints, and build your streak. Every round is a new challenge.",
        stats: {
          total: "Rounds",
          correct: "Correct",
          streak: "Streak",
          bestStreak: "Best streak",
        },
        card: {
          tag: "PokeChallenge",
          question: "Who's that Pokémon?",
          hintPlaying: "Toggle hints to reveal extra details without showing the name.",
          hintRevealed: "Great job! You unlocked every Pokémon detail.",
          typeLabel: "Type",
          heightLabel: "Height",
          weightLabel: "Weight",
          genShort: "Gen",
          imageAlt: (name?: string) => (name ? `Artwork of ${name}` : "Pokémon silhouette"),
        },
        form: {
          placeholder: "Type the Pokémon name...",
          submit: "Guess!",
          showHints: "Show hints",
          hideHints: "Hide hints",
          surrender: "Give up",
        },
        result: {
          correctTitle: "Correct!",
          wrongTitle: "Incorrect!",
          correctMessage: "You caught the answer and boosted your streak.",
          wrongMessage: (name?: string) => `It was ${name ?? "that Pokémon"}. Keep trying!`,
          newRound: "New round",
        },
        controls: {
          language: "Language",
          theme: "Theme",
          light: "Light",
          dark: "Dark",
        },
      },
      es: {
        heroEyebrow: "PokeApi Arena",
        heroTitle: "¿Quién es ese Pokémon?",
        heroSubtitle:
          "Adivina el Pokémon oculto, desbloquea pistas épicas y mantén la racha. Cada ronda es un nuevo desafío.",
        stats: {
          total: "Intentos",
          correct: "Aciertos",
          streak: "Racha",
          bestStreak: "Mejor racha",
        },
        card: {
          tag: "PokéDesafío",
          question: "¿Quién es ese Pokémon?",
          hintPlaying: "Activa las pistas para revelar detalles sin mostrar el nombre.",
          hintRevealed: "¡Bien jugado! Desbloqueaste todos los detalles del Pokémon.",
          typeLabel: "Tipo",
          heightLabel: "Altura",
          weightLabel: "Peso",
          genShort: "Gen",
          imageAlt: (name?: string) => (name ? `Imagen de ${name}` : "Silueta del Pokémon"),
        },
        form: {
          placeholder: "Escribe el nombre del Pokémon...",
          submit: "¡Adivinar!",
          showHints: "Mostrar pistas",
          hideHints: "Ocultar pistas",
          surrender: "Rendirse",
        },
        result: {
          correctTitle: "¡Correcto!",
          wrongTitle: "¡Incorrecto!",
          correctMessage: "Has atrapado la respuesta y subes tu racha.",
          wrongMessage: (name?: string) => `Era ${name ?? "ese Pokémon"}. ¡No te rindas!`,
          newRound: "Nueva ronda",
        },
        controls: {
          language: "Idioma",
          theme: "Tema",
          light: "Claro",
          dark: "Oscuro",
        },
      },
    }),
    []
  );

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
  const [language, setLanguage] = useState<Language>("en");
  const [theme, setTheme] = useState<Theme>("light");
  const t = translations[language];

  useEffect(() => {
    setShowHints(false);
  }, [pokemon?.id]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

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
            <span className="hero__eyebrow">{t.heroEyebrow}</span>
            <h1 className="hero__title">{t.heroTitle}</h1>
            <p className="hero__subtitle">{t.heroSubtitle}</p>
          </div>
          <div className="hero__controls">
            <div className="toggle-group" aria-label={t.controls.language}>
              <button
                type="button"
                className={`toggle-button ${language === "en" ? "is-active" : ""}`}
                onClick={() => setLanguage("en")}
                aria-pressed={language === "en"}
              >
                EN
              </button>
              <button
                type="button"
                className={`toggle-button ${language === "es" ? "is-active" : ""}`}
                onClick={() => setLanguage("es")}
                aria-pressed={language === "es"}
              >
                ES
              </button>
            </div>
            <div className="toggle-group" aria-label={t.controls.theme}>
              <button
                type="button"
                className={`toggle-button ${theme === "light" ? "is-active" : ""}`}
                onClick={() => setTheme("light")}
                aria-pressed={theme === "light"}
              >
                {t.controls.light}
              </button>
              <button
                type="button"
                className={`toggle-button ${theme === "dark" ? "is-active" : ""}`}
                onClick={() => setTheme("dark")}
                aria-pressed={theme === "dark"}
              >
                {t.controls.dark}
              </button>
            </div>
          </div>
          <div className="hero__stats">
            <div className="stat-card">
              <p className="stat-card__label">{t.stats.total}</p>
              <p className="stat-card__value">{stats.total}</p>
            </div>
            <div className="stat-card">
              <p className="stat-card__label">{t.stats.correct}</p>
              <p className="stat-card__value">{stats.correct}</p>
            </div>
            <div className="stat-card">
              <p className="stat-card__label">{t.stats.streak}</p>
              <p className="stat-card__value">{stats.streak}</p>
            </div>
            <div className="stat-card">
              <p className="stat-card__label">{t.stats.bestStreak}</p>
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
              labels={t.card}
            />
            <PokemonForm
              gameState={gameState}
              handlePokemonNameSubmit={handlePokemonNameSubmit}
              revealPokemon={revealPokemon}
              showHints={showHints}
              onToggleHints={() => setShowHints((prev) => !prev)}
              labels={t.form}
            />
            <PokemonResult
              loadNewPokemon={loadNewPokemon}
              gameState={gameState}
              pokemon={pokemon}
              labels={t.result}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
