import { NS } from '@ns';

export async function main(ns: NS) {
  ns.tprint(caesarCipher('VIRUS MODEM INBOX POPUP CLOUD', 3));
  ns.tprint(
    findSumCombos([2, 3, 5, 8, 9, 10, 11, 12, 15, 16, 18], 137, [], [])
  );
  ns.tprint(vigenereCipher('QUEUEMEDIATRASHMOUSEPRINT', 'LURKING'));

  ns.tprint(totalWaysToSum(ns, 5));
}

function vigenereCipher(plainText: string, keyword: string) {
  var cipherCode = keyword
    .repeat(Math.ceil(plainText.length / keyword.length))
    .slice(0, plainText.length);
  var cipherText = '';
  for (var i = 0; i < plainText.length; i++) {
    var row = plainText[i].charCodeAt(0) - 65;
    var column = cipherCode[i].charCodeAt(0) - 65;
    cipherText += String.fromCharCode(((column + row) % 26) + 65);
  }
  return cipherText;
}

function caesarCipher(word: string, shift: number) {
  var cipherText = '';
  for (var letter of word) {
    if (letter !== ' ') {
      letter = String.fromCharCode(
        letter.charCodeAt(0) - (shift % 26) >= 65
          ? letter.charCodeAt(0) - (shift % 26)
          : letter.charCodeAt(0) - (shift % 26) + 26
      );
    }
    cipherText += letter;
  }
  return cipherText;
}
// doesnt work with large numbers need a new solution.
function getWaysToSum(ns: NS, target: number): number[][] {
  var numbers = [];
  var sumSets: any[] = [];
  for (var i = 1; i < target; i++) {
    numbers.push(i);
  }
  ns.tprint(numbers);
  findSumCombos(numbers, target, [], sumSets);
  return sumSets;
}
// doesnt work with large numbers need a new solution.
function findSumCombos(
  numbers: number[],
  target: number,
  set: number[],
  sumSets: number[][]
) {
  if (target < 0) {
    return;
  }
  if (target === 0) {
    sumSets.push(set);
    return;
  }
  for (var i = 0; i < numbers.length; i++) {
    set.push(numbers[i]);
    findSumCombos(numbers.slice(i), target - numbers[i], set, sumSets);
  }
}
