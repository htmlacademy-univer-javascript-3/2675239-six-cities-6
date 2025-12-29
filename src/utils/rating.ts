/**
 * Rounds rating to nearest integer for star display
 * @param rating - rating value (0-5)
 * @returns rounded rating (0-5)
 */
export const roundRating = (rating: number): number => Math.round(rating);

/**
 * Converts rating to percentage for star width
 * @param rating - rating value (0-5)
 * @returns percentage (0-100)
 */
export const ratingToPercent = (rating: number): number => {
  const rounded = roundRating(rating);
  return (rounded / 5) * 100;
};

/**
 * Formats housing type according to TZ
 * @param type - housing type (apartment, room, house, hotel)
 * @returns formatted type (Apartment, Room, House, Hotel)
 */
export const formatHousingType = (type: string): string => {
  const typeMap: Record<string, string> = {
    apartment: 'Apartment',
    room: 'Room',
    house: 'House',
    hotel: 'Hotel',
  };
  return typeMap[type.toLowerCase()] || type.charAt(0).toUpperCase() + type.slice(1);
};

