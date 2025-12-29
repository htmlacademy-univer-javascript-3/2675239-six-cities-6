import PlaceCard from '../place-card/place-card.tsx';
import {useState, useMemo, useCallback} from 'react';
import {useAppSelector} from '../../hooks';
import {SortType} from '../sort-options/sort-options.tsx';
import {getPlaces} from '../../store/selectors.ts';

type placeListProps = {
  onListItemHover: (id: string | null) => void;
  sortType: SortType;
}

function PlaceList({onListItemHover, sortType}: placeListProps) {
  const [, setActiveId] = useState<string | null>(null);
  const places = useAppSelector(getPlaces);

  const sortedPlaces = useMemo(() => {
    const placesCopy = [...places];

    switch (sortType) {
      case 'Price: low to high':
        return placesCopy.sort((a, b) => a.price - b.price);
      case 'Price: high to low':
        return placesCopy.sort((a, b) => b.price - a.price);
      case 'Top rated first':
        return placesCopy.sort((a, b) => b.rating - a.rating);
      case 'Popular':
      default:
        return placesCopy;
    }
  }, [places, sortType]);

  const handleMouseEnter = useCallback((id: string) => {
    setActiveId(id);
    onListItemHover(id);
  }, [onListItemHover]);

  const handleMouseLeave = useCallback(() => {
    setActiveId(null);
    onListItemHover(null);
  }, [onListItemHover]);

  return (

    <div className="cities__places-list places__list tabs__content">
      {sortedPlaces.map((place) => (
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
          nameOfClass={'cities'}
          rating={place.rating}
        />
      ))}
    </div>
  );
}

export default PlaceList;
