import { FilmCardNumber } from './constants';
import { generateFilmCard, generateFilmComments } from './mock/generation-film-card-and-comments';
import { generateFilters } from './generate-filters';
import FilmListPresenter from './presenter/film-list';
import FooterStatisticView from './view/footer-statistics';
import { render, RenderPosition } from './utils/render';
import UserRankView from './view/user-rank';

const mainElement = document.querySelector('.main');
const headerElement = document.querySelector('.header');
const footerElement = document.querySelector('.footer__statistics');

const filmCards = new Array(FilmCardNumber.FILM_CARD_QUANTITY).fill('').map(() => generateFilmCard());
const filters = generateFilters(filmCards);
const comments = new Array(FilmCardNumber.FILM_CARD_QUANTITY).fill('').map(() => generateFilmComments());

const filmListPresenter = new FilmListPresenter(mainElement);
filmListPresenter.init(filmCards, filters, comments);
render(headerElement, new UserRankView(filmCards), RenderPosition.BEFOREEND);
render(footerElement, new FooterStatisticView(filmCards), RenderPosition.BEFOREEND);
