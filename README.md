# 🎮 ¿Quién es ese Pokémon? — Proyecto React + TypeScript

> Una app web tipo juego donde se muestra la silueta de un Pokémon aleatorio y el usuario debe adivinar su nombre.  
> Este proyecto fue construido como parte de un curso, con foco en practicar **arquitectura de componentes**, **hooks personalizados**, **consumo de API externa**, **manejo de estados de UI** y **buenas bases de TypeScript**.

---

## 1) Resumen del proyecto

Este proyecto implementa una versión simple y entretenida del clásico “¿Quién es ese Pokémon?”.

La experiencia del usuario es:

1. Se carga un Pokémon aleatorio desde [PokeAPI](https://pokeapi.co/).
2. Se muestra su imagen en modo **silueta** (oculta con `brightness(0)`).
3. El usuario escribe un nombre y presiona **Jugar**.
4. Si acierta:
   - se muestra el nombre real,
   - aparece una alerta de éxito,
   - se dispara una animación de confeti.
5. Si falla:
   - se revela igualmente el nombre,
   - aparece alerta de error,
   - puede volver a intentar con otro Pokémon.

Aunque es un proyecto de curso, está planteado con decisiones que apuntan a buenas prácticas de trabajo real: separación de responsabilidades, tipado, control de estados de carga/error y lógica encapsulada en servicios y hooks.

---

## 2) Objetivos técnicos y de aprendizaje

Este trabajo buscó practicar y demostrar:

- **React moderno con funciones y hooks**.
- **TypeScript** para tipado estático y contratos de datos.
- **Custom hook (`useGameManager`)** para centralizar la lógica del juego.
- **Arquitectura desacoplada** entre UI (componentes), negocio (hook) e integración (servicio API).
- **Integración HTTP con API pública** (`fetch` hacia PokeAPI).
- **Manejo explícito de estados**: `loading`, `error`, `playing`, `correct`, `wrong`.
- **Normalización de strings** para validar respuestas de forma robusta (tildes, mayúsculas, caracteres especiales).
- **UI rápida con Bootstrap** + iconos.

---

## 3) Stack utilizado

### Frontend
- **React 19**
- **TypeScript 5.9**
- **Vite 7** (bundler + dev server)

### UI / UX
- **Bootstrap 5**
- **Bootstrap Icons**
- **react-confetti** (feedback visual al acertar)

### Utilidades
- **react-use** (`useWindowSize` para adaptar confeti al viewport)

### Calidad de código
- **ESLint 9** + configuración para TypeScript y hooks

---

## 4) Arquitectura del proyecto (visión general)

La estructura sigue una separación simple pero efectiva:

- `src/components/` → componentes de presentación (UI)
- `src/hooks/` → lógica de estado del juego
- `src/services/` → acceso a APIs y reglas relacionadas
- `src/types/` → contratos/interfaces TypeScript
- `src/lib/` → utilidades puras reutilizables

### Flujo principal de datos

1. `App.tsx` consume `useGameManager()`.
2. El hook carga un Pokémon vía `pokemonService.getRandomPokemon()`.
3. `App` distribuye estado/acciones a:
   - `PokemonDisplay` (mostrar silueta/resultado)
   - `PokemonForm` (captura de respuesta)
   - `PokemonResult` (feedback + botón “volver a jugar”)
4. Al enviar una respuesta, el hook valida con `pokemonService.isPokemonNameValid()`.
5. La UI reacciona según `gameState`.

---

## 5) Estructura de archivos explicada uno por uno

### `src/main.tsx`
Punto de entrada de React:
- importa estilos globales y Bootstrap,
- monta `<App />` dentro de `#root`,
- usa `StrictMode` para buenas prácticas en desarrollo.

### `src/App.tsx`
Componente raíz y orquestador de la pantalla:
- obtiene estado/acciones del hook `useGameManager`,
- muestra error global si ocurre,
- renderiza confeti cuando `gameState === correct`,
- compone los tres bloques principales de la interfaz.

### `src/hooks/use-game-manager.ts`
Corazón de la lógica del juego:
- maneja estados: `pokemon`, `isLoading`, `error`, `gameState`,
- expone `loadNewPokemon()` y `handlePokemonNameSubmit()`,
- dispara carga inicial con `useEffect`,
- encapsula la validación de respuesta para mantener componentes livianos.

**Decisión clave:** usar un custom hook evita duplicar lógica y facilita escalar el juego (por ejemplo: puntaje, rondas, timer, historial).

### `src/services/pokemon.service.ts`
Capa de servicio para PokeAPI y validación:

- `getRandomPokemon()`:
  - genera un ID aleatorio entre 1 y 1118,
  - consulta `https://pokeapi.co/api/v2/pokemon/{id}`,
  - reintenta hasta 5 veces para evitar IDs problemáticos,
  - devuelve un objeto simplificado `{ id, name, image }`.

- `normalizePokemonName()`:
  - pasa a minúscula,
  - elimina espacios extremos,
  - remueve diacríticos,
  - remueve símbolos no alfanuméricos.

- `isPokemonNameValid()`:
  - normaliza nombre real y entrada de usuario,
  - compara ambas versiones limpias.

**Por qué está así:** separar esta lógica permite testear reglas de validación de forma aislada y no acoplarla a React.

### `src/components/pokemon-display.tsx`
Componente visual del Pokémon:
- muestra título con nombre oculto o revelado,
- usa `Spinner` mientras carga,
- aplica `filter: brightness(0)` para silueta,
- bloquea drag y menú contextual para evitar “spoilers” simples.

### `src/components/pokemon-form.tsx`
Formulario de respuesta:
- controla input local (`inputValue`),
- evita enviar vacío,
- desactiva input/botón cuando la ronda ya terminó,
- envía el nombre normalizado al hook.

### `src/components/pokemonResult.tsx`
Feedback de ronda:
- no renderiza nada en estado `playing`,
- muestra alerta success/danger según acierto,
- botón para cargar nueva ronda.

### `src/components/spinner.tsx`
Componente pequeño y reutilizable para carga visual.

### `src/types/pokemon.interface.ts`
Define el contrato `Pokemon` usado en la app para tipado consistente.

### `src/lib/random-number.ts`
Utilidad pura para generar enteros inclusivos en un rango `[min, max]`.

### `src/index.css`
Archivo global (actualmente mínimo). Queda listo para estilos custom si el proyecto crece.

### Configuración del proyecto
- `vite.config.ts` → plugin de React para Vite.
- `eslint.config.js` → reglas base JS/TS + hooks + refresh.
- `tsconfig*.json` → configuración de TypeScript.
- `index.html` → shell HTML con título del juego.

---

## 6) Decisiones de diseño (cómo y por qué se hizo así)

### 1) Estado del juego como enum-like (`GameState`)
Se definieron estados explícitos (`playing`, `correct`, `wrong`) para evitar “ifs mágicos” y hacer el flujo predecible.

### 2) Hook centralizado
Toda la lógica del juego vive en `useGameManager` para que `App` solo coordine y los componentes se mantengan presentacionales.

### 3) Servicio externo desacoplado
La interacción con PokeAPI y validación de nombres está en `pokemonService`. Esto favorece mantenimiento y pruebas futuras.

### 4) Reintentos ante fallos
PokeAPI puede devolver 404 para ciertos IDs. Se decidió reintentar automáticamente hasta 5 veces para mejorar robustez sin dañar UX.

### 5) Normalización fuerte de texto
Los nombres Pokémon pueden incluir guiones, variaciones y acentos. Normalizar reduce falsos negativos y hace el juego más justo.

### 6) UX simple pero efectiva
Bootstrap permite una UI limpia y responsive en poco tiempo (apropiado para proyecto académico con foco en lógica).

### 7) Feedback inmediato
Confeti + alertas ayudan a reforzar la experiencia y cerrar el ciclo de interacción del usuario.

---

## 7) Cómo ejecutar el proyecto

### Prerrequisitos
- Node.js 18+ (recomendado 20+)
- npm

### Instalación
```bash
npm install
```

### Desarrollo
```bash
npm run dev
```
Abre la URL que muestre Vite (normalmente `http://localhost:5173`).

### Build de producción
```bash
npm run build
```

### Previsualizar build
```bash
npm run preview
```

### Lint
```bash
npm run lint
```

---

## 8) Qué se podría mejorar (roadmap realista)

Si este proyecto evolucionara más allá del curso, los siguientes pasos serían de alto impacto:

1. **Testing**
   - unit tests para `pokemonService` y `random-number`,
   - tests de integración de flujo con React Testing Library.

2. **Accesibilidad (a11y)**
   - mejorar `alt` dinámico de la imagen,
   - revisión de labels y mensajes para lectores de pantalla.

3. **Internacionalización (i18n)**
   - soporte ES/EN por archivos de traducción.

4. **Sistema de puntaje y progreso**
   - guardar aciertos/errores por sesión,
   - ranking local con `localStorage`.

5. **Mejora de anti-spoiler**
   - backend/proxy o estrategias de ofuscación más fuertes (si fuera requisito estricto).

6. **Manejo avanzado de errores**
   - reintentos con backoff,
   - mensajes más amigables según tipo de error (network/API).

---

## 9) Enfoque profesional del proyecto (sin humo)

Este repositorio no busca venderse como un “producto enterprise terminado”, sino mostrar algo más valioso para etapa de aprendizaje: **criterio técnico**.

Lo que sí demuestra:
- capacidad para dividir problemas en capas,
- control de estado en React con TypeScript,
- integración de APIs reales,
- atención a detalles de UX y validación,
- código legible y fácil de extender.

En un contexto freelance (Upwork o similar), este tipo de base permite arrancar MVPs rápido y después iterar con features más serias (auth, persistencia, analytics, tests, CI/CD).

---

## 10) Créditos

- API: [PokeAPI](https://pokeapi.co/)
- Framework: [React](https://react.dev/)
- Bundler: [Vite](https://vite.dev/)
- UI: [Bootstrap](https://getbootstrap.com/)

Proyecto desarrollado como práctica de curso, con intención de aplicar buenas prácticas desde una escala pequeña.
