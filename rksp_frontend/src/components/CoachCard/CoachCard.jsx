import React from 'react';
import './CoachCard.css';
import { Link } from 'react-router-dom';

const CoachCard = ({ coach }) => {
    return (
      <div className='card'>
        <Link to={`/coach/${coach.id}`}>
          <img
            src={coach.photo}
            alt={coach.fio}
            className="card-image"
          />
          <div className="card-text">{coach.fio}</div>
        </Link>
      </div>
    );
}

export default CoachCard;