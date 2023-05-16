class AuthApi {
  constructor(authUrl) {
    this._authUrl = authUrl;
  }
  // функция обработки ответа сервера
  _handleRes(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Код ошибки: ${res.status}`);
  }

// функция отправки запроса на сервер
_request(link, authUrl) {
  return fetch(link, authUrl)
  .then(this._handleRes);
}

  // метод верификации токена
  tokenVerification (token) {
    return this._request(`${this._authUrl}users/me`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization" : `Bearer ${token}`
      }
    })
  }

  // метод авторизации пользователя
  userAuthorization (password, email) {
    return this._request(`${this._authUrl}signin`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password, email })
    })
  }

  // метод регистрации пользователя
  userRegistration (password, email) {
    return this._request(`${this._authUrl}signup`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password, email })
    })
  }
}


const apiAuth = new AuthApi('https://auth.nomoreparties.co/');

export default apiAuth;