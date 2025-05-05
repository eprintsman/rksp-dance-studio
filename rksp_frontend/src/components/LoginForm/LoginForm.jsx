import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './LoginForm.css';

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setLoginError(null);
    
    try {
      // запрос к API для входа
      const response = await axios.post('http://127.0.0.1:8000/auth/jwt/create/', {
        username: data.username,
        password: data.password
      },
      {
        headers: {
          'Content-Type': 'application/json',  // явно указываем JSON
        }
      });

      const { access, refresh } = response.data;
      login(access, refresh);

      // Сохраняем токен в localStorage
      localStorage.clear();
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      navigate('/profile');
      
    } catch (error) {
        setLoginError(error.response?.data || 'Неверный логин или пароль');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="login-form">
      <h2>Вход в аккаунт</h2>
      
      {loginError && <div className="form-error">{loginError}</div>}
      
      <div className="form-group">
        <label htmlFor="loginEmail">Логин</label>
        <input
          id="loginEmail"
          type="username"
          {...register("username", {
            required: "Введите имя пользователя"
          })}
        />
        {errors.username && <span className="error">{errors.username.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="loginPassword">Пароль</label>
        <input
          id="loginPassword"
          type="password"
          {...register("password", {
            required: "Пароль обязателен"
          })}
        />
        {errors.password && <span className="error">{errors.password.message}</span>}
      </div>

      <div className="form-options">
        
        <a href="/forgot-password" className="forgot-password">
          Забыли пароль?
        </a>
      </div>

      <button type="submit" disabled={isSubmitting} className="submit-btn">
        {isSubmitting ? 'Вход...' : 'Войти'}
      </button>
      
      <div className="register-link">
        Нет аккаунта? <a href="/registration">Зарегистрироваться</a>
      </div>
    </form>
  );
};

export default LoginForm;