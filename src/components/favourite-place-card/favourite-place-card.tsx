import {Link, useNavigate} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../../hooks';
import {changeFavoriteStatusAction} from '../../store/action.ts';
import {getAuthorizationStatus} from '../../store/selectors.ts';
import {AuthorizationStatus} from '../../const.ts';
import {AppRoute} from '../../const.ts';
import {ratingToPercent} from '../../utils/rating.ts';

type FavoritesPlaceCardProps = {
  id: string;
  title: string;
  previewImage: string;
  isPremium: boolean;
  isFavorite: boolean;
  price: number;
  type: string;
  rating: number;
}

function FavoritesPlaceCard(props : FavoritesPlaceCardProps): JSX.Element {
  const dispatch = useAppDispatch();
  const authorizationStatus = useAppSelector(getAuthorizationStatus);
  const navigate = useNavigate();

  const handleFavoriteClick = (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();

    if (authorizationStatus !== AuthorizationStatus.Auth) {
      navigate(AppRoute.Login);
      return;
    }

    dispatch(changeFavoriteStatusAction({
      offerId: props.id,
      isFavorite: !props.isFavorite,
    }));
  };

  return (
    <article className='favorites__card place-card'>
      {props.isPremium &&
        <div className="place-card__mark">
          <span>Premium</span>
        </div>}
      <div className="favorites__image-wrapper place-card__image-wrapper">
        <Link to={`/offer/${props.id}`}>
          <img className="place-card__image" src={props.previewImage} width="260" height="200"
            alt="Place image"
          />
        </Link>
      </div>
      <div className="favorites__card-info place-card__info">
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">&euro;{props.price}</b>
            <span className="place-card__price-text">&#47;&nbsp;night</span>
          </div>
          <button
            className={`place-card__bookmark-button${props.isFavorite ? ' place-card__bookmark-button--active' : ''} button`}
            type="button"
            onClick={handleFavoriteClick}
          >
            <svg className="place-card__bookmark-icon" width="18" height="19">
              <use xlinkHref="#icon-bookmark"></use>
            </svg>
            <span className="visually-hidden">{props.isFavorite ? 'In bookmarks' : 'To bookmarks'}</span>
          </button>
        </div>
        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span style={{width: `${ratingToPercent(props.rating)}%`}}></span>
            <span className="visually-hidden">Rating</span>
          </div>
        </div>
        <h2 className="place-card__name">
          <Link to={`/offer/${props.id}`}>{props.title}</Link>
        </h2>
        <p className="place-card__type">{props.type}</p>
      </div>
    </article>
  );
}

export default FavoritesPlaceCard;
