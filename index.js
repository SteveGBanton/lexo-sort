// ---------------
// Lexographic List Sorting Functions 
// ---------------

const lettersToBase26 = {
  a: '0',
  b: '1',
  c: '2',
  d: '3',
  e: '4',
  f: '5',
  g: '6',
  h: '7',
  i: '8',
  j: '9',
  k: 'a',
  l: 'b',
  m: 'c',
  n: 'd',
  o: 'e',
  p: 'f',
  q: 'g',
  r: 'h',
  s: 'i',
  t: 'j',
  u: 'k',
  v: 'l',
  w: 'm',
  x: 'n',
  y: 'o',
  z: 'p',
};

const lettersBase26ToWord = {};
Object.keys(lettersToBase26).forEach((key) => {
  const val = lettersToBase26[key];
  lettersBase26ToWord[val] = key;
});

export const addToWord = (word, valToAdd) => {
  const split = word.split('');
  const b26 = split.map(l => lettersToBase26[l]).join('');
  const b10 = parseInt(b26, 26);
  const newB10 = b10 + valToAdd;
  const newB26 = newB10.toString(26);
  const split2 = newB26.split('');
  const newWord = split2.map(l => lettersBase26ToWord[l]).join('');
  // console.log('split')
  // console.log(split)
  // console.log('b10')
  // console.log(b10)
  // console.log('newB26')
  // console.log(newB26)
  // console.log('split2')
  // console.log(split2)
  // console.log('newWord')
  // console.log(newWord)
  return newWord;
};

export const getLastLetter = (word) => {
  const split = word.split('');
  const wordLength = split.length;
  const last = split.pop();
  return {
    lastLetter: last,
    allBeforeLast: split.join(''),
    wordLength,
  };
};

export const FIRST_LIST_ITEM = 'mmmmmm-m';
const UPPER_LIST_LIMIT = 'aaaaaa';
const LOWER_LIST_LIMIT = 'zzzzzz';
const LAST_LETTER = 'z';
const FIRST_LETTER = 'b';
const ADDITIONAL_LETTER = 'm';

export const insertBelow = (beforeItem, afterItem) => () => {
  let newItem;
  const beforeItemSplit = beforeItem ? beforeItem.split('-') : null;
  const afterItemSplit = afterItem ? afterItem.split('-') : null;

  if (!beforeItem && !afterItem) {
    newItem = FIRST_LIST_ITEM;
  }

  // Start of list. Subtract one from first 'word'.
  if (!beforeItemSplit && afterItemSplit) {
    // If we have reached all a's in the first portion of the key,
    // add to second part of key rather than the first, using the same procedure
    // you'd normally use with the second portion.
    if (afterItemSplit[0] === UPPER_LIST_LIMIT) {
      // Do not subtract from first word anymore - aaaaa is as far as we go.
      // And it is amazing that we got there. Will probably never happen in practice.
      // Subtract one from the second word.
      const { lastLetter, allBeforeLast } = getLastLetter(afterItemSplit[1]);
      const p2 = addToWord(lastLetter, -1);

      // If the last letter is 'b', also add 'm'
      if (p2 === FIRST_LETTER) {
        newItem = `${afterItemSplit[0]}-${allBeforeLast}${p2}${ADDITIONAL_LETTER}`;
      } else {
        newItem = `${afterItemSplit[0]}-${allBeforeLast}${p2}`;
      }
    } else {
      // Subtract from the first word.
      const p1 = addToWord(afterItemSplit[0], -1);
      newItem = `${p1}-${ADDITIONAL_LETTER}`;
    }
  }

  // End of list. Add one to first 'word', and end last word with m.
  if (beforeItemSplit && !afterItemSplit) {
    if (beforeItemSplit[0] === LOWER_LIST_LIMIT) {
      // Do not add to first word anymore - zzzzz is as far as we go.
      // Add one to the second word.
      const { lastLetter, allBeforeLast } = getLastLetter(beforeItemSplit[1]);
      const p2 = addToWord(lastLetter, 1);

      // If the last letter is 'z', also add 'm'
      if (p2 === LAST_LETTER) {
        newItem = `${beforeItemSplit[0]}-${allBeforeLast}${p2}${ADDITIONAL_LETTER}`;
      } else {
        newItem = `${beforeItemSplit[0]}-${allBeforeLast}${p2}`;
      }
    } else {
      const p1 = addToWord(beforeItemSplit[0], 1);
      newItem = `${p1}-${ADDITIONAL_LETTER}`;
    }
  }

  // Between two items.
  if (beforeItemSplit && afterItemSplit) {
    // First check if you can add one to the first word.
    const { lastLetter, allBeforeLast, wordLength } = getLastLetter(beforeItemSplit[1]);
    const potentialLastLetter = addToWord(lastLetter, 1);

    const { lastLetter: afterLastLetter, allBeforeLast: afterAllBeforeLast, wordLength: afterWordLength } = getLastLetter(afterItemSplit[1]);
    const beforeLastLetterIndex = wordLength - 1;
    const afterLastLetterIndex = afterWordLength - 1;

    const letterInAfterAtSameIndexAsLastLetterInBefore = afterItemSplit[1][beforeLastLetterIndex];

    // Can we add one letter to the 'before' word?
    if (lastLetter === LAST_LETTER || letterInAfterAtSameIndexAsLastLetterInBefore === lastLetter || letterInAfterAtSameIndexAsLastLetterInBefore === potentialLastLetter) {
      // In this case, we cannot add one to before letter.
      // Can we subtract one from afterWord?
      const potentialLastLetterInAfter = addToWord(afterLastLetter, -1);
      const letterInBeforeAtSameIndexAsLastLetterInAfter = beforeItemSplit[1][afterLastLetterIndex];
      if (afterLastLetter === FIRST_LETTER || letterInBeforeAtSameIndexAsLastLetterInAfter === lastLetter || letterInBeforeAtSameIndexAsLastLetterInAfter === potentialLastLetterInAfter) {
        // We can't subtract from this either. Need to add an 'm' to beforeWord.
        newItem = `${beforeItemSplit[0]}-${beforeItemSplit[1]}${ADDITIONAL_LETTER}`;
      } else {
        // Subtract one letter from the 'after' word.

        // If last letter is b, always add 'm' as well.
        newItem = `${beforeItemSplit[0]}-${afterAllBeforeLast}${potentialLastLetterInAfter}${potentialLastLetterInAfter === FIRST_LETTER ? ADDITIONAL_LETTER : ''}`;
      }
    } else {
      // Add one letter to the 'before' word.

      // If last letter is z, always add 'm' as well.
      newItem = `${beforeItemSplit[0]}-${allBeforeLast}${potentialLastLetter}${potentialLastLetter === 'z' ? ADDITIONAL_LETTER : ''}`;
    }
  }

  return newItem;
};

export const resortEntireList = (sortedList, lastWordOfPreviousList) => () => {
  // let startingB26 = 'cccccc'; // Word is 'mmmmmm'
  // if (lastWordOfPreviousList) {
  //   const split = lastWordOfPreviousList.split('');
  //   const b26 = split.map(l => lettersToBase26[l]).join('');
  //   startingB26 = b26;
  // }
  // const startingB10 = parseInt(startingB26, 26);
  let startingWord = 'mmmmmm';
  if (lastWordOfPreviousList) {
    startingWord = lastWordOfPreviousList;
  }
  const newOrder = sortedList.map((_, idx) => {
    const newWord = addToWord(startingWord, (idx + 1));

    // const newB10 = startingB10 + (idx + 2); // Add plus one so that we start with the word after lastWordOfPreviousList, and not the same word.
    // const newB26 = newB10.toString(26);
    // const split = newB26.split('');
    // const newWord = split.map(l => lettersBase26ToWord[l]).join('');
    return `${newWord}-m`;
  });

  return newOrder;
};
