class Api {
  constructor(config) {
    this._link = config.link;
    this._headers = config.headers;
  }
  // функция обработки ответа сервера
_handleRes(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Код ошибки: ${res.status}`);
}

// функция отправки запроса на сервер
_request(link, config) {
  return fetch(link, config)
  .then(this._handleRes);
}
// загрузка карточек с сервера
getAllCards() {
  return this._request(`${this._link}cards`, {
    method: "GET",
    headers: this._headers,
    });
  }

// загрузка данных профиля с сервера
getUserInfo() {
  return this._request(`${this._link}users/me`, {
    method: "GET",
    headers: this._headers,
  });
}

// отправка обновлённых данных пользователя
setUserInfo(data) {
  return this._request(`${this._link}users/me`, {
    method: "PATCH",
    headers: this._headers,
    body: JSON.stringify({
      name: data.name,
      about: data.about,
    }),
  });
}

// отправка аватара пользователя
setAvatar(avaLink) {
  return this._request(`${this._link}users/me/avatar`, {
    method: "PATCH",
    headers: this._headers,
    body: JSON.stringify({
      avatar: avaLink.avatar,
    }),
  });
 }

// отправка новой карточки на сервер
addNewCard(data) {
  return this._request(`${this._link}cards`, {
    method: 'POST',
    headers: this._headers,
    body: JSON.stringify({
      link: data.link,
      name: data.name,
    }),
  });
}
  
// удаление карточки с сервера
deleteCard(id) {
  return this._request(`${this._link}/cards/${id}`, {
    method: 'DELETE',
    headers: this._headers,
  });
}

// отправка/снятие лайка на сервере
changeLikeCardStatus(id, isLiked) {
  if (isLiked) {
    return this._request(`${this._link}/cards/${id}/likes`, {
      method: "PUT",
      headers: this._headers,
    });
} else {
  return this._request(`${this._link}/cards/${id}/likes`, {
    method: "DELETE",
    headers: this._headers,
  });
 }
}
}
// API, токен
const api = new Api({
  link: 'https://mesto.nomoreparties.co/v1/cohort-62/',
  headers: {
    'content-Type': 'application/json',
    authorization: "7a41bbcd-7273-4261-a42b-1d34f24ccc05"
  },
});

export default api;