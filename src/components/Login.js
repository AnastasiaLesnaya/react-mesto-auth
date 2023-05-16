import React, { useState } from 'react';

function Login (props) {
  // стейты, данные инпутов
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleEmail (e) { setEmail(e.target.value) }
  function handlePass (e) { setPassword(e.target.value) }

  function handleSubmitButton (e) {
    e.preventDefault();
    props.handleLogin(email, password);
    setPassword('');
    setEmail('');
  }

  return (
    <>
      <div className="auth">
        <h3 className="auth__title">Вход</h3>
        <form className="auth__form" onSubmit={ handleSubmitButton }>
          <label htmlFor="email-input" className="auth__label">
            <input id="email-input" name="email" type="email" onChange={ handleEmail } value={ email || '' } className="auth__input"
                  placeholder="email" minLength="8" maxLength="40" required />
            <span className="email-input-error auth__input-error" />
          </label>
          <label htmlFor="passwd-input" className="auth__label">
            <input id="passwd-input" name="passwd" type="password" onChange={ handlePass } value={ password || '' } className="auth__input"
                 placeholder="Пароль" minLength="6" maxLength="18" required />
            <span className="passwd-input-error auth__input-error" />
          </label>
          <button type="submit" className="auth__button button" aria-label="Войти">Войти</button>
        </form>
      </div>
    </>
  )
}

export default Login;