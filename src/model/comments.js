import Observer from '../utils/observer';
export default class Comments extends Observer {
  constructor() {
    super();
    this._comments = [];
  }

  setComments(comments) {
    this._comments = comments.slice();

    // this._notify(updateType);
  }

  getComments() {
    return this._comments;
  }

}
