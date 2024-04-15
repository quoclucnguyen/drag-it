import './App.css';
import DragDiv from './components/DragDiv';

function App() {
  return (
    <div className="example-container">
      <DragDiv shape={'square'} />
      <DragDiv shape={'cirle'} />
    </div>
  );
}

export default App;
