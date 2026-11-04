# Examples

One rendered intro per style, all made with:

```text
/intro "Code With Sam" --tagline "Ship faster" --style <style>
```

| Folder | Files |
|---|---|
| `terminal/` `neon/` `minimal/` `glitch/` `retro/` `cinematic/` | `intro.mp4` (1920x1080, 5 s, with audio), `intro.jpg` poster, `brief.md`, `COMMAND.txt` |

Regenerate any of them with:

```bash
node skills/intro/scripts/build.mjs --name "Code With Sam" --tagline "Ship faster" --style neon --out /tmp/out --render
```

Added a new style or format? Add an example here via PR (keep each MP4 under 1 MB).
