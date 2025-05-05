import React, { useState } from 'react';
import axios from 'axios';
import './AbonementsList.css';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../AuthContext';
import { jwtDecode } from 'jwt-decode';

const AbonementCard = ({ abonement }) => {
  const { isAuthenticated, checkAuth } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');

  const handleBuyClick = async () => {
    // проверка что пользователь аутентифицирован
    if (!isAuthenticated){
      navigate('/login');
      return;
    }
    try {
      await checkAuth();

      const decoded = jwtDecode(token);
      const userId = decoded.user_id;

      const getUserResponse = await axios.get(`http://127.0.0.1:8000/schedule/users/me/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      // Проверяем, есть ли у пользователя активные абонементы
      const userAbonements = getUserResponse.data.abonement || [];
      const hasActiveAbonement = userAbonements.some(ab => ab.is_active);

      if (hasActiveAbonement) {
        alert('У вас уже есть активный абонемент. Нельзя иметь более одного активного абонемента.');
        return;
      }      

      const editedData = {
          abonement_type_id: parseInt(abonement.pk),          // ID объекта AbonementType
          remaining_lessons: parseInt(abonement.fields.lesson_count),
          is_active: true
      }

      const response = await axios.post(`http://127.0.0.1:8000/schedule/abonements/`, editedData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Покупка успешна!');
      alert('Абонемент успешно приобретен!');
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Произошла ошибка при покупке абонемента');
    }
  };

  return (
    <div className="abonement-card">
      <div className="card-corner"></div>
      <div className="card-content">
        <h3 className="abonement-title">{abonement.fields.name}</h3>
        
        <div className="card-details">
          <div className="lesson-count">
            <span className="count">{abonement.fields.lesson_count}</span>
            <span className="label">танцевальных занятий</span>
          </div>
          
          <div className="price">
            {abonement.fields.price.toLocaleString('ru-RU', {
              style: 'currency',
              currency: 'RUB',
              minimumFractionDigits: 0
            })}
          </div>
        </div>

        <button 
          className="buy-button"
          onClick={handleBuyClick}
        >
          <span>Выбрать</span>
          <div className="button-decoration"></div>
        </button>
      </div>
    </div>
  );
};

const AbonementsList = () => {
  const abonements = [
    {
      "pk": 1,
      "fields": {
        "name": "Мини",
        "lesson_count": 4,
        "price": 2000.00
      }
    },
    {
      "pk": 2,
      "fields": {
        "name": "Стандарт",
        "lesson_count": 8,
        "price": 3500.00
      }
    },
    {
      "pk": 3,
      "fields": {
        "name": "Премиум",
        "lesson_count": 16,
        "price": 7000.00
      }
    }
  ];

  return (
    <div className="abonements-container">
      {abonements.map(abonement => (
        <AbonementCard 
          key={abonement.pk} 
          abonement={abonement} 
        />
      ))}
    </div>
  );
};

export default AbonementsList;