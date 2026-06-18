# video — narrated demo (Remotion)

Composes the captioned screencast with a voiceover track and renders the
narrated demo (`../docs/demo-narrated.mp4`).

The voiceover is an **ElevenLabs** read (voice *Roger*) in `public/narration.mp3`,
and the **captions are transcribed from it** (`src/captionData.ts`) so they match
the spoken words exactly. The screencast (`public/screencast.mp4`, regenerable)
is recorded with the app actions timed to the voiceover beats, and stretched by
an imperceptible factor (`src/vo.ts`) to co-terminate with the voice.

To use a different voice: drop a new `public/narration.mp3`, re-transcribe, and
re-render. `gen-vo.ps1` is a no-API-key fallback (Windows SAPI TTS).

## Regenerate

```bash
npm install

# 1. clean screencast, actions timed to the voiceover (run from ../frontend):
#    npm run preview & node record-clean.mjs   →   produces ../docs/screencast-clean.webm
ffmpeg -i ../docs/screencast-clean.webm -c:v libx264 -crf 22 public/screencast.mp4

# 2. transcribe the voiceover → src/captionData.ts (whisper.cpp, runs in WSL):
#    bash ../scripts/wsl-transcribe.sh   (builds whisper.cpp + base.en model)

# 3. render (point at Edge to avoid a chromium download):
REMOTION_BROWSER_EXECUTABLE="C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" \
  npx remotion render Narrated ../docs/demo-narrated.mp4
```

`npx remotion studio` opens a live preview to retime captions against the voice.
