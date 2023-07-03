import React from 'react';
import { Layer } from 'react-konva';
import { AddingText, SelectedIdState } from '../../../@types/Konva';
import TransformerText from '../../parts/konva-parts/TransformerText';

interface AddedTextLayerTemplateProps {
  texts: AddingText[];
  setAddedTexts: (value: AddingText[]) => void;
  setCursorShapeFunc: (value: string) => void;
  selectedId: SelectedIdState;
  setSelectedTextId: (value: SelectedIdState) => void;
}

const AddedTextLayerTemplate: React.FC<AddedTextLayerTemplateProps> = (
  props
) => {
  const { texts, setCursorShapeFunc, selectedId, setSelectedTextId } = props;
  return (
    <Layer>
      {texts.map((text) => (
        <TransformerText
          key={text.id}
          text={text}
          setCursorShapeFunc={setCursorShapeFunc}
          isSelected={selectedId.type === 'text' && selectedId.id === text.id}
          setSelectedId={setSelectedTextId}
        />
      ))}
    </Layer>
  );
};
export default AddedTextLayerTemplate;
