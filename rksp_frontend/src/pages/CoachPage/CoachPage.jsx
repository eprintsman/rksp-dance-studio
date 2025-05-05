import React from "react";
import { useParams } from 'react-router-dom';
import "./CoachPage.css";
import coaches from "../../Coaches.js"

// Иконки для социальных сетей (можно использовать библиотеку, например, react-icons)
const socialIcons = {
  instagram: "https://cdn-icons-png.flaticon.com/512/2111/2111463.png",
  facebook: "https://cdn-icons-png.flaticon.com/512/733/733547.png",
  vk: "https://cdn-icons-png.flaticon.com/512/145/145813.png",
  youtube: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png",
};

const CoachPage = () => {
  const { id } = useParams();
  const coach = coaches.find(t => t.id === parseInt(id));
  if (!coach) return <div>Тренер не найден</div>;

  return (
    <div className="coach-page">
      <div className="coach-info">
        {/* Фото тренера */}
        <img src={coach.photo} alt={coach.fio} className="coach-photo" />

        {/* Имя и вид танцев */}
        <h1>{coach.fio}</h1>
        <p className="dance-style">Специализация: {coach.danceStyle}</p>
        <p>Опыт: {coach.experience} лет</p>
        <p className="coach-description">{coach.description}</p>

        {/* Иконки социальных сетей */}
        <div className="social-links">
          {Object.entries(coach.socialLinks).map(([key, value]) => (
            <a
              key={key}
              href={value}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={socialIcons[key]}
                alt={key}
                className="social-icon"
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoachPage;