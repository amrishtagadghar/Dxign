Game of Colors — Project Requirements
Version: 1.0
Date: April 2026
Status: In Development
Phase: Phase 1 — Complementary
Platform: Browser-based (HTML / JS)
Design Ref: Figma — Dark Theme

1. Project Overview
Game of Colors is an interactive, browser-based game system built around the six color harmony types from the Sessions College Color Calculator. Each harmony type maps to a distinct game mechanic, creating a suite of mini-games that teach color theory through hands-on play.
The system is designed as a modular, expandable platform. The current release covers the Complementary color harmony. The remaining five harmony categories will be added in subsequent development phases as their mechanics and prototypes are finalized.
FieldDetailProject NameGame of ColorsConceptColor theory learning through browser-based mini-gamesReference SourceSessions College Color Calculator (sessions.edu/color-calculator)Design SystemDark-themed UI, Figma-referencedImplementationStandalone HTML / JavaScript filesCurrent PhasePhase 1 — Complementary Color GamePlanned PhasesPhases 2–6 (Monochromatic, Analogous, Split Complementary, Triadic, Tetradic)

2. System Architecture
2.1 High-Level Structure
The project is structured as a collection of standalone HTML prototypes — one per harmony type — unified by a shared visual design language. A top-level home screen serves as the entry point and routes players to each harmony game.
LayerDescriptionHome / NavigationLanding screen listing all six harmony categories; routes to individual gamesGame ModuleSelf-contained HTML file per harmony type with embedded JS game logicUI ShellShared layout: top bar (principle + timer), circle display, bottom score barColor EngineHSL/HEX conversion utilities, hue-difference calculation, harmony mathScoring EngineTolerance tiers, streak tracking, bonus calculation, round aggregation
2.2 Shared UI Components
All game modules share the following UI chrome, as defined in the Figma dark-theme reference:

Top bar — Principle breadcrumb (e.g. Color / Complementary), central countdown timer, Home navigation link
Circle display — Split circle: left half shows the given/target color, right half shows the player's active choice
Hex labels — Color codes displayed left and right of the circle in monospace font
Accuracy bar — Post-submission fill bar indicating closeness of the player's pick
Feedback area — Tier label, points earned, and correct color revealed after submission
Bottom bar — Running score, round counter, streak count, best-round stat
Color picker popup — HSL/HEX picker triggered by clicking the right semicircle; closes on outside click


3. Implemented Game — Complementary

Phase 1 — Active

The Complementary game is the first fully implemented prototype. It is a single-player, turn-based accuracy game where the player must identify the 180° hue complement of a randomly generated vivid color.
3.1 Concept & Mechanic
FieldDetailHarmony TypeComplementary — two colors opposite on the color wheel (180° apart)Mechanic ArchetypeAccuracy / Estimation — player picks the complement under time pressureFormat5-round session, one randomly generated target color per roundTime Limit60 seconds per round; auto-submits on expiryPlayer CountSingle player vs. system
3.2 Round Flow

System generates a random vivid color (random hue, saturation 60–85%, lightness 45–60%)
Target color appears in the left semicircle; right semicircle shows a question mark placeholder
Player clicks the right semicircle to open the color picker popup
Player selects their answer color using the HSL/HEX picker
Player clicks Submit — or timer expires, triggering auto-submit
System calculates hue difference between player pick and true complement
Feedback is displayed: tier label, hue deviation in degrees, points earned, correct hex
Player clicks Next to advance; after round 5 the Results screen appears

3.3 Scoring System
Scoring is based on hue accuracy — the angular distance (in degrees) between the player's chosen hue and the true complement hue (target hue + 180°, modulo 360°).
TierHue DeviationBase PointsNotesExcellent≤ 5°100 ptsNear-perfect complement matchGood≤ 15°70 ptsStrong awareness of the opposite hue regionClose≤ 30°40 ptsApproximate; player is in the right quadrantMiss> 30°10 ptsSignificant deviation; consolation points only
3.4 Streak & Bonus System
Consecutive non-miss rounds build a streak. Streak bonuses are applied on top of the base tier score:
Streak LengthBonusCalculation1 (no bonus)—Base score only2 consecutive+10%base × 1.10, rounded3+ consecutive+20%base × 1.20, rounded
A miss resets the streak to zero. The streak badge is shown to the player after any round where streak ≥ 2.
3.5 Hint System
Players may use one hint per round by clicking the Hint button before submitting. The hint reveals the approximate target hue in degrees and costs a flat 5-point deduction from the round score.
FieldDetailCost−5 points from the round score (applied after tier calculation)Information GivenApproximate complement hue in degreesUses per Round1AvailabilityDisabled after submit or after hint is already used
3.6 Timer Rules

Each round starts with 60 seconds on the clock
Timer counts down in real time; display turns red at ≤ 10 seconds
On expiry: if the player has made a pick it is submitted as-is; if no pick was made, the given color is used as the answer (typically resulting in a Miss)
The timer stops immediately on Submit

3.7 Results Screen
After round 5 the game transitions to a Results overlay displaying final score, letter grade, overall accuracy percentage, best single-round score, and maximum streak achieved.
GradeThresholdS≥ 90% of maximum possible scoreA≥ 75%B≥ 60%C≥ 45%D< 45%
Maximum possible score = 5 rounds × 100 pts (Excellent) + streak bonuses.

4. Future Game Categories

Phases 2–6 — Planned
The following five harmony categories are planned for future development phases. Mechanic overviews have been defined and design is in progress. Each will be built as an independent game module following the same UI shell and scoring philosophy established in Phase 1.
Detailed requirements — including full scoring tables, round structure, and interaction specifications — will be authored for each category prior to development and appended to this document as separate sections.

Harmony TypeMechanic ArchetypeBrief DescriptionMonochromaticShade-sorting racePlayer sorts a set of hue-matched swatches from lightest to darkest within a time limitAnalogousNeighbor chain-buildingPlayer extends a color chain by picking the next adjacent hue on the wheelSplit ComplementaryFlank identificationPlayer identifies the two flanking hues of a given color's complement under time pressureTriadicSecret biddingPlayers bid on which of three triadic positions a hidden color occupiesTetradicCollect-and-steal card game4-player (1 human + 3 AI) card game; players collect tetradic sets and steal from opponents

5. UI / UX Design Specification
5.1 Visual Theme
FieldDetailThemeDark — near-black backgrounds (#1A1A1A base)Surface Colors#242424 (panels), #2E2E2E (raised surfaces), #3A3A3A (borders)Accent Color#F5A623 (orange-amber) for scores, CTAs, key labelsSuccess Color#3DDC84 (green) for correct / excellent feedbackError Color#FF6B6B (red) for miss feedback and urgent timerPrimary TypefaceDM Sans — UI labels, body textMonospace TypefaceSpace Mono — hex codes, scores, timerDesign ReferenceFigma — dark theme component library
5.2 Color Picker Interaction

Picker is hidden by default; triggered only by clicking the right semicircle
Appears as a floating popup positioned near the click point
Contains an HSL/HEX color input and live preview on the right semicircle
Cancel button closes without committing; Use button commits the color and closes
Clicking outside the popup closes it without committing
Picker is disabled after submission and between rounds

5.3 Responsive Constraints
The current implementation targets desktop browsers. The game canvas is fixed at 220 × 220 px for the circle display. Mobile support is planned as a future enhancement and is not in scope for Phase 1.

6. Technical Requirements
6.1 Stack
FieldDetailLanguagesHTML5, CSS3, Vanilla JavaScript (ES6+)DependenciesNone — zero external libraries for game logicRenderingHTML Canvas (circle display), DOM (all other UI)Color MathCustom HSL ↔ HEX conversion, hue-difference utilitiesStorageNone in Phase 1 (session-only state)Build SystemNone — single-file deliverablesBrowser SupportModern evergreen browsers (Chrome, Firefox, Safari, Edge)
6.2 Color Engine Functions

hslToHex(h, s, l) — converts HSL values to six-digit hex string
hexToHsl(hex) — converts hex to [h, s, l] array
complementHsl(h, s, l) — returns [(h + 180) % 360, s, l]
hueDiff(a, b) — returns shortest angular distance between two hues (0–180)
randomVividColor() — generates a random perceptually vivid color safe for gameplay

6.3 State Management
Each game module manages its own in-memory state object per session. The state object tracks:

Current round index and total rounds
Given color (hex) and correct answer color (hex + HSL)
Player's selected color
Remaining timer seconds
Hint used flag and submission flag
Running score, streak counter, max streak, best round score, round score history


7. Development Roadmap
PhaseHarmony TypeStatusDeliverable1Complementary✅ CompletePlayable prototype + requirements (this document)2Monochromatic🔲 PlannedMechanic spec + playable prototype3Analogous🔲 PlannedMechanic spec + playable prototype4Split Complementary🔲 PlannedMechanic spec + playable prototype5Triadic🔲 PlannedMechanic spec + playable prototype6Tetradic🔲 PlannedMechanic spec + playable prototype7All Categories🔲 FutureHome screen, unified navigation, cross-game scoring
Requirements for Phases 2–6 will be appended to this document as separate sections before development begins on each phase.

8. Glossary
TermDefinitionColor HarmonyA set of colors that are aesthetically pleasing based on their positions on the color wheelComplementaryTwo colors directly opposite each other on the color wheel (180° apart)HueThe pure color attribute of an HSL value, measured in degrees (0–360°)HSLHue / Saturation / Lightness — the color model used for all game mathHue DeviationThe angular distance between the player's chosen hue and the correct answer hueTierA scoring band (Excellent / Good / Close / Miss) determined by hue deviationStreakA run of consecutive non-Miss rounds within a sessionStreak BonusA percentage increase applied to a round's base score when a streak is activeSplit CircleThe circular UI element showing target (left) and player pick (right) side-by-sideSessions Calculatorsessions.edu/color-calculator — the reference tool for the six harmony types used in this project

Game of Colors — Requirements v1.0 — April 2026
Additional harmony categories will be documented and appended as development progresses.