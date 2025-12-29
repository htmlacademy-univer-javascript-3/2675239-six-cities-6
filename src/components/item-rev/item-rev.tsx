import {Rev} from '../../types/rev.ts';
import {ratingToPercent} from '../../utils/rating.ts';

type reviewItemProps = {
  rev: Rev;
}

function RevItem({rev} : reviewItemProps): JSX.Element {
  const date = new Date(rev.date);
  return (
    <li className="reviews__item">
      <div className="reviews__user user">
        <div className="reviews__avatar-wrapper user__avatar-wrapper">
          <img className="reviews__avatar user__avatar" src={rev.user.avatarUrl} width="54" height="54"
            alt="Reviews avatar"
          />
        </div>
        <span className="reviews__user-name">
          {rev.user.name}
        </span>
      </div>
      <div className="reviews__info">
        <div className="reviews__rating rating">
          <div className="reviews__stars rating__stars">
            <span style={{width: `${ratingToPercent(rev.rating)}%`}}></span>
            <span className="visually-hidden">Rating</span>
          </div>
        </div>
        <p className="reviews__text">
          {rev.comment}
        </p>
        <time className="reviews__time" dateTime={date.toISOString()}>
          {date.toLocaleString('en-US', { month: 'long', year: 'numeric' }).replace(',', '')}
        </time>
      </div>
    </li>
  );
}

export default RevItem;

