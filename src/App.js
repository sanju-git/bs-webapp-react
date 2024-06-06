import logo from './logo.svg';
import './App.css';
import Chatbot from './components/chatbot';
import Header from './components/Header';

function App() {
  return (
    <div>
      <Header />
      <div>
        <Chatbot />
      </div>
    </div>
  );
}

export default App;
