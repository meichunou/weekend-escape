# Review · draft 1

**Creative calls:** storyline A, "Friday 18:30" (B "Departure board" and C "€150" are in STORYLINES.md). Vertical 1080x1920, 30 s, the site's own look. Every number comes from data/destinations.json and the site's recommend() logic: train + €100–€150 + culture gives Brussels ~€136 (35 + 56 + 45), tied with Ghent on culture and cheaper.

**Measured:** `check` shows 0 errors. I looked at the beat sheet, the seams and the fixed frames.

**Sound:** effects only, from the bundled Pixabay library. They are placed on taps, stamps, whooshes, a riser into a bass hit on ~€136, and a chime on the notification. I placed them but never heard them. There is no music bed: there is no free source on this machine, because it would need HeyGen or a local model.

**Warnings kept on purpose:**
- The "NO TRAIN / OVER €150" stamps get line_unread warnings. The row dims, but the stamp stays on screen for about 3 s.
- The culture tags hold about 1 s.
- The hl-bar uses z-index -1, but its parent is a stacking context.
- The stamps overlap the prices on purpose.

**Weakest shot:** the tabs scene (3.2–7.6 s) is the most generic. A real cursor and real tab favicons would help.

**Not checked:** the render, and the phone sheet at 360 px after the last fixes.
