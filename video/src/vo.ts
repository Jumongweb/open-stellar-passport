// The ElevenLabs voiceover (public/narration.mp3) is the timing authority; the
// clean screencast is stretched by an imperceptible factor to co-terminate.
export const FPS = 30;
export const AUDIO_S = 122.488163; // public/narration.mp3
export const SCREENCAST_S = 120.366667; // public/screencast.mp4 (clean, no captions)
export const PLAYBACK_RATE = SCREENCAST_S / AUDIO_S; // ~0.983
