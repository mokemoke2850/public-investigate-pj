import { Stage } from 'react-konva';

interface CanvasStageProps {
  height?: number;
  width?: number;
  children: React.ReactNode;
}

const CanvasStage: React.FC<CanvasStageProps> = (props) => {
  const { children, height, width } = props;
  return (
    <Stage
      height={height ?? window.innerHeight}
      width={width ?? window.innerWidth}
      style={{ opacity: 0.5 }}
    >
      {children}
    </Stage>
  );
};
export default CanvasStage;
