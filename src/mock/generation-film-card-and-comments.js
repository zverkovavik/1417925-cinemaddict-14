import { getRandomInteger, getRandomArray, getRandomArrayElement, getRandomFloat, setSequentialNumber } from '../utils/random-number-and-date';
import { nanoid } from 'nanoid';
import { COMMENT_EMOTIONS } from '../constants';

const FILM_DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
];

const FILM_POSTERS = [
  './images/posters/made-for-each-other.png',
  './images/posters/popeye-meets-sinbad.png',
  './images/posters/sagebrush-trail.jpg',
  './images/posters/santa-claus-conquers-the-martians.jpg',
  './images/posters/the-dance-of-life.jpg',
  './images/posters/the-great-flamarion.jpg',
  './images/posters/the-man-with-the-golden-arm.jpg',
];

const FILM_TITLES = [
  'Made for each other',
  'Popeye meets sinbad',
  'Sagebrush trail',
  'Santa Claus conquers the martians',
  'The dance of life',
  'The great flamarion',
  'The man with the golden arm',
];

const FILM_GENRES = ['Comedy', 'Drama', 'Musical', 'Mystery', 'Western', 'Cartoon'];
const FILM_COUNTRY = ['USA', 'Finland', 'France', 'italy', 'Spain'];
const ACTORS = ['Erich von Stroheim, Mary Beth Hughes, Dan Duryea', 'Unknown'];
const WRITERS = ['Anne Wigton, Heinz Herald, Richard Weil'];
const DIRECTORS = ['Anthony Mann'];
const COMMENTS = [
  'AMAZYNG!',
  'wonderful',
  '...',
  'a film that changed my life, a true masterpiece, post-credit scene was just amazing omg.',
];

const findPoster = (title) => {
  const substing = title.toLowerCase().split(' ').join('-');
  return FILM_POSTERS.find((element) => element.includes(substing));
};

// функция проверяющая длину описания
const checkDescriptionLength = (element) => {
  return element.length > 140 ? element.slice(0, 139).concat('...') : element;
};

const generateFilmCard = () => {
  const titleFilm = getRandomArrayElement(FILM_TITLES);
  const commentNumber = setSequentialNumber();
  return {
    id: nanoid(),
    comments: [commentNumber],
    filmInfo: {
      title: titleFilm,
      alternativeTitle: '',
      totalRating: getRandomFloat(5, 9),
      poster: findPoster(titleFilm),
      ageRating: '18+',
      director: getRandomArrayElement(DIRECTORS),
      writers: getRandomArrayElement(WRITERS),
      actors: getRandomArrayElement(ACTORS),
      release: {
        date: '2019-05-11T00:00:00.000Z',
        releaseCountry: getRandomArrayElement(FILM_COUNTRY),
      },
      runtime: getRandomInteger(72, 105),
      genre: getRandomArray(FILM_GENRES, getRandomInteger(1, 3)),
      description: checkDescriptionLength((getRandomArray(FILM_DESCRIPTIONS)).slice(0, getRandomInteger(1, 5)).join(' ')),
    },
    userDetails: {
      isInWatchlist: Boolean(getRandomInteger(0, 1)),
      isAlreadyWatched: Boolean(getRandomInteger(0, 1)),
      watchingDate: '2019-04-12T16:12:32.554Z',
      isFavorite: Boolean(getRandomInteger(0, 1)),
    },
  };
};

const generateFilmComments = () => {
  return {
    id: setSequentialNumber(),
    author: 'Ilya O\'Reilly',
    comment: getRandomArrayElement(COMMENTS),
    date: '2019-05-11T16:12:32.554Z',
    emotion: getRandomArrayElement(COMMENT_EMOTIONS),
  };
};

export { generateFilmCard, generateFilmComments };
