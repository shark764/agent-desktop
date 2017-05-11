/**
 * throttle max function call rate to browser refresh rate
 */

const requestAnimationFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  ((callback) => window.setTimeout(callback, 1000 / 60));

function throttler(...callbackArgs) {
  if (!this.running) {
    this.running = true;
    requestAnimationFrame(() => {
      this.callback(...callbackArgs);
      this.running = false;
    });
  }
}

export function throttleDecorator(funcToThrottle) {
  return throttler.bind({ callback: funcToThrottle, running: false });
}
