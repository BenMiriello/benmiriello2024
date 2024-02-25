import './App.css';
import cardImage from './assets/cardImage.png';
import logoBGMOutline from './assets/logoBGMOutlineBW.png';
import Chat from './components/Chat/Chat';

const App = () => {
  return (
    <div className="app">
      <div className='main-content-container'>
        <div className='header' style={{ backgroundImage: `url(${cardImage})` }}>
          <div className='header-logo' style={{ backgroundImage: `url(${logoBGMOutline})`}}></div>
        </div>
        <div className='introduction'>
          I'm Ben Miriello. I made this site so you can
        </div>
        <Chat/>
      </div>
    </div>
  );
};

export default App;
