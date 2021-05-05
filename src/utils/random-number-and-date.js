import dayjs from 'dayjs';
import objectSupport from 'dayjs/plugin/objectSupport';
dayjs.extend(objectSupport);

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

const getRandomArray = (elements, arrayLength = elements.length) => {
  const shuffledArray = shuffle(elements.slice());
  shuffledArray.length = getRandomInteger(1, arrayLength);
  return shuffledArray;
};

const getRandomArrayElement = (elements) => {
  return elements[getRandomInteger(0, elements.length - 1)];
};

const isEnterCtrlKeyDown = (evt) => evt.keyCode === 13 && evt.ctrlKey || evt.keyCode == 13 && evt.metaKey;
const isEscKewDown = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

const setSequentialNumber = () => {
  let result = 0;
  return result+=1;
};

const returnDurationInHoursMinutes = (duration) => {
  return dayjs({minute: duration}).format('h[h] mm[m]');
};

export { getRandomInteger, getRandomArray, getRandomArrayElement, getRandomFloat, isEnterCtrlKeyDown, isEscKewDown, setSequentialNumber, returnDurationInHoursMinutes };
