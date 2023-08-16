import CanvasStage from './CanvasStage';
import CustomLineChart from './CustomLineChart';
import DraggableTextLayer from './DraggableTextLayer';

function App() {
  return (
    <>
      <div style={{ position: 'absolute', top: 0, left: 0 }}>
        <CustomLineChart />
      </div>
      <CanvasStage>
        <DraggableTextLayer />
      </CanvasStage>
    </>
  );
}

export default App;
