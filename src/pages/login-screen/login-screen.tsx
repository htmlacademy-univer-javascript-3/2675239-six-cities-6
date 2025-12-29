import LoginHeader from '../../components/header/login.tsx';
import {useState, FormEvent, useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../../hooks';
import {loginAction} from '../../store/action.ts';
import {useNavigate} from 'react-router-dom';
import {AppRoute} from '../../const.ts';
import {AxiosError} from 'axios';
import {getAuthorizationStatus} from '../../store/selectors.ts';
import {AuthorizationStatus} from '../../const.ts';
import {Cities} from '../../const.ts';
import {changeCityAction} from '../../store/action.ts';

type ValidationErrorDetail = {
  property: string;
  value: string;
  messages: string[];
};

type ValidationErrorResponse = {
  errorType: string;
  message: string;
  details?: ValidationErrorDetail[];
};

function LoginScreen(): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [randomCity] = useState(() => Cities[Math.floor(Math.random() * Cities.length)]);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authorizationStatus = useAppSelector(getAuthorizationStatus);

  useEffect(() => {
    if (authorizationStatus === AuthorizationStatus.Auth) {
      navigate(AppRoute.Main);
    }
  }, [authorizationStatus, navigate]);

  const handleRandomCityClick = () => {
    dispatch(changeCityAction(randomCity));
    navigate(AppRoute.Main);
  };

  const validatePassword = (pwd: string): boolean => {
    const hasLetter = /[a-zA-Z]/.test(pwd);
    const hasDigit = /\d/.test(pwd);
    return hasLetter && hasDigit;
  };

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setError(null);

    if (!validatePassword(password)) {
      setError('Password must contain at least one letter and one digit');
      return;
    }

    dispatch(loginAction({email, password}))
      .unwrap()
      .then(() => {
        navigate(AppRoute.Main);
      })
      .catch((err: unknown) => {
        if (err instanceof AxiosError && err.response?.status === 400) {
          const errorData = err.response.data as ValidationErrorResponse;
          if (errorData.details && errorData.details.length > 0) {
            const messages = errorData.details.map((detail) => detail.messages.join(', ')).join('. ');
            setError(messages);
          } else {
            setError(errorData.message || 'Invalid email or password');
          }
        } else {
          setError('Failed to login. Please try again.');
        }
      });
  };

  return (
    <div className="page page--gray page--login">
      <LoginHeader/>

      <main className="page__main page__main--login">
        <div className="page__login-container container">
          <section className="login">
            <h1 className="login__title">Sign in</h1>
            <form className="login__form form" action="#" method="post" onSubmit={handleSubmit}>
              {error && (
                <div className="login__error" style={{color: 'red', marginBottom: '10px'}}>
                  {error}
                </div>
              )}
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden">E-mail</label>
                <input
                  className="login__input form__input"
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                />
              </div>
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden">Password</label>
                <input
                  className="login__input form__input"
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                />
              </div>
              <button className="login__submit form__submit button" type="submit">Sign in</button>
            </form>
          </section>
          <section className="locations locations--login locations--current">
            <div className="locations__item">
              <a className="locations__item-link" href="#" onClick={(e) => {
                e.preventDefault(); handleRandomCityClick();
              }}
              >
                <span>{randomCity.name}</span>
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default LoginScreen;

