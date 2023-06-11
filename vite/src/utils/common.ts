export namespace CommonUtil {
  export function preZero(n: number): string {
    return n <= 10 ? `0${n}` : `${n}`;
  }

  export function isTruthlyIncludeZero(value: number | null) {
    return value || value === 0;
  }
}
