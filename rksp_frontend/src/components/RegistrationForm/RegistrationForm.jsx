import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import './RegistrationForm.css'; // Стили можно добавить отдельно

const RegistrationForm = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const onSubmit = async (data) => {
    setError(null);
    setIsSubmitting(true);

    try {
      // запрос к API для регистрации
      const response = await axios.post('http://127.0.0.1:8000/auth/users/', {
        username: data.username,
        password: data.password
      });

      // console.log('Данные для регистрации:', data);
      // await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация запроса
      
      setSubmitSuccess(true);

    } catch (error) {
      if (error.response?.data?.username) {
        // Если ошибка связана с username, выводим соответствующее сообщение
        setError(error.response.data.username[0]);
      } if (error.response?.data?.password) {
        // Если ошибка связана с username, выводим соответствующее сообщение
        setError(error.response.data.password[0]);
      } else {
        // Для других ошибок выводим общее сообщение
        setError('Ошибка регистрации');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="success-message">
        <h2>Регистрация успешно завершена!</h2>
        {/* <p>На вашу почту отправлено письмо с подтверждением.</p> */}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="registration-form">
      <h2>Регистрация</h2>
      
      <div className="form-group">
        <label htmlFor="email">Логин</label>
        <input
          id="email"
          type="username"
          {...register("username", {
            required: "Введите имя пользователя"
          })}
        />
        {errors.username && <span className="error">{errors.username.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="password">Пароль</label>
        <input
          id="password"
          type="password"
          {...register("password", {
            required: "Пароль обязателен",
            minLength: {
              value: 8,
              message: "Пароль должен содержать минимум 8 символов"
            }
          })}
        />
        {errors.password && <span className="error">{errors.password.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">Подтвердите пароль</label>
        <input
          id="confirmPassword"
          type="password"
          {...register("confirmPassword", {
            required: "Подтвердите пароль",
            validate: value => value === watch('password') || "Пароли не совпадают"
          })}
        />
        {errors.confirmPassword && <span className="error">{errors.confirmPassword.message}</span>}
      </div>

      <div className="form-group checkbox-group">
        <input
          id="terms"
          type="checkbox"
          {...register("terms", {
            required: "Вы должны принять условия соглашения"
          })}
        />
        <label htmlFor="terms">
          Я принимаю <a href="/terms" target="_blank" rel="noopener noreferrer">пользовательское соглашение</a>
        </label>
        {errors.terms && <span className="error">{errors.terms.message}</span>}
      </div>

      {error && <span className="error">{error}</span>}
      <button type="submit" disabled={isSubmitting} className="submit-btn">
        {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
      </button>
    </form>
  );
};

export default RegistrationForm;