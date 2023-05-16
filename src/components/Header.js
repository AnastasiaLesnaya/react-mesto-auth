import headerLogo from '../images/header-logo.svg';
import { Link, Route } from 'react-router-dom';

function Header (props) {
  return (
    <header className="header">
      < img src={ headerLogo } className="header__logo" alt="логотип Место.Россия" />
      <div className="header__user-area">
        { props.isLoggedIn ? ( // пользователь авторизован
          <>
            <p className="header__menu-item">{ props.email }</p>
            <Link to='/sign-in' className="header__menu-item" onClick={ props.isLogout }>Выйти</Link>
          </>
        ) : ( // пользователь не авторизован
          <>
            <Route path='/sign-up'>
              <Link to='/sign-in' className="header__menu-item">Вход</Link>
            </Route>
            <Route path='/sign-in' >
              <Link to='/sign-up' className="header__menu-item">Регистрация</Link>
            </Route>
          </>
        )}
      </div>
    </header>
  )
}

export default Header;