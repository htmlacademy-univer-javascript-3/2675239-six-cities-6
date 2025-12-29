import PlaceCard from '../place-card/place-card.tsx';
import {useState, useCallback, memo} from 'react';
import {Offer} from '../../types/offer.ts';

type nearbyPlacesListProps = {
  places: Offer[];
  onListItemHover: (id: string | null) => void;
}

const NearPlaces = memo(({places, onListItemHover}: nearbyPlacesListProps) => {
  const [, setActiveId] = useState<string | null>(null);
  const handleMouseEnter = useCallback((id: string) => {
    setActiveId(id);
    onListItemHover(id);
  }, [onListItemHover]);

  const handleMouseLeave = useCallback(() => {
    setActiveId(null);
    onListItemHover(null);
  }, [onListItemHover]);

  return (
    <div className="near-places__list places__list">
      {places.map((place) => (
        <PlaceCard
          id={place.id}
          key={place.id}
          previewImage={place.previewImage}
          isPremium={place.isPremium}
          isFavorite={place.isFavorite}
          price={place.price}
          title={place.title}
          type={place.type}
          onMouseEnter={() => handleMouseEnter(place.id)}
          onMouseLeave={handleMouseLeave}
          nameOfClass={'near-places'}
          rating={place.rating}
        />
      ))}
    </div>
  );
});

NearPlaces.displayName = 'NearPlaces';

export default NearPlaces;
