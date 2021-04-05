import { getRandomInteger, getRandomArray, getRandomArrayElement } from './view/utils.js';

const createFilmCardContainer = () => {
  return `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

      <div class="films-list__container">
      </div>
    </section>
    <section class="films-list films-list--extra">
      <h2 class="films-list__title">Top rated</h2>

      <div class="films-list__container">
      </div>
    </section>

    <section class="films-list films-list--extra">
      <h2 class="films-list__title">Most commented</h2>

      <div class="films-list__container">
      </div>
    </section>`;
};

const FILM_TITLES = [
  'Made for each other',
  'Popeye meets sinbad',
  'Sagebrush trail',
  'Santa Claus conquers the martians',
  'The dance of life',
  'The great flamarion',
  'The man with the golden arm',
];

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
  'In rutrum ac purus sit amet tempus.'
];

const FILM_POSTERS = [
  './public/images/posters/made-for-each-other.png',
  './public/images/posters/popeye-meets-sinbad.png',
  './public/images/posters/sagebrush-trail.jpg',
  './public/images/posters/santa-claus-conquers-the-martians.jpg',
  './public/images/posters/the-dance-of-life.jpg',
  './public/images/posters/the-great-flamarion.jpg',
  './public/images/posters/the-man-with-the-golden-arm.jpg',
];

const FILM_DURATIONS = ['1h 32m', '1h 21m', '1h 18m', '1h 59m'];

const COMMENT_EMOTIONS = ['smile', 'sleeping', 'puke', 'angry'];
const FILM_GENRES = ['Comedy', 'Drama', 'Musical', 'Mystery', 'Western', 'Cartoon'];

const findPoster = (title) => {
  const substing = title.toLowerCase().split(' ').join('-');
  return FILM_POSTERS.find((element) => element.includes(substing));
};

const generateFilmCard = () => {
  return {
    id: '',
    comments: [], /* от 0 до 5 */
    filmInfo: {
      title: getRandomArrayElement(FILM_TITLES),
      alternativeTitle: '',
      totalRating: '',
      poster: findPoster(this.title),
      ageRating: 0,
      director: '',
      writers: [],
      actors: [],
      release: {
        date: '',
        country: '',
      },
      duration: getRandomArrayElement(FILM_DURATIONS),
      genre: getRandomArrayElement(FILM_GENRES),
      description: (getRandomArray(FILM_DESCRIPTIONS)).slice(0, getRandomInteger(1, 5)).join(' '),
    },
  };
};

const generateFilmComments = () => {
  return {
    id: '42',
    author: 'Ilya O\'Reilly',
    comment: 'a film that changed my life, a true masterpiece, post-credit scene was just amazing omg.',
    date: '2019-05-11T16:12:32.554Z',
    emotion: getRandomArrayElement(COMMENT_EMOTIONS),
  };
};

const createFilmCard = () => {
  return `        <article class="film-card">
          <h3 class="film-card__title">The Dance of Life</h3>
          <p class="film-card__rating">8.3</p>
          <p class="film-card__info">
            <span class="film-card__year">1929</span>
            <span class="film-card__duration">1h 55m</span>
            <span class="film-card__genre">Musical</span>
          </p>
          <img src="./images/posters/the-dance-of-life.jpg" alt="" class="film-card__poster">
          <p class="film-card__description">Burlesque comic Ralph "Skid" Johnson (Skelly), and specialty dancer Bonny Lee King (Carroll), end up together on a cold, rainy night at a tr…</p>
          <a class="film-card__comments">5 comments</a>
          <div class="film-card__controls">
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
            <button class="film-card__controls-item button film-card__controls-item--favorite" type="button">Mark as favorite</button>
          </div>
        </article>`;
};

export { createFilmCardContainer, createFilmCard, generateFilmCard, generateFilmComments };
