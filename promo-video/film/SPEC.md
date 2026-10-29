# SPEC · Weekend Escape · "Friday 18:30"

GOAL:    a Paris student watches it once and thinks "a whole weekend that fits my budget, planned in a minute: I'm trying it".
OUTPUT:  HyperFrames, 1080 x 1920 (vertical, social), 30 fps.
TIME:    30 s x 30 = 900 frames. No music bed yet (no free source on this machine): sound effects only, every one caused on screen.
LOOK:    the site's own "sunset ticket" kit, scaled x2.8 from the 390 px mobile site.
         ground cream #FFF3E4, paper #FFFCF7, peach #FFD9C2; ink #231B2E (text, 7 px outlines);
         accent coral #FF5C4D: one highlighted word per shot, the match, the stamps; sun #FFB92E: the sun, the picked answers.
         display Bricolage Grotesque 800, -3% tracking, 120-300 px; body DM Sans 500/700, 34-48 px; DM Mono 500 for tickets only.
         medium: printed tickets and stickers. Hard offset shadows 14 px, 0 blur, 100% ink. No gradients, no glow, no grain.
OBJECTS: the clock (Friday 18:30 -> 18:31), browser tabs that multiply and shrink, the real "Find my weekend" button,
         the real quiz screens (captured from the site), answer stickers, a departure board of the 14 real destinations,
         rubber stamps, the Brussels train ticket (real numbers: 35 + 56 + 45 = ~136), the plan (real lines from
         data/destinations.json), a lock-screen notification with the real email subject, the logo (site SVG).
MOTION:  enter expo.out 0.5-0.7 s; move power3.inOut 0.5 s; exit power3.in 0.3 s; stickers and stamps back.out(1.7) (playful);
         opacity never bounces. Titles land and stay still. Staggers: words 0.08 s, rows 0.04 s, stamps 0.09 s.
SHOTS:
  1 HOOK     0.0-3.2   frame 0 already reads "FRIDAY 18:30 / Free weekend." Clock is the hero (300 px). "€150 budget." gets the coral
                       mark at 0.9 s, "Now what?" stamps in at 2.0 s (pop). Hands off: a browser window whips up from below (whoosh).
  2 TABS     3.2-7.6   browser fills the band. 14 tabs open one by one (key ticks), each new tab squeezes the others, like Chrome.
                       Line: "Hours of tabs." / "Still no idea if it fits." The sum in the window keeps showing ??? .
                       At 3.3 s local every tab is sucked into the real coral "Find my weekend" button; a finger taps it (click),
                       the button zooms through and its coral becomes the next frame (whoosh-cinematic).
  3 QUIZ     7.6-13.6  colour flood coral -> peach, the real quiz card rises. Three taps on the real answers (€100–€150, Train,
                       Culture), each answer peels off as a sun-yellow sticker and flies into a slot at the top (pop).
                       Screens change with a short horizontal whip. Card drops away at 5.2 s; the three stickers stay.
  4 MATCH    13.6-19.8 the stickers stay on top. "14 destinations." A 2-column departure board of the real 14 rows.
                       Train sticker pulses: 4 plane-only rows stamped NO TRAIN. Prices print in. Budget sticker pulses:
                       7 rows stamped OVER €150. Culture sticker pulses: Brussels wins. Brussels row grows into the big
                       ticket, the breakdown counts up to ~€136 (riser -> bass impact on the landing, the one big moment).
  5 PLAN     19.8-25.0 the ticket flips to the plan, Fri / Sat / Sun one real line each. The ticket folds into a
                       notification on a dark lock screen: 18:30 becomes 18:31, "Your Brussels weekend plan 🇧🇪" (chime).
  6 END      25.0-30.0 colour flood to cream, the sun rises. "Escape Paris this weekend." / "Within your budget."
                       Logo mark springs in, wordmark wipes in beside it, the URL button lands and is pressed once.
                       "Prices are estimates." Holds 2 s+.
BANNED:  dark void with floating UI; glow, particles; gradients; serif display; everything fading + sliding up;
         three cards in a row; logo docked in a corner; titles drifting after landing; invented UI or invented prices;
         "live prices" claims; "in seconds" claims; every scene entering the same way.
QA:      t=0 (thumbnail reads), 5.5 (tabs chaos), 10.0 (quiz text >= 28 px), 16.5 (stamps legible),
         19.3 (payoff ticket), 23.8 (notification), 29.5 (end card, URL readable at 360 px).
