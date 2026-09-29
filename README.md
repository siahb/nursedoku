# NurseDoku

A nursing-themed logic puzzle built for Siahverse Nursing.

## Shift rules

Place exactly one **RN** in every row, every column, and every colored care zone. RN markers cannot touch each other, including diagonally.

## v1

- 6×6 puzzle with one unique legal solution
- RN placement and X-mark modes
- Conflict highlighting
- Timer and completion check
- Local progress saving with `localStorage`
- Mobile-first layout
- No framework or build step
- Ready for GitHub Pages

## Run locally

Open `index.html` directly, or serve the repository with:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Roadmap

- Daily NurseDoku
- Easy / Medium / Hard
- Streaks and statistics
- Hints
- Multiple nursing specialty themes
- Puzzle generator with uniqueness verification
- NCLEX bonus question after a solved puzzle
- Siahverse integration
