import Schedule from '../components/Schedule/Schedule';
import RegistrationForm from '../components/RegistrationForm/RegistrationForm';
import LoginForm from '../components/LoginForm/LoginForm';

import MyTrainings from '../components/MyTrainings/MyTrainings';
import UserProfile from '../pages/UserProfile/UserProfile';
import CoachPage from '../pages/CoachPage/CoachPage';
import HomePage from '../pages/home/index';
import { Routes, Route } from 'react-router-dom';


function AppRoutes() {
  return (
    <Routes>
      <Route path="/profile" element={<UserProfile />} />
      <Route path='/my-schedule' element={<MyTrainings />} />
      <Route path='/login' element={<LoginForm />} />
      <Route path='/registration' element={<RegistrationForm />} />
      <Route path='/coach/:id' element={<CoachPage />} />
      <Route path='/schedule' element={<Schedule />} />
      <Route exact path='/' element={<HomePage />} />
    </Routes>
  );
}

export default AppRoutes;