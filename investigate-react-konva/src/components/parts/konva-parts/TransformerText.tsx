import { Text, Transformer } from 'react-konva';
import { AddingText, SelectedIdState } from '../../../@types/Konva';
import React, { useEffect, useRef } from 'react';

interface TransformerTextProps {
  text: AddingText;
  isSelected: boolean;
  setCursorShapeFunc: (value: string) => void;
  setSelectedId: (value: SelectedIdState) => void;
}

const TransformerText: React.FC<TransformerTextProps> = (props) => {
  const { text, isSelected, setCursorShapeFunc, setSelectedId } = props;
  const textRef = useRef<any>(null);
  const trRef = useRef<any>(null);
  useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([textRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);
  return (
    <>
      <Text
        text={text.text}
        x={text.x}
        y={text.y}
        scaleX={text.scaleX}
        scaleY={text.scaleY}
        ref={textRef}
        draggable
        onClick={(e) => {
          e.cancelBubble = true;
          e.evt.stopPropagation();
          setSelectedId({
            type: 'text',
            id: text.id,
          });
        }}
        onMouseEnter={() => setCursorShapeFunc('grab')}
        onMouseLeave={() => setCursorShapeFunc('default')}
        onTransformEnd={(e) => {
          const node = textRef.current;
          if (!node) return;

          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
        }}
      />
      {isSelected && <Transformer ref={trRef} />}
    </>
  );
};
export default TransformerText;
