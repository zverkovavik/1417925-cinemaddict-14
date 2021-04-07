import dayjs from 'dayjs';
const DAYS_GAP = 90;

const getRandomInteger = (min, max) => {

  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomFloat = (min, max, numbersAfterFloat = 1) => {
  if (min > max || min < 0 || min === max || max < 0 || numbersAfterFloat > 20) {
    throw 'Задан неверный диапазон';
  }
  const randomFloat = Math.random() * (max - min + 1) + min;
  return Number(randomFloat.toFixed(numbersAfterFloat));
};

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const getRandomArray = (elements) => {
  const shuffledArray = shuffle(elements.slice());
  shuffledArray.length = getRandomInteger(1, elements.length);
  return shuffledArray;
};

const getRandomArrayElement = (elements) => {
  return elements[getRandomInteger(0, elements.length - 1)];
};

const generateDate = () => {
  const numberYearsAgo = getRandomInteger(0, DAYS_GAP);
  const date = dayjs().add(-numberYearsAgo, 'year').toString().split(' ');
  return date;
};

const generateCommentDate = () => {
  const numberDaysAgo = getRandomInteger(0, DAYS_GAP);
  return dayjs().add(-numberDaysAgo, 'day').format('YYYY/MM/DD hh:mm');
};

export { getRandomInteger, getRandomArray, getRandomArrayElement, getRandomFloat, generateDate, generateCommentDate };
