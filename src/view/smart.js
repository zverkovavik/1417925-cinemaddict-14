import AbstractView from './abstract.js';

export default class Smart extends AbstractView {
  constructor() {
    super();
    this._state = {};
  }

  updateData(update, justDataUpdating = false) {
    if (!update) {
      return;
    }

    this._state = Object.assign(
      {},
      this._state,
      update,
    );

    // проверка - обновляем только объект с состоянием
    if (justDataUpdating) {
      return;
    }

    this.updateElement();
  }

  restoreHandlers() {
    throw new Error ('Abstract method is not implemented: restoreHandlers');
  }

  updateElement() {
    //сохраняем элемент и позицию, находим родителя
    const prevElement = this.getElement();
    const prevElementScrollTop = prevElement.scrollTop;
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();
    // заменяем элемент, восстанавливаем позицию скролла
    parent.replaceChild(newElement, prevElement);
    newElement.scrollTop = prevElementScrollTop;
    // восстанавливаем обработчики, которые были утеряны при обновлении элемента
    this.restoreHandlers();
  }

}
