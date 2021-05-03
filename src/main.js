import { FilmCardNumber } from './constants.js';
import { generateFilmCard, generateFilmComments } from './mock/generation-film-card-and-comments.js';
import { generateFilters } from './generate-filters.js';
import FilmListPresenter from './presenter/film-list.js';

const mainElement = document.querySelector('.main');
const filmCards = new Array(FilmCardNumber.FILM_CARD_QUANTITY).fill('').map(() => generateFilmCard());
const filters = generateFilters(filmCards);
const comments = new Array(FilmCardNumber.FILM_CARD_QUANTITY).fill('').map(() => generateFilmComments());
const filmListPresenter = new FilmListPresenter(mainElement);
filmListPresenter.init(filmCards, filters, comments);
