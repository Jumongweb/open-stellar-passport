#!/usr/bin/env bash
# Build whisper.cpp in WSL and transcribe the voiceover to JSON (segment timestamps).
set -uo pipefail
WIN="/mnt/c/Users/usuario/OneDrive/Documentos/ZK STELLAR/open-stellar-passport"
WAV="$WIN/build/narration16k.wav"
OUT="$WIN/build/narration"   # whisper appends .json
W="$HOME/whisper.cpp"

echo "=== ensure build tools ==="
if ! command -v cmake >/dev/null || ! command -v g++ >/dev/null; then
  apt-get update -y >/dev/null 2>&1
  apt-get install -y build-essential cmake git >/dev/null 2>&1
fi
cmake --version | head -1; g++ --version | head -1

if [ ! -d "$W" ]; then
  echo "=== clone whisper.cpp ==="
  git clone --depth 1 https://github.com/ggerganov/whisper.cpp "$W" 2>&1 | tail -3
fi
cd "$W"

if [ ! -f "$W/build/bin/whisper-cli" ] && [ ! -f "$W/build/bin/main" ] && [ ! -f "$W/main" ]; then
  echo "=== build ==="
  cmake -B build -DCMAKE_BUILD_TYPE=Release 2>&1 | tail -3
  cmake --build build --config Release -j 2>&1 | tail -5
fi

CLI="$W/build/bin/whisper-cli"
[ -f "$CLI" ] || CLI="$W/build/bin/main"
echo "cli: $CLI"

if [ ! -f "$W/models/ggml-base.en.bin" ]; then
  echo "=== download model base.en ==="
  bash ./models/download-ggml-model.sh base.en 2>&1 | tail -3
fi

echo "=== transcribe ==="
"$CLI" -m "$W/models/ggml-base.en.bin" -f "$WAV" -oj -of "$OUT" -pp 2>&1 | tail -8
echo "JSON: ${OUT}.json"
ls -la "${OUT}.json" 2>/dev/null
echo "TRANSCRIBE_DONE"
