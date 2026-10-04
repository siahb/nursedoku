# NurseDoku

A colorful, mobile-first nursing logic game for [Siahverse Nursing](https://siahverse.cc/nursing/). [Play NurseDoku](https://siahverse.cc/nursedoku/).

Place one RN in every row, column, and colored care zone. RNs cannot touch, even diagonally.

## Controls

- Tap a cell to toggle an X.
- Swipe from an empty cell to add multiple Xs, or from an X to erase multiple Xs. RNs are protected. Undo reverses the whole stroke.
- Double-tap to place or remove an RN.
- Keyboard: Enter/Space toggles X; R toggles RN; arrow keys move focus.
- Hints highlight a suggested placement or a mistaken RN.

Start from the main menu; loading the app leaves the timer paused. The changelog appears once per update. A solved board celebrates briefly (650 ms) before opening the required nursing question. You can change your answer before confirming it, then share the result or continue.

## Completed roadmap

- [x] Guided 56-shift learning journey; first 4×4 board has a single-cell care zone
- [x] Daily puzzle, seeded by the device’s local calendar date
- [x] 144 unique 6×6 and 10×10 practice puzzles with Easy/Medium/Hard ratings based on logical deductions
- [x] Connected-region generator with exhaustive uniqueness checks
- [x] Daily streak, total wins, and best completion time
- [x] Hints, undo, reset, automatic completion, next shift
- [x] General, Pediatrics, and Emergency color themes
- [x] Required original NCLEX question with answer selection, confirmation, rationale, and linked clinical sources
- [x] Siahverse nursing hub integration
- [x] Synthesized tap, RN, hint, undo, and win sounds with a saved mute setting
- [x] X pop, RN bounce and sparkle, care-zone feedback, win confetti; reduced-motion support
- [x] Saved progress and themes; timer pauses when the page is hidden

Progress and statistics are saved on this browser/device. Difficulty uses an automated deduction heuristic; human calibration remains future work. The NCLEX question bank currently contains 118 original questions. Generation uses bounded attempts and a verified starter fallback if a unique board cannot be produced.

## Run locally

No build step or framework. Open index.html or run `python3 -m http.server 8000` and visit http://localhost:8000.

## Validation

Verified the original eight learning boards, all 72 rated practice boards, and 30 generated boards for exactly one legal solution, connected zones, requested dimensions, and deterministic seeding. Gesture/state checks cover single tap, double tap, drag interpolation, RN protection, undo, completion, and saved progress. Physical iPhone gesture testing remains useful.

## Content source

[CDC: Clinical Safety — Hand Hygiene for Healthcare Workers](https://www.cdc.gov/clean-hands/hcp/clinical-safety/index.html). Bonus questions are original educational practice items.

## Current roadmap

See [ROADMAP.md](ROADMAP.md) for delivered Phase 1 features and the next phase. General/Pediatrics/Emergency are color palettes, not specialty gameplay modes. Offline caching is scoped to NurseDoku.

Current rules: three incorrect RN placements end a shift. Invalid placements are rejected; Undo does not restore strikes. Training advances from Easy through Medium to Hard. The palette selector only changes colors. Supabase private cloud saves and account UI are implemented. Custom SMTP is configured, but public registration remains disabled while Resend DKIM verification is pending. The September 30 signup test reached Resend and was rejected for an unverified domain; see accounts/README.md for checked activation status.

Hints now explain direct deductions or confined-zone elimination from placed RNs, independently of player X marks. If those techniques cannot explain a move, the hint explicitly says it is a solution reveal. The daily archive includes a month calendar with completed-day markers and blocks future dates and dates before launch.

The required post-shift question bank contains 118 original NCLEX single-answer items covering prioritization, adult health, pediatrics, medication safety, mental health, oncology, infection prevention, and dosage calculations. Clinical items link to authoritative government health sources; calculations explain the order supplied in the question. They are independently authored practice items. The old infection-prevention bank used a different version. Append-only NCLEX bank expansions preserve saved answers and history.

### Question history

Questions have permanent IDs. Each progress owner stores `stats.questionHistory` (`seen`, `missed`, or `correct`), included in the cloud progress snapshot. Unseen items are offered first, then previously missed items. Correct items are retired. An exhausted bank allows continued play with a caught-up message. Reloading the same shift preserves its selected question and answer. Current submitted answers migrate into history; older answers without recorded correctness cannot be reconstructed. Guest history is device-local and resets when site storage is cleared.

The scheduled bank expansion targets up to 100 original source-checked questions per day, stopping at 5,000. Preserve existing IDs and append questions; do not reorder old answer choices or change their correct indices.

## Daily nursing tips

Main-menu daily nursing tip: seven concise tips with NIH source links, deterministic local-date rotation, dismissal for the current day, and no artificial loading delay. Dismissal is a device preference and persists across reloads.

### Version 1.1.0 — September 29, 2026

All 72 new 10×10 practice boards have exactly one single-cell zone, ten distinct colors in every palette, connected regions, and exactly one solution. No region exceeds 40 cells. Logical difficulty is rechecked independently. Existing saved custom boards remain resumable; choose a new practice shift to use the revised bank.

Single taps place/erase X immediately; a second tap on the same square within 360 ms replaces that first tap with an RN action, with one undo entry. Zone-clear feedback requires a correct RN plus Xs in every other zone square, honors mute/reduced motion, and is suppressed on saved-board restoration.

The menu separates Learn/Daily from custom practice controls. One nursing hub link and one What's new control remain. The bottom footer shows the release date and version. Results sharing includes Facebook and an Instagram image option; file sharing uses the native share sheet when supported, otherwise downloads an image to upload manually. It never posts automatically.

After changing any source file or question/board bank, run `node scripts/build-assets.cjs` from this repository and publish index.html, sw.js, and the generated assets/ files together with the source. Keep old content-hashed assets for existing offline clients. Never overwrite the bytes at an existing hashed asset path.


## Question expansion — September 30, 2026

Added 22 original questions (18 clinical, four calculation), bringing the bank to 34. Topics include maternal/newborn care, renal and endocrine health, nutrition, medication safety, mental health, oncology, seizure safety, and pulmonary embolism. Existing IDs, order, answer choices, correct indices, and QUIZ_VERSION remain unchanged. Source checks and the review scope are recorded in [the batch review](content/question-reviews/2026-09-30.json). Clinical items were checked against current accessible NIH, FDA, and CDC pages; this is source verification, not independent clinician review or official NCLEX content. Four calculation answers were independently checked using exact rational arithmetic.

Validation: `node tests/check-questions.cjs`, `node tests/check-state.cjs`, `node tests/check-accounts.cjs`, and `node tests/check-offline.cjs`. The question checks preserve the original 12-item fixture, validate stable IDs/answer structure, and enforce the 5,000 cap. State checks exercise confirmation for every item and verify that append-only growth preserves existing submitted answers and cloud history while offering unseen items ahead of missed ones.

## Question expansion — October 1, 2026

Added 20 original questions (15 clinical, five calculation), bringing the bank to 54. Topics include infection precautions, CAUTI prevention, diabetes foot care, asthma medications, GERD, cirrhosis, postpartum warning signs, pediatric milestones, antibiotic stewardship, warfarin safety, stroke response, anemia, CKD nutrition, sickle cell disease, and dosage calculations. Existing questions, IDs, answer order, correct indices, and `QUIZ_VERSION` remain unchanged. Source checks and review scope are recorded in [the October 1 batch review](content/question-reviews/2026-10-01.json).

The validation fixture now preserves all 34 questions published through September 30. Review tests cover both dated batches, verify source domains and audit entries, confirm calculation keys, and retain the 5,000-question cap. Five new calculation answers were independently checked before publication.

## Question expansion — October 2, 2026

Added 20 original questions (15 clinical, five calculation), bringing the bank to 74. Topics include sepsis, pregnancy immunization, safe infant sleep, pediatric dehydration, anaphylaxis, heart attack symptoms, hypertension treatment, folic acid, lithium toxicity, disseminated shingles, sickle cell emergencies, perinatal mental health, insulin storage, peripheral IV phlebitis, acute urinary retention, and dosage calculations. Existing questions, permanent IDs, answer order, correct indices, and `QUIZ_VERSION` remain unchanged. Source checks and review scope are recorded in [the October 2 batch review](content/question-reviews/2026-10-02.json).

The validation suite now locks the complete 54-question bank published through October 1 with a SHA-256 fixture, audits all three dated batches, validates approved source domains, and independently checks the five new calculation keys.

## Dark mode

Use the moon/sun icon in the header to switch appearance. NurseDoku follows the device setting until you choose a mode, then remembers your preference on this browser. Care-zone colors and progress stay unchanged.

The How to play tutorial has five numbered steps, a solved 4×4 example, and separate RN/X practice squares. It explains rows, columns, care zones, diagonal spacing, and the required NCLEX question without assuming prior puzzle experience. Tutorial practice does not change saved progress or strikes.

Select Next tip on the nursing tip card to browse the existing sourced tips. Browsing wraps at the end and resets to the daily tip on a new day or page reload.

Shift 000 is a guided 4×4 tutorial before the first unsolved training shift for new players. Sixteen coached moves explain RN placement and Xs for rows, columns, and touching corners. It has no timer, strikes, quiz, or counted win. Completion is stored per progress owner in stats and included in cloud snapshots. Existing shift numbers and completion IDs stay unchanged. Replay it from the menu. Closing midway leaves the current shift intact and restarts the lesson next time.

Post-shift flow: choose 1–10 NCLEX questions in the menu (default 1). The selected set is saved with the solved shift and must be confirmed before another puzzle; closing the results returns to the menu without skipping questions. Read each rationale, then select Next question. If fewer eligible unseen/missed questions remain, only those are offered. Native radio choices remain editable until confirmation. Three EKG hearts show remaining strikes. The completed-board pause is 650 ms.

Sync now reports its result inside Account. It uploads pending device changes, checks and restores newer cloud progress when the device is clean, and confirms when saves already match. Offline and conflicting saves explain the next action; conflicting active puzzles require a choice. The button shows Syncing while a request is running.

Account save choices and guest import require confirmation before replacing an active puzzle. Sign-out also confirms its effect on shared Siahverse sessions. During conflicts, guest import is disabled and Resolve save conflict focuses the available choices. Account feedback appears above the controls.

Tutorial interaction: an animated pointing hand demonstrates one tap for X and two taps for RN on the highlighted square. Shift 000 highlights the RN behind an exclusion and celebrates each correct move; both tutorials show progress meters. How to play practice steps require the learner to make the move before continuing. Reduced motion keeps a stationary hand and outline; keyboard controls and harmless practice remain available.

How to play keeps Back/Next outside the scrolling lesson. Compact phone spacing and board sizing leave navigation visible; short screens and larger text can scroll the lesson separately.

Shift 000 uses a compact board and a separately scrolling lesson, keeping Continue to training visible on short phone screens.

## Question expansion — October 3, 2026

Added 24 original questions (20 clinical, four calculation), bringing the bank to 98. New objectives cover COPD nutrition and oxygen safety, osteoporosis fall prevention, rheumatoid arthritis, gout, lupus, hyperthyroidism, antithyroid adverse effects, adrenal replacement, sick-day diabetes monitoring, gestational diabetes records, ectopic pregnancy warning signs, newborn vitamin K, infant pertussis, ADHD support, anorexia complications, OCD, serotonin syndrome, oral mucositis, and four distinct nursing calculations. Existing question IDs, order, answer choices, correct indices, and `QUIZ_VERSION` remain unchanged.

Clinical answers and rationales were checked against accessible NIH, CDC, and FDA sources on October 3, 2026; the [batch review](content/question-reviews/2026-10-03.json) records each learning objective and supporting source fact. This is author source verification, not independent clinician review or official exam content. Urine output by weight, recorded fluid balance, tiered pediatric daily volume using a supplied formula, and infusion completion time were separately verified using Python rational arithmetic and JavaScript.

Question validation locks all 74 previously published items and audits every dated batch. State and account checks retain unseen-first selection, retirement of correctly answered questions, missed-question review, confirmation, and saved/cloud history. The immutable asset build and offline checks are required before publishing source, index.html, sw.js, and assets together.

## Question expansion — October 4, 2026

Added 20 original questions (16 clinical, four calculation), bringing the bank to 118. New objectives cover CPAP teaching, deep vein thrombosis cues, acute limb ischemia, kidney infection, pancreatitis and constipation warning signs, MMR in pregnancy, infant RSV, meningococcal disease, 18-month development, lymphedema, treatment-related neuropathy, PTSD psychotherapy, medicine disposal, C. difficile, cancer-treatment nausea, and four new calculations. Existing question IDs, order, answer choices, correct indices, and `QUIZ_VERSION` remain unchanged.

Clinical answers and rationales were checked against current NHLBI, NIDDK, CDC, NCI, NIMH, and FDA pages on October 4, 2026. The [October 4 batch review](content/question-reviews/2026-10-04.json) records each objective and supporting source fact. BSA dose, percentage weight change, carbohydrate coverage, and percent-concentration calculations were separately verified using JavaScript and AWK arithmetic.
