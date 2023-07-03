import React from 'react';
import { Layer } from 'react-konva';

interface MultiLayersTemplateProps {
  layers: {
    layer: JSX.Element;
    zIndex: number;
  }[];
}
const MultiLayersTemplate: React.FC<MultiLayersTemplateProps> = (props) => {
  const { layers } = props;
  // canvaではLayerの描画があとになるほど手前に描画される
  const displayLayers = layers.sort((a, b) => a.zIndex - b.zIndex);
  return (
    <>
      {displayLayers.map((layer) => layer.layer)}
      <Layer name="top-layer" />
    </>
  );
};
export default MultiLayersTemplate;
