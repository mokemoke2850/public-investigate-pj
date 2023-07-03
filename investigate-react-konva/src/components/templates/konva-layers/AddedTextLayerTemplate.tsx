import React from 'react';
import { Layer } from 'react-konva';
import { AddingText } from '../../../@types/Konva';
import TransformerText from '../../parts/konva-parts/TransformerText';

interface AddedTextLayerTemplateProps {
  texts: AddingText[];
  setAddedTexts: (value: AddingText[]) => void;
  setCursorShapeFunc: (value: string) => void;
  selectedTextId: number;
  setSelectedTextId: (value: number) => void;
}

const AddedTextLayerTemplate: React.FC<AddedTextLayerTemplateProps> = (
  props
) => {
  const { texts, setCursorShapeFunc, selectedTextId, setSelectedTextId } =
    props;
  return (
    <Layer>
      {texts.map((text) => (
        <TransformerText
          key={text.id}
          text={text}
          setCursorShapeFunc={setCursorShapeFunc}
          isSelected={selectedTextId === text.id}
          setSelectedId={(value: number) => {
            setSelectedTextId(value);
          }}
        />
      ))}
    </Layer>
  );
};
export default AddedTextLayerTemplate;
