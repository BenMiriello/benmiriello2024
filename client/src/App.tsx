import './App.css';
import Header from './components/Header/Header';
import Chat from './components/Chat/Chat';

const App = () => {
  return (
    <div className="app">
      <div className='main-content-container'>
        <Header />
        <Chat/>
      </div>
    </div>
  );
};

export default App;
