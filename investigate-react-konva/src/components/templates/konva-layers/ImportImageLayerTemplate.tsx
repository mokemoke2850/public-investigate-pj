import React from 'react';
import { Layer } from 'react-konva';
import CustomImage from '../../parts/konva-parts/CustomImage';
import { AddingImage, SelectedIdState } from '../../../@types/Konva';

interface ImportImageLayerTemplateProps {
  imageList: AddingImage[];
  setCursorShapeFunc: (value: string) => void;
  selectedId: SelectedIdState;
  setSelectedTextId: (value: SelectedIdState) => void;
}

const ImportImageLayerTemplate: React.FC<ImportImageLayerTemplateProps> = (
  props
) => {
  const { imageList, setCursorShapeFunc, selectedId, setSelectedTextId } =
    props;
  return (
    <Layer>
      {imageList.map((image) => (
        <CustomImage
          addingImage={image}
          key={image.id}
          isSelected={selectedId.type === 'image' && selectedId.id === image.id}
          setSelectedId={setSelectedTextId}
          setCursorShapeFunc={setCursorShapeFunc}
        />
      ))}
    </Layer>
  );
};
export default ImportImageLayerTemplate;
