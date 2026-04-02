01
Overview
A browser-based educational game that teaches design principles through interactive colour challenges. Players are given a randomly assigned Primary colour and must use their design intuition to pick Secondary and Tertiary colours within a time limit. Scoring is based on colour theory relationships using a distance-based algorithm.

02
Game Flow
Player lands on the game screen
A random Primary colour is assigned to the Primary shape (circle)
A 60-second countdown timer begins immediately
Player clicks the Secondary shape (square) — a native colour picker opens
Player selects a colour and confirms
Player clicks the Tertiary shape (triangle) — a native colour picker opens
Player selects a colour and confirms
Player clicks Submit — OR — timer runs out
Score is revealed (total out of 100)
Player can optionally click "View Feedback" to read a one-paragraph explanation
Player clicks "Next Principle" to start a new round with a random principle
03
Scoring System
3.1 Structure
Secondary colour: 50 points maximum
Tertiary colour: 50 points maximum
Total maximum score: 100 points per round
Both Secondary and Tertiary are scored independently using the same algorithm
3.2 Algorithm — Distance-Based Colour Scoring
Scoring is calculated by measuring the hue angle distance between the player's chosen colour and the Primary colour on the HSL colour wheel (0–360 degrees).

Relationship	Ideal Hue Distance	Points (max 50)
Complementary	180°	50
Triadic	120° or 240°	35
Analogous	30° or 330°	20
No match	Any other angle	5
Tolerance Window
±2 degrees from the ideal hue angle. Within tolerance = full points for that relationship. Outside all tolerances = 5 points base score. Uses a tapering curve: full points at exact match, tapering to 0 at the ±2° boundary.
3.3 Scoring Per Principle
Each design principle has its own scoring curve and relationship hierarchy. Phase 1 covers Color only. Future principles will have unique scoring logic defined separately before development begins.

04
Timer
Duration: 60 seconds per round
Timer starts as soon as the round loads
Counts down visibly on screen at all times
At 10 seconds remaining: timer turns red (urgent state)
If timer hits 0 before Submit is clicked: round auto-submits with whatever colours have been chosen
If a slot is unfilled when time runs out: that slot scores 0 points
05
Colour Picker Behaviour
Clicking the Secondary shape opens a native HTML colour picker (no custom UI)
Clicking the Tertiary shape opens a native HTML colour picker
No guidance, hints, or suggestions are shown in or near the colour picker
Players must rely entirely on their own intuition and design knowledge
Players learn correct relationships through the score and feedback after submission
06
Score & Feedback Screen
6.1 Score Reveal
After Submit (or time running out), the total score out of 100 is displayed prominently
Score is shown immediately — no delay or animation required
6.2 Feedback (Optional)
A "View Feedback" button appears alongside the score
When clicked, displays one paragraph of educational feedback
Feedback explains: what colour relationship the player chose for Secondary and Tertiary, why those relationships do or do not work for the active principle, and a brief tip for improvement
Feedback is generated based on the actual hue distances calculated during scoring
6.3 Next Round
A "Next Principle" button is shown after score reveal
Clicking it loads a new round with a randomly selected principle from the available list
No ability to manually choose a specific principle
07
Principles — Phase 1 Scope
Only the Color principle is in scope for Phase 1. The following five principles are planned for the full game:

#	Principle	Status
1	Color	In scope — Phase 1
2	Contrast	Future
3	Hierarchy	Future
4	Balance	Future
5	Emphasis	Future
08
UI Layout
Header Bar (dark background)
Left: Principle label + Principle name (bold)
Centre: Timer label + countdown number
Right: "Next random principle" text button — skips current round, no score awarded
Main Canvas Area
Three shapes displayed horizontally, centred on the canvas
Primary — Circle — shows randomly assigned colour, not clickable
Secondary — Square — clickable, opens colour picker
Tertiary — Triangle — clickable, opens colour picker
Labels above each shape: PRIMARY / SECONDARY / TERTIARY
Footer Bar (dark background)
Left: "About" button
Centre: "Your Score:" label + cumulative score number
Right: "Reset" button — resets score to 0 and starts a new round
09
Technical Requirements
Platform: Web browser — no installations required
Stack: Plain HTML, CSS, JavaScript (no frameworks for Phase 1)
Colour conversion: All scoring uses HSL colour space; hex input from colour picker is converted to HSL internally
Colour picker: Native browser <input type="color"> element
No backend required — all logic runs client-side
File structure: index.html, style.css, game.js
10
Out of Scope — Phase 1
User accounts or login
Persistent leaderboard or score history
Multiplayer
Custom colour palette swatches
Guided hints or colour wheel overlays in the picker
Principles 2–5 (Contrast, Hierarchy, Balance, Emphasis)
Mobile-specific optimisation — desktop-first for Phase 1