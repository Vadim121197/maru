export function findUnusedIndex(arr1: number[], arr2: number[]): number {
  for (let i = 0; i < arr1.length; i++) {
    const element = arr1[i]
    if (element && !arr2.includes(element)) {
      return i
    }
  }
  return -1 // If all elements of arr1 exist in arr2
}
