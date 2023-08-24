export namespace CommonUtil {
  export function preZero(n: number): string {
    return n <= 10 ? `0${n}` : `${n}`;
  }

  export function isTruthlyIncludeZero(value: number | null) {
    return value || value === 0;
  }

  export function convertHourToSec(h: number) {
    return h * 3600;
  }

  export function convertMinToSec(m: number) {
    return m * 60;
  }

  export function convertMsToSec(ms: number) {
    return ms * 0.001;
  }

  export function convertDurationToSeconds(
    h: number,
    m: number,
    s: number,
    ms: number
  ) {
    let seconds = 0;
    if (h) {
      seconds += convertHourToSec(h);
    }
    if (m) {
      seconds += convertMinToSec(m);
    }
    if (s) {
      seconds += s;
    }
    if (ms) {
      seconds += convertMsToSec(ms);
    }

    return seconds;
  }

  export function deepCompare(obj1: any, obj2: any) {
    if (obj1 === obj2) {
      return true;
    }

    if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
      return false;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (let key of keys1) {
      if (!obj2.hasOwnProperty(key)) {
        return false;
      }

      if (!deepCompare(obj1[key], obj2[key])) {
        return false;
      }
    }

    return true;
  }

  export function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
    return new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert Blob to ArrayBuffer.'));
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read Blob as ArrayBuffer.'));
      };

      reader.readAsArrayBuffer(blob);
    });
  }

  export function random(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  export function randomColor() {
    return `rgba(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)}, 0.5)`;
  }
}
