import { FilmCardNumber } from './constants.js';
import { generateFilmCard, generateFilmComments } from './mock/generation-film-card-and-comments.js';
import { generateFilters } from './generate-filters.js';
import FilmListPresenter from './presenter/film-list.js';
import StatisticView from './view/statistic.js';
import { render, RenderPosition } from './utils/render.js';
import UserRankView from './view/user-rank.js';

const mainElement = document.querySelector('.main');
const headerElement = document.querySelector('.header');
const footerElement = document.querySelector('.footer__statistics');

const filmCards = new Array(FilmCardNumber.FILM_CARD_QUANTITY).fill('').map(() => generateFilmCard());
const filters = generateFilters(filmCards);
const comments = new Array(FilmCardNumber.FILM_CARD_QUANTITY).fill('').map(() => generateFilmComments());

const filmListPresenter = new FilmListPresenter(mainElement);
filmListPresenter.init(filmCards, filters, comments);
render(headerElement, new UserRankView(filmCards), RenderPosition.BEFOREEND);
render(footerElement, new StatisticView(filmCards), RenderPosition.BEFOREEND);
