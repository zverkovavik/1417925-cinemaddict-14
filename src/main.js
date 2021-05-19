import { FilmCardNumber } from './constants';
import { generateFilmCard, generateFilmComments } from './mock/generation-film-card-and-comments';
import FilmListPresenter from './presenter/film-list';
import FilterPresenter from './presenter/filter';
import FooterStatisticView from './view/footer-statistics';
import { render, RenderPosition } from './utils/render';
import UserRankView from './view/user-rank';
import MoviesModel from './model/movies';
import CommentsModel from './model/comments';
import FilterModel from './model/filters';

const mainElement = document.querySelector('.main');
const headerElement = document.querySelector('.header');
const footerElement = document.querySelector('.footer__statistics');

const filmCards = new Array(FilmCardNumber.FILM_CARD_QUANTITY).fill('').map(() => generateFilmCard());
const comments = new Array(FilmCardNumber.FILM_CARD_QUANTITY).fill('').map(() => generateFilmComments());

const moviesModel = new MoviesModel();
moviesModel.setMovies(filmCards);
const commentsModel = new CommentsModel();
commentsModel.setComments(comments);
const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter(mainElement, filterModel, moviesModel);
const filmListPresenter = new FilmListPresenter(mainElement, moviesModel, commentsModel, filterModel);
filterPresenter.init();
filmListPresenter.init();
render(headerElement, new UserRankView(filmCards), RenderPosition.BEFOREEND);
render(footerElement, new FooterStatisticView(filmCards), RenderPosition.BEFOREEND);
