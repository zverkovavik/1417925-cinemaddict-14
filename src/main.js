import Api from './api';
import FilmListPresenter from './presenter/film-list';
import FilterPresenter from './presenter/filter';
import FooterStatisticView from './view/footer-statistics';
import { render, RenderPosition } from './utils/render';
import UserRankView from './view/user-rank';
import MoviesModel from './model/movies';
import CommentsModel from './model/comments';
import FilterModel from './model/filters';
import { UpdateType } from './constants';

const mainElement = document.querySelector('.main');
const headerElement = document.querySelector('.header');
const footerElement = document.querySelector('.footer__statistics');

const AUTHORIZATION = 'Basic kd56hd7Pftf03p5';
const END_POINT = 'https://14.ecmascript.pages.academy/cinemaddict';
const api = new Api(END_POINT, AUTHORIZATION);

const moviesModel = new MoviesModel();
const commentsModel = new CommentsModel();
const filterModel = new FilterModel();

api.getMovies()
  .then((movies) => {
    moviesModel.setMovies(UpdateType.INIT, movies);

    render(headerElement, new UserRankView(movies), RenderPosition.BEFOREEND);
    render(footerElement, new FooterStatisticView(movies), RenderPosition.BEFOREEND);
  })
  .catch(moviesModel.setMovies(UpdateType.INIT, []));

const filterPresenter = new FilterPresenter(mainElement, filterModel, moviesModel);
const filmListPresenter = new FilmListPresenter(mainElement, moviesModel, commentsModel, filterModel, api);
filterPresenter.init();
filmListPresenter.init();

