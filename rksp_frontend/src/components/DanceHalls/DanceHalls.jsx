import React from 'react';
import './DanceHalls.css';
import HallPhoto1 from "../../img/hall1.jpg"; 
import HallPhoto2 from "../../img/hall2.jpg"; 
import HallPhoto3 from "../../img/hall3.jpg";

const halls = [
  {
    id: 1,
    name: "Зал 1",
    capacity: 15,
    image: HallPhoto1,
    description: "Просторный зал с профессиональным покрытием и панорамными зеркалами"
  },
  {
    id: 2,
    name: "Зал 2",
    capacity: 10,
    image: HallPhoto2,
    description: "Уютное пространство с хореографическими станками и естественным освещением"
  },
  {
    id: 3,
    name: "Зал 3",
    capacity: 20,
    image: HallPhoto3,
    description: "Стильный лофт-зал для современных танцевальных направлений"
  }
];

const HallCard = ({ hall }) => {
  return (
    <div className="static-card">
      <img src={hall.image} alt={hall.name} className="card-image" />
      <div className="card-content">
          <p className="card-text">{hall.name}</p>
          <p className="card-text">Вместимость: {hall.capacity} чел.</p>
          <p className="card-text">{hall.description}</p>
      </div>
    </div>
  );
};

const DanceHalls = () => {
  return (
    <div className="cards">
        {halls.map(hall => (
          <HallCard key={hall.id} hall={hall} />
        ))}
    </div>
  );
};

export default DanceHalls;