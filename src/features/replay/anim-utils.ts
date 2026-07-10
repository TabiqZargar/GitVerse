export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

export function spring(
  current: number,
  target: number,
  velocity: number,
  stiffness = 120,
  damping = 12
): { value: number; velocity: number } {
  const force = (target - current) * stiffness;
  const damp = velocity * damping;
  const acceleration = force - damp;
  const newVelocity = velocity + acceleration * 0.016;
  const newValue = current + newVelocity * 0.016;
  return { value: newValue, velocity: newVelocity };
}

export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  const t = (value - inMin) / (inMax - inMin);
  return outMin + clamp(t, 0, 1) * (outMax - outMin);
}

export function getDateProgress(
  tileDate: Date,
  currentDate: Date,
  revealWindowDays = 1.5
): number {
  const diffMs = currentDate.getTime() - tileDate.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays >= revealWindowDays) return 1;
  if (diffDays <= -revealWindowDays) return 0;

  const t = (diffDays + revealWindowDays) / (2 * revealWindowDays);
  return smoothstep(clamp(t, 0, 1));
}

export function daysBetween(a: Date, b: Date): number {
  const ms = b.getTime() - a.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
