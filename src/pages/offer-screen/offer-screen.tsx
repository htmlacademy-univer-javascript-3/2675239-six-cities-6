import ReviewForm from '../../components/form-review/form-review.tsx';
import {Navigate, useParams, useNavigate} from 'react-router-dom';
import Header from '../../components/header/header.tsx';
import ReviewsList from '../../components/rev-list/rev-list.tsx';
import Map from '../../components/map/map.tsx';
import {useEffect, useCallback, useState} from 'react';
import NearbyPlacesList from '../../components/near-places/near-places.tsx';
import {useAppSelector, useAppDispatch} from '../../hooks';
import {fetchOfferAction, fetchNearbyOffersAction, fetchCommentsAction, changeFavoriteStatusAction} from '../../store/action.ts';
import {AppRoute, AuthorizationStatus} from '../../const.ts';
import Spinner from '../../components/spinner/spinner.tsx';
import {getCurrentOffer, getNearbyOffers, getComments, getIsOfferLoading, getAuthorizationStatus} from '../../store/selectors.ts';
import {ratingToPercent, formatHousingType} from '../../utils/rating.ts';

function OfferScreen(): JSX.Element {
  const {id: offerId} = useParams<{id: string}>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const offer = useAppSelector(getCurrentOffer);
  const nearbyOffers = useAppSelector(getNearbyOffers);
  const comments = useAppSelector(getComments);
  const isOfferLoading = useAppSelector(getIsOfferLoading);
  const authorizationStatus = useAppSelector(getAuthorizationStatus);
  const [hasLoaded, setHasLoaded] = useState(false);

  const handleFavoriteClick = useCallback(() => {
    if (!offer) {
      return;
    }

    if (authorizationStatus !== AuthorizationStatus.Auth) {
      navigate(AppRoute.Login);
      return;
    }

    dispatch(changeFavoriteStatusAction({
      offerId: offer.id,
      isFavorite: !offer.isFavorite,
    }));
  }, [offer, authorizationStatus, dispatch, navigate]);

  useEffect(() => {
    if (offerId) {
      setHasLoaded(false);
      dispatch(fetchOfferAction(offerId))
        .then(() => {
          setHasLoaded(true);
        })
        .catch(() => {
          setHasLoaded(true);
        });
      dispatch(fetchNearbyOffersAction(offerId));
      dispatch(fetchCommentsAction(offerId));
    }
  }, [offerId, dispatch]);

  if (isOfferLoading || !hasLoaded) {
    return (
      <div className="page">
        <Header isMain={false}/>
        <main className="page__main page__main--offer">
          <Spinner />
        </main>
      </div>
    );
  }

  if (!offer) {
    return <Navigate to={AppRoute.NotFound} />;
  }
  return (
    <div className="page">
      <Header isMain={false}/>

      <main className="page__main page__main--offer">
        <section className="offer">
          <div className="offer__gallery-container container">
            <div className="offer__gallery">
              {
                offer.images.slice(0, 6).map((picture) => (
                  <div className="offer__image-wrapper" key={picture}>
                    <img className="offer__image" src={picture} alt="Photo studio"/>
                  </div>
                ))
              }
            </div>
          </div>
          <div className="offer__container container">
            <div className="offer__wrapper">
              {
                offer.isPremium &&
                <div className="offer__mark">
                  <span>Premium</span>
                </div>

              }
              <div className="offer__name-wrapper">
                <h1 className="offer__name">
                  {offer.title}
                </h1>
                <button
                  className={`offer__bookmark-button${offer.isFavorite ? ' offer__bookmark-button--active' : ''} button`}
                  type="button"
                  onClick={handleFavoriteClick}
                >
                  <svg className="offer__bookmark-icon" width="31" height="33">
                    <use xlinkHref="#icon-bookmark"></use>
                  </svg>
                  <span className="visually-hidden">{offer.isFavorite ? 'In bookmarks' : 'To bookmarks'}</span>
                </button>
              </div>
              <div className="offer__rating rating">
                <div className="offer__stars rating__stars">
                  <span style={{width: `${ratingToPercent(offer.rating)}%`}}></span>
                  <span className="visually-hidden">Rating</span>
                </div>
                <span className="offer__rating-value rating__value">{offer.rating}</span>
              </div>
              <ul className="offer__features">
                <li className="offer__feature offer__feature--entire">
                  {formatHousingType(offer.type)}
                </li>
                <li className="offer__feature offer__feature--bedrooms">
                  {`${offer.bedrooms} Bedroom${offer.bedrooms > 1 ? 's' : ''}`}
                </li>
                <li className="offer__feature offer__feature--adults">
                  Max {offer.maxAdults} {offer.maxAdults === 1 ? 'adult' : 'adults'}
                </li>
              </ul>
              <div className="offer__price">
                <b className="offer__price-value">&euro;{offer.price}</b>
                <span className="offer__price-text">&nbsp;night</span>
              </div>
              <div className="offer__inside">
                <h2 className="offer__inside-title">What&apos;s inside</h2>
                <ul className="offer__inside-list">
                  {
                    offer.goods.map((elem) => (
                      <li className="offer__inside-item" key={elem}>
                        {elem}
                      </li>
                    ))
                  }
                </ul>
              </div>
              <div className="offer__host">
                <h2 className="offer__host-title">Meet the host</h2>
                <div className="offer__host-user user">
                  <div
                    className={`offer__avatar-wrapper ${offer.host.isPro ? 'offer__avatar-wrapper--pro' : ''} user__avatar-wrapper`}
                  >
                    <img className="offer__avatar user__avatar" src={offer.host.avatarUrl} width="74" height="74"
                      alt="Host avatar"
                    />
                  </div>
                  <span className="offer__user-name">
                    {offer.host.name}
                  </span>
                  {
                    offer.host.isPro &&
                    <span className="offer__user-status">
                    Pro
                    </span>
                  }

                </div>
                <div className="offer__description">
                  <p className="offer__text">
                    {offer.description}
                  </p>
                </div>
              </div>
              <section className="offer__reviews reviews">
                <h2 className="reviews__title">Reviews <span className="reviews__amount">{comments.length}</span></h2>
                <ReviewsList reviews={comments.slice(0, 10).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())}/>
                {authorizationStatus === AuthorizationStatus.Auth && <ReviewForm offerId={offerId || ''} />}
              </section>
            </div>
          </div>
          <Map
            activeId={null}
            className="offer"
            locations={nearbyOffers.slice(0, 3).map((o) => o.location)}
            city={offer.city.location}
            selectedPoint={offer.location}
          />
        </section>
        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">Other places in the neighbourhood</h2>
            <NearbyPlacesList places={nearbyOffers.slice(0, 3)} onListItemHover={() => {}}/>
          </section>
        </div>
      </main>
    </div>
  );
}

export default OfferScreen;
