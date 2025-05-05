import React from 'react';
import './Header.css';
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../../components/AuthContext';


const Header = (props) => {
    const { isAuthenticated, logout  } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); // Вызываем из контекста метод выхода 
        navigate('/'); // Делаем редирект на главную страницу
      };

    return (
        // <header className='header'>
        //     <h1 className='header-brand'>{props.brand}</h1>
        // </header>
        <header className="header">
            <div className="logo"><Link to="/">{props.brand}</Link></div>
            <nav className="nav">
                <ul className="nav-list">
                <li><Link to="/">Главная</Link></li>
                <li><Link to="/schedule">Расписание</Link></li>
                {!isAuthenticated && (
                    <li><Link to="/registration">Регистрация</Link></li>
                )}
                {!isAuthenticated && (
                    <li><Link to="/login">Вход</Link></li>
                )}
                {isAuthenticated && (
                  
                    <li><Link to="/my-schedule">Мои тренировки</Link></li>
                )}
                {isAuthenticated && (
                  
                    <li><Link to="/profile">Личный кабинет</Link></li>
                )}
                {isAuthenticated && (
                    <button onClick={handleLogout} className="logout-button">
                      Выйти
                    </button>
                )}
                
                </ul>
            </nav>
        </header>
    );
}

export default Header;