import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import PopupEditAvatar from './PopupEditAvatar';
import PopupEditProfile from "./PopupEditProfile";
import PopupAddCard from './PopupAddCard';
import CurrentUserContext from '../contexts/CurrentUserContext';
import api from '../utils/api';
import Register from './Register';
import Login from './Login';
import apiAuth from '../utils/AuthApi';
import InfoTooltip from "./InfoTooltip";
import ProtectedRoute from './ProtectedRoute';

function App () {
// Редактирование профиля
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
 // Редактирование картинки профиля
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
 // Новая карточка места
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
 // Попап зум
  const [isImageOpen, setIsImageOpen] = useState(false);
 // Попап зум
  const [selectedCard, setSelectedCard] = useState({});
  // карточки и контекст
  const [cards, setCards] = useState([]);
  const [currentUser, setCurrentUser] = useState({});

  // Почта
  const [email, setEmail] = useState('');
  // Авторизация (да/нет)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Регистрация (да/нет)
  const [status, setStatus] = useState(false);
  // статус окошка
  const [tooltipOpen, setTooltipOpen] = useState(false);

    // Навигации
    const navigate = useNavigate();

    // Верификация токена
    useEffect( () => {pat
      const userToken = localStorage.getItem('token')
      if (userToken) { apiAuth.tokenCheck(userToken)
          .then((res) => { setEmail(res.data.email);
            setIsLoggedIn(true);
            navigate('/') })
          .catch((err) => { console.log(`При проверке токена возникла ошибка, ${err}`) })
      }
    }, [navigate, isLoggedIn])

// Запрашиваем данные с сервера
 useEffect( () => {
  Promise.all([ api.getUserInfo(), api.getAllCards() ])
    .then(( [ userItem, allCards] ) => {
      setCurrentUser(userItem);
      setCards(allCards);
    })
    .catch((err) => { console.log(`При загрузке начальных данных возникла ошибка, ${err}`) })
}, [])


  
  // Обработчик открытия попапа редактирования профиля
  function handleEditProfileClick () { setIsEditProfilePopupOpen(true) }
  // Обработчик открытия попапа обновления аватара
  function handleEditAvatarClick () { setIsEditAvatarPopupOpen(true) }
  // Обработчик открытия попапа добавления карточки
  function handleAddPlaceClick () { setIsAddPlacePopupOpen(true) }
  
  // Обработчик удаления карточки
  function handleCardDelete (card) {
    api.deleteCard(card._id)
      .then(() => { 
        setCards( (cardsArray) => cardsArray.filter( (cardItem) => cardItem._id !== card._id)) })
      .catch( (err) => { console.log(`При удалении карточки возникла ошибка, ${err}`) })
  }
  // Обработчик изменения аватара
  function handleUpdateAvatar (link) {
    api.setAvatar(link)
      .then( (res) => { 
        setCurrentUser(res);
        closeAllPopups() 
      })
      .catch( (err) => { console.log(`При загрузке аватара возникла ошибка, ${err}`) })
  }
  // Обработчик зума карточки
  function handleCardClick (cardItem) {
    setIsImageOpen(true);
    setSelectedCard({
      ...selectedCard,
      name: cardItem.name,
      link: cardItem.link
    })
  }

// Обработчик лайков карточки
function handleCardLike (card) {
// Снова проверяем, есть ли уже лайк на этой карточке
  const isLiked = card.likes.some(cardItem => cardItem._id === currentUser._id);
// Отправляем запрос в API и получаем обновлённые данные карточки
    api.changeLikeCardStatus(card._id, !isLiked)
    .then( (cardsItem) => {
      setCards( (state) => state.map( (cardItem) => cardItem._id === card._id ? cardsItem : cardItem) )
    })
    .catch( (err) => { console.log(`При отражении лайков возникла ошибка, ${err}`) })
}

// Обработчик добавления карточки
function handleAddCard (cardItem) {
  api.addNewCard(cardItem)
    .then((card) => {
      setCards([card, ...cards]);
      closeAllPopups() 
    })
    .catch( (err) => { console.log(`Возникла ошибка при добавлении новой карточки, ${err}`) })
}

// Обработчик данных пользователя
function handleUpdateUser (currentUser) {
  api.setUserInfo(currentUser)
    .then((res) => {
      setCurrentUser(res);
      closeAllPopups()
    })
    .catch( (err) => { console.log(`При редактировании профиля возникла ошибка, ${err}`) })
}

  // Функция для закрытия всех попапов
  function closeAllPopups () {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsImageOpen(false);
    setTooltipOpen(false);
  }

    // Функция регистрации пользователя
    function handleRegister (email, password) {
      apiAuth.userReg(email, password)
        .then(() => {
          setTooltipOpen(true);
          setStatus(true) })
        .catch((err) => { console.log(`При регистрации возникла ошибка, ${err}`); setTooltipOpen(true); setStatus(false) })
    }
    // Функция авторизации пользователя
    function handleLogin (email, password) {
      apiAuth.userLog(email, password)
        .then((res) => {
          // если с токеном всё ок, ведём на главную
          if (res.token) {
            localStorage.setItem('token', res.token);
            setEmail(email);
            setIsLoggedIn(true);
            navigate('/');
          }
        })
        .catch((err) => { console.log(`При авторизации возникла ошибка, ${err}`); setTooltipOpen(true); setStatus(false) })
    }
    // Функция выхода пользователя
    function handleLogout () {
      // удаляем токен из хранилища
      localStorage.removeItem('token');
      setIsLoggedIn(false);  }
  

  return (
    <CurrentUserContext.Provider value={ currentUser }>
      <div className="page">
      <Header
        isLoggedIn = { isLoggedIn }
        email = { email }
        isLogout = { handleLogout } />
      <Routes>
        <Route path="/"
        element={
          <ProtectedRoute
            element={Main}
            isLoggedIn = { isLoggedIn }
            onEditProfile = { handleEditProfileClick }
            onEditAvatar = { handleEditAvatarClick }
            onAddPlace = { handleAddPlaceClick }
            onCardClick = { handleCardClick }
            onCardDelete = { handleCardDelete }
            onCardLike = { handleCardLike }
            cards={ cards } />
           }
        />
        <Route path ="/sign-in"
          element = {<Login
            handleLogin = { handleLogin }
            isOpen = { tooltipOpen }
            onClose = { closeAllPopups }
            status = { status } />}
        />
        <Route path ="/sign-up"
          element = {<Register
            handleRegister = { handleRegister }
            isOpen = { tooltipOpen }
            onClose = { closeAllPopups }
            status = { status } />}
        />       
        </Routes>
        < Footer />
        < PopupEditProfile
          isOpen = { isEditProfilePopupOpen }
          onClose = { closeAllPopups }
          onUpdateUser = { handleUpdateUser }/>
          
          < PopupEditAvatar
          isOpen = { isEditAvatarPopupOpen }
          onClose = { closeAllPopups }
          onUpdateAvatar = { handleUpdateAvatar } />
        
        < PopupAddCard
          isOpen = { isAddPlacePopupOpen }
          onClose = { closeAllPopups }
          onAddPlace = { handleAddCard } />
          
        < ImagePopup
          isOpen = { isImageOpen }
          onClose = { closeAllPopups }
          card = { selectedCard } />

        <InfoTooltip
          isOpen = { tooltipOpen }
          onClose = { closeAllPopups }
          status = { status } />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;