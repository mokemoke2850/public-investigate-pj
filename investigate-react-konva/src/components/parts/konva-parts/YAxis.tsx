import React from 'react';
import { Position } from '../../../@types/Konva';
import { Rect, Text } from 'react-konva';

interface YAxisProps {
  position: {
    x: number;
    y: number;
  };
  setPosition: (value: Position) => void;
  setCursorType: (value: string) => void;
  color?: string;
  length: number;
  label?: string;
}

const YAxis: React.FC<YAxisProps> = (props) => {
  const { position, setPosition, color, setCursorType, length, label } = props;

  return (
    <>
      <Rect
        x={position.x}
        y={position.y}
        width={3}
        height={length}
        fill={color ?? 'black'}
        draggable
        dragBoundFunc={(e) => {
          return {
            x: e.x,
            y: position.y,
          };
        }}
        onDragMove={(e) => {
          setPosition({
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onDragEnd={(e) => {
          setPosition({
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onMouseEnter={() => {
          setCursorType('grab');
        }}
        onMouseLeave={() => {
          setCursorType('default');
        }}
      />
      {label && (
        <Text
          text={label}
          draggable
          x={position.x}
          y={position.y}
          offsetX={8}
          offsetY={16}
          fontSize={16}
          dragBoundFunc={(e) => {
            return {
              x: e.x,
              y: position.y,
            };
          }}
          onDragMove={(e) => {
            setPosition({
              x: e.target.x(),
              y: e.target.y(),
            });
          }}
          onDragEnd={(e) => {
            setPosition({
              x: e.target.x(),
              y: e.target.y(),
            });
          }}
          onMouseEnter={() => {
            setCursorType('grab');
          }}
          onMouseLeave={() => {
            setCursorType('default');
          }}
        />
      )}
    </>
  );
};
export default YAxis;
