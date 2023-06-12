// const clueFromArray = (array: boolean[]) => {
//   const clue = [];
//   let count = 0;
//   for (let i = 0; i < array.length; i++) {
//     if (array[i]) {
//       count++;
//     } else {
//       if (count > 0) {
//         clue.push(count);
//         count = 0;
//       }
//     }
//   }
//   if (count > 0) {
//     clue.push(count);
//   }
//   if (clue.length === 0) {
//     clue.push(0);
//   }
//   return clue;
// };

// const generateClues = (grid: boolean[][]): [number[][], number[][]] => {
//   if (grid.length === 0) {
//     return [[], []];
//   }
//   const xClues = [];
//   for (let i = 0; i < grid.length; i++) {
//     xClues[i] = clueFromArray(grid[i] as boolean[]);
//   }
//   const yClues = [];
//   for (let i = 0; i < grid[0]!.length; i++) {
//     yClues[i] = clueFromArray(grid.map((row) => row[i]) as boolean[]);
//   }
//   return [xClues, yClues];
// };

// function calcCombForRow(rowLength: number, clues: number[]): boolean[][] {
//   function combinationUtil(arr, n, r, index, data, i, allComb) {
//     let currComb = [];
//     // Current combination is ready to be appended
//     if (index == r) {
//       for (let j = 0; j < r; j++) {
//         currComb.push(data[j]);
//       }
//       allComb.push(currComb);

//       return;
//     }

//     // When no more elements are there to append
//     if (i >= n) {
//       return;
//     }

//     // current is included, put next at next location
//     data[index] = arr[i];
//     combinationUtil(arr, n, r, index + 1, data, i + 1, allComb);

//     // current is excluded, replace it with next (Note that i+1 is passed, but index is not changed)
//     combinationUtil(arr, n, r, index, data, i + 1, allComb);
//   }

//   // The main function that prints all combinations of size r in arr[] of size n.
//   // This function mainly uses combinationUtil()
//   function findCombination(arr, n, r) {
//     // A temporary array to store
//     // all combination one by one
//     let data = new Array(r);
//     let allComb = [];
//     // Print all combination using
//     // temporary array 'data[]'
//     combinationUtil(arr, n, r, 0, data, 0, allComb);
//     return allComb;
//   }

//   //   let rowLength = 15;
//   //   let clues = [3, 2, 6];
//   let whiteSquares = rowLength + 1;
//   clues.forEach((num) => (whiteSquares -= num + 1));

//   let arr = [...Array(whiteSquares + clues.length).keys()];
//   let r = clues.length;
//   let n = arr.length;
//   const groupArray = findCombination(arr, n, r);
//   let combArray = Array.from({ length: groupArray.length }, () =>
//     new Array(rowLength).fill(true)
//   );
//   for (let i = 0; i < combArray.length; i++) {
//     let currentCount = 0;
//     let offset = 0;
//     let arrLength = combArray[i].length;
//     for (let j = 0; j < arrLength; j++) {
//       console.log(j, groupArray[i][currentCount]);
//       if (j == groupArray[i][currentCount] + offset) {
//         console.log("add", j, groupArray[i][currentCount] + offset);
//         j += clues[currentCount];
//         offset += clues[currentCount];
//         if (j !== arrLength) combArray[i][j] = false;
//         currentCount += 1;
//       } else {
//         combArray[i][j] = false;
//       }
//     }
//     console.log("one result:: ", combArray[i]);
//   }
//   console.log("finalResult", combArray);
//   return combArray;
// }

// const calcCombForGrid = (grid: boolean[][]): void => {
//   const [xClues, yClues] = generateClues(grid);
//   const rowLength = grid[0]!.length;
//   let allRowComb = xClues.map((clues) => calcCombForRow(rowLength, clues));
//   console.log("allRowComb", allRowComb);
// };

// export default calcCombForGrid;
export const calcCombForRow = () => {};
