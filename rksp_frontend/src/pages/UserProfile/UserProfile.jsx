import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './UserProfile.css';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Получаем токен из localStorage
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!token) {
          throw new Error('Пользователь не авторизован');
        }
  
        const decoded = jwtDecode(token);
        const userId = decoded.user_id;
        
        
            // Запрашиваем данные пользователя
            const response = await axios.get(`http://127.0.0.1:8000/schedule/users/me/`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            })
            
            setUserData(response.data);
            setEditedData({
              first_name: response.data.first_name,
              last_name: response.data.last_name,
              email: response.data.email,
              phone: response.data.phone,
              birth_date: response.data.birth_date
            });
      } catch (err) {
        console.error('Ошибка при запросе:', err.response || err); // Подробный лог ошибок
        setError(err.message);
      }
    };
    fetchUserData();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedData({
      first_name: userData.first_name,
      last_name: userData.last_name,
      phone: userData.phone,
      birth_date: userData.birth_date
    });
  };

  const handleSaveClick = async () => {
    try {
      const decoded = jwtDecode(token);
      const userId = decoded.user_id;

      const response = await axios.patch(`http://127.0.0.1:8000/schedule/users/me/`, editedData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setUserData(response.data);
      setIsEditing(false);
      setSuccessMessage('Данные успешно обновлены!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Ошибка при обновлении данных: ' + err.message);
    }
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!userData) {
    return <div className="error">Данные пользователя не найдены</div>;
  }

  const activeAbonement = userData.abonements && userData.abonements.length > 0 
    ? userData.abonements[userData.abonements.length - 1]
    : null;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1 className="profile-title">Личный кабинет</h1>
        {successMessage && <div className="success-message">{successMessage}</div>}
      </div>
      
      <div className="profile-section">
        <div className="section-header">
          <h2 className="section-title">Личные данные</h2>
          {!isEditing && (
            <button onClick={handleEditClick} className="edit-button">
              <span>Редактировать</span>
              <div className="button-decoration"></div>
            </button>
          )}
        </div>
        
        {isEditing ? (
          <div className="edit-form">
            <div className="form-group">
              <label className="form-label">Имя</label>
              <input
                type="text"
                name="first_name"
                value={editedData.first_name || ''}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Фамилия</label>
              <input
                type="text"
                name="last_name"
                value={editedData.last_name || ''}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Телефон</label>
              <input
                type="tel"
                name="phone"
                value={editedData.phone || ''}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Дата рождения</label>
              <input
                type="date"
                name="birth_date"
                value={editedData.birth_date || ''}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            
            <div className="form-actions">
              <button onClick={handleSaveClick} className="save-button">
                <span>Сохранить</span>
                <div className="button-decoration"></div>
              </button>
              <button onClick={handleCancelClick} className="cancel-button">
                Отмена
              </button>
            </div>
          </div>
        ) : (
          <div className="user-info">
            <div className="info-item">
              <span className="info-label">Имя:</span>
              <span className="info-value">{userData.first_name}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Фамилия:</span>
              <span className="info-value">{userData.last_name}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Телефон:</span>
              <span className="info-value">{userData.phone}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Дата рождения:</span>
              <span className="info-value">{userData.birth_date}</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="profile-section">
        <h2 className="section-title">Ваш абонемент</h2>
        
        {activeAbonement && activeAbonement.is_active ? (
          <div className="abonement-card">
            <div className="card-corner"></div>
            <div className="card-content">
              <h3 className="abonement-title">{activeAbonement.abonement_type.name}</h3>
              
              <div className="card-details">
                <div className="lesson-count">
                  <span className="count">{activeAbonement.remaining_lessons}</span>
                  <span className="label">осталось занятий</span>
                </div>
                
                <div className="price">
                  {activeAbonement.abonement_type.price.toLocaleString('ru-RU', {
                    style: 'currency',
                    currency: 'RUB',
                    minimumFractionDigits: 0
                  })}
                </div>
              </div>
              
              <div className="abonement-info">
                <div className="info-row">
                  <span className="info-label">Всего занятий:</span>
                  <span>{activeAbonement.abonement_type.lesson_count}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Статус:</span>
                  <span className="status-active">Активен</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-abonement">
            <p className="empty-message">У вас пока нет активного абонемента</p>
            {/* {userData.abonements && userData.abonements.length > 0 && (
              <p className="inactive-count">{userData.abonements.length} неактивных абонементов</p>
            )} */}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;