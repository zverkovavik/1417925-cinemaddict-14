import dayjs from 'dayjs';

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

export const sortByDate = (dateA, dateB) => {
  return dayjs(dateB.filmInfo.release.date.year).diff(dayjs(dateA.filmInfo.release.date.year));
};

export const sortByRating = (ratingA, ratingB) => {
  return ratingB.filmInfo.totalRating - ratingA.filmInfo.totalRating;
};

export const sortByComments = (commentNumberA, commentNumberB) => {
  return commentNumberB.comments.length - commentNumberA.comments.length;
};
