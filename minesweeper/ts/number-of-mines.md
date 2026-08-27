When building a Minesweeper game, giving players a range or preset options (Min, Default/Classic, Max) works best. For a custom range, a good rule of thumb is to keep the minimum at **10** (or roughly 10% for tiny boards) and cap the maximum at roughly **85% to 90% of total tiles** to prevent unwinnable configurations or UI breaking.

Here are recommended default and selectable ranges for your four board sizes:

---

### 1. 9×9 Board (81 Total Tiles)

* **Default (Beginner):** **10 mines** (~12% density)
* **Recommended Range:** **8 to 20 mines**
* *Notes:* Below 8 makes the board trivial; above 20 leaves too few safe tiles to open comfortably on a small grid.

### 2. 16×16 Board (256 Total Tiles)

* **Default (Intermediate):** **40 mines** (~15.6% density)
* **Recommended Range:** **25 to 75 mines**
* *Notes:* This is the classic intermediate balance. Pushing past 75 requires an expert player who is comfortable with dense logic and frequent guessing.

### 3. 16×30 Board (480 Total Tiles)

* **Default (Standard Wide):** **99 mines** (~20.6% density — *matches classic Windows Expert density*)
* **Recommended Range:** **50 to 180 mines**
* *Notes:* Because 16×30 is the classic "Windows Expert" dimension, defaulting to 99 mines will feel instantly familiar to veteran players.

### 4. 20×30 Board (600 Total Tiles)

* **Default (Custom Large):** **130 mines** (~21.6% density)
* **Recommended Range:** **70 to 220 mines**
* *Notes:* Slightly denser than the 16×30 board to maintain a challenge on the larger vertical space.

---

### Implementation Tips for Your Game

* **Clamp the Input:** If you use a slider or number input, program hard limits so players can't set fewer than **10 mines** or more than roughly **85% of total tiles** (`Math.floor(totalTiles * 0.85)`).
* **First-Click Safety:** Ensure your game generates the minefield *after* the player clicks their first square, guaranteeing their opening move is never a mine (and ideally opens a blank safe zone). Without this, high-density settings like a 20×30 board with 200+ mines will feel frustratingly unfair.

What programming language or framework are you using to build your Minesweeper game?