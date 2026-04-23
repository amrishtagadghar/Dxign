# Initial Requirements

## 1. Overview

Dxign is a browser-based educational game that teaches design principles through interactive color challenges. In each round, the player is given a randomly assigned primary color and must choose secondary and tertiary colors within a time limit. The game scores those choices using color theory relationships derived from hue distance.

## 2. Phase 1 Goal

Phase 1 is focused on a single playable loop for the `Color` principle:

- assign a random primary color
- let the player choose two supporting colors
- score the result out of 100
- optionally explain the result with short educational feedback
- let the player move into the next round quickly

## 3. Core Game Flow

1. The player lands on the game screen.
2. The game assigns a random primary color to the primary shape.
3. A 60-second countdown timer starts immediately.
4. The player clicks the secondary shape and selects a color using the native browser color picker.
5. The player clicks the tertiary shape and selects a color using the native browser color picker.
6. The player clicks `Submit`, or the timer reaches zero.
7. The game calculates a round score out of 100.
8. The player may click `View Feedback` to read a short explanation of the result.
9. The player may click `Next Principle` to begin a new round with another randomly selected principle.

## 4. Game Rules

### 4.1 Round Structure

- Each round contains one primary color, one secondary color choice, and one tertiary color choice.
- The primary color is system-generated.
- The secondary and tertiary colors are chosen by the player.
- The player can submit before the timer ends.
- If the timer expires, the round auto-submits.

### 4.2 Unfilled Slots

- If the player has not chosen a secondary color when the round is submitted, that slot receives `0` points.
- If the player has not chosen a tertiary color when the round is submitted, that slot receives `0` points.

### 4.3 Skipping

- The player can skip the current round using `Next random principle`.
- Skipping a round awards no points for that round.
- Skipping immediately loads a fresh round.

## 5. Scoring System

### 5.1 Score Structure

- Secondary color: up to `50` points
- Tertiary color: up to `50` points
- Total round score: up to `100` points
- Secondary and tertiary choices are scored independently using the same algorithm

### 5.2 Scoring Input

- Scoring is based on hue angle distance in HSL color space.
- The primary color and the player's selected color are both converted to HSL.
- Only hue is used for Phase 1 scoring.
- Hue is measured on a circular scale from `0` to `360` degrees.

### 5.3 Color Relationships for Phase 1

| Relationship | Ideal Hue Distance | Max Points |
| --- | --- | --- |
| Complementary | 180 degrees | 50 |
| Triadic | 120 or 240 degrees | 35 |
| Analogous | 30 or 330 degrees | 20 |
| No match | any other distance | 5 |

### 5.4 Tolerance Rule

- Each target relationship has a tolerance window of plus or minus `2` degrees around its ideal hue distance.
- A color that lands exactly on the ideal distance receives the full point value for that relationship.
- A color inside the tolerance window receives a tapered score between the full point value and `5`.
- A color outside every tolerance window receives the `No match` score of `5`.

### 5.5 Tapering Rule

For any matched relationship inside its tolerance window:

- exact match = full relationship score
- score decreases linearly as the hue distance moves away from the ideal value
- score reaches `5` at the edge of the tolerance window

This rule keeps scoring continuous while preserving `5` as the minimum score for any filled color choice.

### 5.6 Principle-Specific Scoring

- Phase 1 includes only the `Color` principle.
- Future principles may use different scoring logic, weights, and feedback rules.
- Those rules are out of scope until they are separately defined.

## 6. Timer

- Round duration is `60` seconds.
- The timer starts as soon as the round loads.
- The timer is always visible during the round.
- At `10` seconds remaining, the timer enters an urgent visual state.
- If the timer reaches `0`, the game auto-submits the current round.

## 7. Color Picker Behavior

- The secondary shape opens a native HTML color picker.
- The tertiary shape opens a native HTML color picker.
- No custom color picker UI is required in Phase 1.
- No hints, overlays, swatches, or relationship guides are shown while picking colors.
- The learning moment happens after submission through score and feedback.

## 8. Score and Feedback Screen

### 8.1 Score Reveal

- After submission, the total score out of `100` is displayed prominently.
- The score appears immediately after scoring is complete.

### 8.2 Feedback

- A `View Feedback` button is shown after scoring.
- Feedback is optional and hidden until requested by the player.
- When opened, feedback is displayed as one short paragraph.
- Feedback should explain:
  - which relationship the secondary color most closely matched
  - which relationship the tertiary color most closely matched
  - why those choices do or do not support the active principle
  - one brief suggestion for improvement

### 8.3 Next Round

- A `Next Principle` button is shown after score reveal.
- Clicking it loads a new round from the available principle pool.
- In Phase 1, the available pool contains only `Color`, so the next round still uses the Color principle even though the system should keep the flow compatible with future principles.

## 9. Phase 1 Principle Scope

Only `Color` is in scope for Phase 1.

| Principle | Status |
| --- | --- |
| Color | In scope |
| Contrast | Future |
| Hierarchy | Future |
| Balance | Future |
| Emphasis | Future |

## 10. UI Layout

### 10.1 Header

- Dark header bar
- Left side: principle label and principle name
- Center: timer label and countdown value
- Right side: `Next random principle` text button

### 10.2 Main Play Area

- Three shapes are displayed horizontally and centered
- Labels appear above each shape: `PRIMARY`, `SECONDARY`, `TERTIARY`
- Primary shape:
  - circle
  - displays the random primary color
  - not clickable
- Secondary shape:
  - square
  - clickable
  - opens the native color picker
- Tertiary shape:
  - triangle
  - clickable
  - opens the native color picker

### 10.3 Footer

- Dark footer bar
- Left side: `About` button
- Center: `Your Score` label and cumulative score number
- Right side: `Reset` button

### 10.4 Reset Behavior

- `Reset` sets the cumulative score back to `0`.
- `Reset` starts a new round immediately.

## 11. Technical Requirements

- Platform: web browser
- Installation: none required
- Stack: plain HTML, CSS, and JavaScript
- Frameworks: not allowed in Phase 1
- Color input: native `<input type="color">`
- Color conversion: convert hex input to HSL before scoring
- Runtime: fully client-side
- Backend: none required
- Initial file structure:
  - `index.html`
  - `style.css`
  - `game.js`

## 12. Out of Scope for Phase 1

- user accounts or login
- persistent leaderboard or score history
- multiplayer
- custom palette swatches
- guided hints or color-wheel overlays in the picker
- principles other than `Color`
- mobile-specific optimization beyond basic browser usability
