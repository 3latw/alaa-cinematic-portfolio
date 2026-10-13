export const clamp = (value: number) => Math.min(1, Math.max(0, value));
export function normalizedX(clientX: number, viewportWidth: number) {
  return viewportWidth > 0 ? clamp(clientX / viewportWidth) : 0.5;
}
export function scrubTime(position: number, duration: number) {
  if (!Number.isFinite(duration) || duration <= 0) return 0;
  // Avoid seeking exactly to EOF, which can show an empty frame on Safari.
  return clamp(position) * Math.max(0, duration - 0.04);
}
export function smoothPosition(
  current: number,
  target: number,
  deltaMs: number,
) {
  return (
    current + (target - current) * (1 - Math.exp(-Math.min(deltaMs, 64) / 65))
  );
}
