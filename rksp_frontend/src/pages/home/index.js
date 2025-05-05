
import About from '../../components/About/About';
import CoachCard from '../../components/CoachCard/CoachCard';
import AbonementsList from '../../components/AbonementsList/AbonementsList';
import DanceHalls from '../../components/DanceHalls/DanceHalls';
import './index.css'
import coaches from '../../Coaches';

function HomePage() {
  return (
    <>
      <About>
      <p className='title'>Добро пожаловать в MyStudio</p>
      <p>Почему выбирают нас?</p>
      <p>Мы верим, что танец — это не просто движения, а искусство, спорт и терапия в одном. Здесь вы сможете:
      Снять стресс и улучшить физическую форму. Развить грацию, пластику и уверенность в себе.
      Найти свой уникальный стиль. Приходите на пробное занятие и погрузитесь в мир танца с DanceFlow! </p>
      </About>
      
      <section>
        <h1>Наши тренеры</h1>
        <div className='cards'>
          {coaches.map(coach => (
            <CoachCard key={coach.id} coach={coach} />
          ))} 
        </div>
      </section>

      <section>
      <h1>Наши залы</h1>
        <DanceHalls />
      </section>

      <section>
      <h1>Абонементы</h1>
        <AbonementsList />
      </section>
    </>
  );
}

export default HomePage;