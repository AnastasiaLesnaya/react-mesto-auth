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
  tokenCheck (token) {
    return this._request(`${this._authUrl}users/me`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization" : `Bearer ${token}`
      }
    })
  }

  // метод регистрации пользователя
   userReg (email, password) {
    return this._request(`${this._authUrl}signup`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password })
    })
  }

  // метод авторизации пользователя
  userLog (email, password) {
    return this._request(`${this._authUrl}signin`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password })
    })
  }

}


const apiAuth = new AuthApi('https://auth.nomoreparties.co/');

export default apiAuth;