import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './MyTrainings.css';

const MyTrainings = () => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, checkAuth, user } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    const fetchUserTrainings = async () => {
      try {
        await checkAuth();
        
        if (!isAuthenticated) {
          navigate('/login');
          return;
        }

        const response = await axios.get(
          `http://127.0.0.1:8000/schedule/registrations/`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        // Получаем полные данные о тренировках
        const trainingsData = response.data.map(reg => reg.training);
        setTrainings(trainingsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserTrainings();
  }, [token]);

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

  const handleCancelRegistration = async (trainingId) => {
    try {
      // Находим ID записи на тренировку
      const registrationsResponse = await axios.get(
        `http://127.0.0.1:8000/schedule/registrations/?training=${trainingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (registrationsResponse.data.length === 0) {
        throw new Error('Запись на тренировку не найдена');
      }
      //console.log(registrationsResponse.data);

      const registrationId = registrationsResponse.data[0].id;

      // Удаляем запись
      await axios.delete(
        `http://127.0.0.1:8000/schedule/registrations/${registrationId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Обновляем список тренировок
      setTrainings(trainings.filter(t => t.id !== trainingId));
    } catch (error) {
      console.error('Ошибка отмены записи:', error.message);
    }
  };

  if (loading) return <div className="loading">Загрузка ваших тренировок...</div>;
  if (error) return <div className="error">Ошибка: {error}</div>;

  return (
    <div className="my-trainings-container">
      <h1 className="my-trainings-title">Мои тренировки</h1>
      
      {trainings.length === 0 ? (
        <div className="no-trainings">
          У вас пока нет запланированных тренировок
        </div>
      ) : (
        <div className="trainings-grid">
          {trainings.map(training => (
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
                  <span className="detail-value">{training.trainer.name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Зал:</span>
                  <span className="detail-value">{training.hall.name}</span>
                </div>
              </div>
              
              <button
                className="cancel-button"
                onClick={() => handleCancelRegistration(training.id)}
              >
                <span>Отменить запись</span>
                <div className="button-decoration"></div>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTrainings;