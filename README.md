# NurseDoku

A colorful, mobile-first nursing logic game for [Siahverse Nursing](https://siahverse.cc/nursing/). [Play NurseDoku](https://siahverse.cc/nursedoku/).

Place one RN in every row, column, and colored care zone. RNs cannot touch, even diagonally.

## Controls

- Tap a cell to toggle an X.
- Drag across cells to add multiple Xs. RNs are protected. Undo reverses the whole stroke.
- Double-tap to place or remove an RN.
- Keyboard: Enter/Space toggles X; R toggles RN; arrow keys move focus.
- Hints highlight a suggested placement or a mistaken RN.

## Completed roadmap

- [x] Guided eight-shift learning journey; first 4×4 board has a single-cell care zone
- [x] Daily puzzle, seeded by the device’s local calendar date
- [x] Easy 4×4, Medium 6×6, Hard 8×8 practice puzzles
- [x] Connected-region generator with exhaustive uniqueness checks
- [x] Daily streak, total wins, and best completion time
- [x] Hints, undo, reset, automatic completion, next shift
- [x] General, Pediatrics, and Emergency color themes
- [x] Optional original NCLEX-style infection-prevention bonus questions with CDC rationales
- [x] Siahverse nursing hub integration
- [x] Saved progress and themes; timer pauses when the page is hidden

Progress and statistics are saved on this browser/device. Difficulty reflects board size rather than a calibrated solving rating. The bonus bank currently contains three original hand-hygiene questions. Generation uses bounded attempts and a verified starter fallback if a unique board cannot be produced.

## Run locally

No build step or framework. Open index.html or run `python3 -m http.server 8000` and visit http://localhost:8000.

## Validation

Verified all eight learning boards and 30 generated boards for exactly one legal solution, connected zones, requested dimensions, and deterministic seeding. Gesture/state checks cover single tap, double tap, drag interpolation, RN protection, undo, completion, and saved progress. Physical iPhone gesture testing remains useful.

## Content source

[CDC: Clinical Safety — Hand Hygiene for Healthcare Workers](https://www.cdc.gov/clean-hands/hcp/clinical-safety/index.html). Bonus questions are original educational practice items.
