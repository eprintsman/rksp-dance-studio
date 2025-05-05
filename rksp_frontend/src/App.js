import './App.css';
import AppRoutes from './routes/AppRoutes';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
//import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';



function App () {
  return (
      <div className='app'>
          <Header brand='My studio'></Header>

          <main className='main'>
            <AppRoutes>
              
            </AppRoutes>
          </main>

          <Footer className='footer' text='© 2025 Танцевальная Студия "My studio". Все права защищены.'></Footer>
      </div>
  );
}

export default App;