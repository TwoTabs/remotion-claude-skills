export const FPS = 30;
export const msToFrame = (ms: number): number => Math.round((ms / 1000) * FPS);
