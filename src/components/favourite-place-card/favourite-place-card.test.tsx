import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import FavoritesPlaceCard from './favourite-place-card';
import { reducer } from '../../store/reducer';
import { createAPI } from '../../services/api';
import { AuthorizationStatus } from '../../const';

const createMockStore = (authorizationStatus: AuthorizationStatus = AuthorizationStatus.Auth) => {
  const api = createAPI();
  return configureStore({
    reducer,
    preloadedState: {
      data: {
        city: {
          name: 'Paris',
          location: {
            latitude: 48.864716,
            longitude: 2.349014,
            zoom: 12,
          },
        },
        places: [],
        allOffers: [],
        isLoading: false,
        currentOffer: null,
        nearbyOffers: [],
        comments: [],
        isOfferLoading: false,
      },
      user: {
        authorizationStatus,
        user: authorizationStatus === AuthorizationStatus.Auth ? {
          email: 'test@test.com',
          token: 'test-token',
        } : null,
      },
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: api,
        },
      }),
  });
};

describe('FavoritesPlaceCard', () => {
  const mockProps = {
    id: '1',
    title: 'Favorite Offer',
    previewImage: 'test.jpg',
    isPremium: false,
    isFavorite: true,
    price: 100,
    type: 'apartment',
    rating: 4.5,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <FavoritesPlaceCard {...mockProps} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Favorite Offer')).toBeInTheDocument();
    expect(screen.getByText(/€100/i)).toBeInTheDocument();
    expect(screen.getByAltText('Place image')).toBeInTheDocument();
  });

  it('should display premium badge when isPremium is true', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <FavoritesPlaceCard {...mockProps} isPremium />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('should show active state when isFavorite is true', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <FavoritesPlaceCard {...mockProps} isFavorite />
        </MemoryRouter>
      </Provider>
    );

    const favoriteButton = screen.getByRole('button');
    expect(favoriteButton).toHaveClass('place-card__bookmark-button--active');
  });

  it('should dispatch changeFavoriteStatusAction when favorite button is clicked and user is authenticated', async () => {
    const user = userEvent.setup();
    const store = createMockStore(AuthorizationStatus.Auth);
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    render(
      <Provider store={store}>
        <MemoryRouter>
          <FavoritesPlaceCard {...mockProps} />
        </MemoryRouter>
      </Provider>
    );

    const favoriteButton = screen.getByRole('button');
    await user.click(favoriteButton);

    await new Promise((resolve) => setTimeout(resolve, 100));
    // Check that dispatch was called
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('should have correct link to offer page', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <FavoritesPlaceCard {...mockProps} />
        </MemoryRouter>
      </Provider>
    );

    const links = screen.getAllByRole('link');
    const offerLink = links.find((link) => link.getAttribute('href') === '/offer/1');
    expect(offerLink).toBeInTheDocument();
  });
});

