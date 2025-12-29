import {Offer} from '../../types/offer.ts';
import FavoritesPlaceCard from '../favourite-place-card/favourite-place-card.tsx';

type cityFavoritesProps = {
  city: string;
  places: Offer[];
}
function CityFavorites({city, places}: cityFavoritesProps): JSX.Element {
  return (
    <li className="favorites__locations-items">
      <div className="favorites__locations locations locations--current">
        <div className="locations__item">
          <a className="locations__item-link" href="#">
            <span>{city}</span>
          </a>
        </div>
      </div>
      <div className="favorites__places">
        {places.map((place) => (
          <FavoritesPlaceCard
            id={place.id}
            key={place.id}
            previewImage={place.previewImage}
            isPremium={place.isPremium}
            isFavorite={place.isFavorite}
            price={place.price}
            title={place.title}
            type={place.type}
            rating={place.rating}
          />
        ))}
      </div>
    </li>
  );
}

export default CityFavorites;
