import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './Schedule.css';

const Schedule = () => {
  const [trainings, setTrainings] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, checkAuth, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Получаем тренировки и записи параллельно
        const [trainingsRes, registrationsRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/schedule/trainings/'),
          axios.get('http://127.0.0.1:8000/schedule/registrations/', {
            headers: isAuthenticated ? {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`
            } : {}
          })
        ]);
        //console.log(registrationsRes);
        setTrainings(trainingsRes.data);
        setRegistrations(registrationsRes.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  const formatDate = (dateString) => {
    const options = { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit', 
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  // Подсчитываем количество записей для каждой тренировки
  const getRegistrationsCount = (trainingId) => {
    return registrations.filter(reg => reg.training === trainingId).length;
  };

  // Проверяем, записан ли текущий пользователь на тренировку
  const isUserRegistered = (trainingId) => {
    console.log("if (!user) return false;", !user)
    if (!user) return false;
    return registrations.some(reg => 
      reg.training.id === trainingId && reg.user.id === user.user_id
    );
  };

  const handleRegister = async (trainingId) => {
    try {
      await checkAuth();
  
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }
  
      const response = await axios.post(
        'http://127.0.0.1:8000/schedule/registrations/',
        { training_id: trainingId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (response.status === 201) {
        // Обновляем список записей

        const newRegistration = response.data.registration;
        setRegistrations([...registrations, newRegistration]);
      }
  
    } catch (error) {
      if (error.response) {
        // Выводим ошибку от сервера
        console.error('Ошибка записи:', error.response.data.detail);
        alert(error.response.data.detail);  // Можешь сделать свой компонент для сообщений
      } else {
        console.error('Ошибка:', error.message);
        alert("Произошла ошибка. Попробуйте еще раз.");
      }
    }
  };
  // const handleRegister = async (trainingId) => {
  //   try {
  //     await checkAuth();
      
  //     if (!isAuthenticated) {
  //       navigate('/login');
  //       return;
  //     }
      
  //     const response = await axios.post(
  //       'http://127.0.0.1:8000/schedule/registrations/',
  //       { training_id: trainingId },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem('access_token')}`,
  //           'Content-Type': 'application/json'
  //         }
  //       }
  //     );

  //     if (response.status === 201) {
  //       // Обновляем список записей
  //       const newRegistration = response.data;
  //       setRegistrations([...registrations, newRegistration]);
  //     }
  //   } catch (error) {
  //     console.error('Ошибка записи:', error.message);
  //   }
  // };

  if (loading) return <div className="loading">Загрузка расписания...</div>;
  if (error) return <div className="error">Ошибка: {error}</div>;

  return (
    <div className="schedule-container">
      <h1 className="schedule-title">Расписание тренировок</h1>
      
      <div className="trainings-grid">
        {trainings.map(training => {
          const registrationsCount = getRegistrationsCount(training.id);
          const availableSpots = training.max_participants - registrationsCount;
          const registered = isAuthenticated & isUserRegistered(training.id);

          return (
            <div key={training.id} className="training-card">
              <div className="card-corner"></div>
              
              <div className="training-header">
                <h3 className="direction-name">{training.direction.name}</h3>
                <div className="training-time">
                  {formatDate(training.start_datetime)}
                  <span className="duration">{training.duration_minutes} мин</span>
                </div>
              </div>
              
              <div className="training-details">
                <div className="detail-row">
                  <span className="detail-label">Тренер:</span>
                  <span className="detail-value">{training.trainer.full_name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Зал:</span>
                  <span className="detail-value">{training.hall.name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Места:</span>
                  <span className="detail-value">
                    {availableSpots} / {training.max_participants}
                  </span>
                </div>
              </div>
              
              <button
                className={`register-button ${registered ? 'registered' : ''}`}
                onClick={() => handleRegister(training.id)}
                disabled={registered || availableSpots <= 0}
              >
                {registered ? <span>Вы записаны</span> : <span>Записаться</span>}
                <div className="button-decoration"></div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Schedule;