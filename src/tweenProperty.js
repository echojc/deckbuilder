// @flow

export function tweenProperty(obj: any, prop: string, target: number, duration: number): void {
  const start = obj[prop];
  const delta = target - start;

  const startTime = performance.now();
  const step = (currentTime: number) => {
    // t is normalised to the interval [0, 1]
    const t = (currentTime - startTime) / duration;
    if (t < 1) {
      // quadratic ease out
      obj[prop] = start - (delta * t * (t - 2));
      requestAnimationFrame(step);
    } else { // completed
      obj[prop] = target;
    }
  };
  requestAnimationFrame(step);
}
