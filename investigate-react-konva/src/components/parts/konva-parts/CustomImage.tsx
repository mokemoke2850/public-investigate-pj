import React, { useEffect, useRef } from 'react';
import { Image, Transformer } from 'react-konva';
import { useImage } from 'react-konva-utils';
import { AddingImage, SelectedIdState } from '../../../@types/Konva';

interface CustomImageProps {
  addingImage: AddingImage;
  isSelected: boolean;
  setCursorShapeFunc: (value: string) => void;
  setSelectedId: (value: SelectedIdState) => void;
}
const CustomImage: React.FC<CustomImageProps> = (props) => {
  const { addingImage, isSelected, setCursorShapeFunc, setSelectedId } = props;
  const [image] = useImage(addingImage.image);
  const imageRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([imageRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Image
        image={image}
        x={addingImage.x}
        y={addingImage.y}
        ref={imageRef}
        draggable
        onClick={(e) => {
          e.cancelBubble = true;
          e.evt.stopPropagation();
          setSelectedId({
            type: 'image',
            id: addingImage.id,
          });
        }}
        onMouseEnter={() => setCursorShapeFunc('grab')}
        onMouseLeave={() => setCursorShapeFunc('default')}
      />
      {isSelected && <Transformer ref={trRef} />}
    </>
  );
};
export default CustomImage;
