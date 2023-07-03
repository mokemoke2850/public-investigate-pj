import { Rect, Text } from 'react-konva';
import { Position } from '../../../@types/Konva';
import React from 'react';

interface XAxisProps {
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

const XAxis: React.FC<XAxisProps> = (props) => {
  const { position, setPosition, color, setCursorType, length, label } = props;

  return (
    <>
      <Rect
        x={position.x}
        y={position.y}
        width={length}
        height={3}
        fill={color ?? 'black'}
        draggable
        dragBoundFunc={(e) => {
          return {
            x: position.x,
            y: e.y,
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
          offsetX={20}
          offsetY={6}
          fontSize={16}
          dragBoundFunc={(e) => {
            return {
              x: position.x,
              y: e.y,
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
export default XAxis;
