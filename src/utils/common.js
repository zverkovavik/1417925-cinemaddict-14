import dayjs from 'dayjs';

export const sortByDate = (dateA, dateB) => {
  return dayjs(dateB.filmInfo.release.date.year).diff(dayjs(dateA.filmInfo.release.date.year));
};

export const sortByRating = (ratingA, ratingB) => {
  return ratingB.filmInfo.totalRating - ratingA.filmInfo.totalRating;
};

export const sortByComments = (commentNumberA, commentNumberB) => {
  return commentNumberB.comments.length - commentNumberA.comments.length;
};
