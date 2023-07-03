import { Layer, Rect, Stage } from 'react-konva';
import BasicTemplate from './BasicTemplate';
import React, { useEffect, useRef, useState } from 'react';
import GridEditLayersTemplate from './konva-layers/GridEditLayersTemplate';
import MultiLayersTemplate from './konva-layers/MultiLayersTemplate';
import { Portal } from 'react-konva-utils';
import AddedTextLayerTemplate from './konva-layers/AddedTextLayerTemplate';
import { AddingText } from '../../@types/Konva';

const testData = [
  {
    x: 1,
    y: 2,
  },
  {
    x: 1,
    y: 1,
  },
  {
    x: 3,
    y: 2,
  },
  {
    x: 3,
    y: 3,
  },
  {
    x: 4,
    y: 4,
  },
];

const downloadURI = (uri: string, name: string) => {
  const link = document.createElement('a');
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const KonvaTemplate = () => {
  const stageRef = useRef<HTMLCanvasElement>(null);
  const [pointerShape, setPointerShape] = useState('default');
  const [zIndex, setZIndex] = useState({
    grid: 1,
    rect: 0,
    addedText: 2,
  });

  const [addedTexts, setAddedTexts] = useState<AddingText[]>([]);
  const [inputAddingText, setInputAddingText] = useState('');
  const [selectedTextId, setSelectedTextId] = useState(-1);

  const [rectPosition] = useState({
    x: 20,
    y: 50,
  });
  const [isDragging, setIsDragging] = useState(false);
  // download the image
  const handleExport = () => {
    if (!stageRef.current) {
      return;
    }
    const uri = stageRef.current.toDataURL();
    downloadURI(uri, 'sample.png');
  };

  // add a text to canvas
  const handleAddTextClick = () => {
    if (inputAddingText === '') {
      return;
    }
    const newId =
      addedTexts.length === 0
        ? 0
        : Math.max(...addedTexts.map((text) => text.id)) + 1;
    const newText: AddingText = {
      id: newId,
      text: inputAddingText,
      x: 400,
      y: 300,
    };
    setAddedTexts([...addedTexts, newText]);
    setInputAddingText('');
  };

  useEffect(() => {
    const removeText = (e: KeyboardEvent) => {
      const pressKey = e.key;
      if (
        (pressKey === 'Backspace' || pressKey === 'Delete') &&
        selectedTextId !== -1
      ) {
        const removedTexts = addedTexts.filter(
          (text) => text.id !== selectedTextId
        );
        setAddedTexts(removedTexts);
      }
    };
    document.addEventListener('keydown', removeText);
    return () => {
      document.removeEventListener('keydown', removeText);
    };
  }, [addedTexts, selectedTextId]);

  const layers = [
    {
      layer: (
        <Layer>
          <Portal selector=".top-layer" enabled={isDragging}>
            <Rect
              x={rectPosition.x}
              y={rectPosition.y}
              width={100}
              height={100}
              fill="red"
              shadowBlur={10}
              draggable
              onDragStart={() => {
                setIsDragging(true);
              }}
              onDragMove={() => {
                setIsDragging(true);
              }}
              onDragEnd={() => {
                setIsDragging(false);
              }}
            />
          </Portal>
        </Layer>
      ),
      zIndex: zIndex.rect,
    },
    {
      layer: (
        <GridEditLayersTemplate
          crossPoints={testData}
          setCursorShapeFunc={setPointerShape}
        />
      ),
      zIndex: zIndex.grid,
    },
    {
      layer: (
        <AddedTextLayerTemplate
          texts={addedTexts}
          setAddedTexts={(value: AddingText[]) => {
            setAddedTexts(value);
          }}
          selectedTextId={selectedTextId}
          setSelectedTextId={setSelectedTextId}
          setCursorShapeFunc={setPointerShape}
        />
      ),
      zIndex: zIndex.addedText,
    },
  ];

  return (
    <BasicTemplate className="h-screen bg-zinc-950">
      <section className="container h-screen bg-zinc-950">
        <section className="flex gap-3 p-2">
          <button
            onClick={(e) => {
              setZIndex({ ...zIndex, rect: 100 });
            }}
            className="
                whitespace-nowrap
                rounded
                bg-purple-600
                px-4
                py-2
                font-bold
                text-white
                duration-200
                hover:bg-purple-700
                active:bg-purple-800
                active:shadow-none
              "
          >
            Change ZIndex
          </button>
          <button
            onClick={handleExport}
            className="
                whitespace-nowrap
                rounded 
                bg-pink-500
                px-4
                py-2 
                font-bold 
                text-white 
                duration-200
                hover:bg-pink-600
                active:bg-pink-700
                "
          >
            Export to Image
          </button>
          <div className="flex items-end gap-1">
            <input
              onChange={(e) => {
                setInputAddingText(e.target.value);
              }}
              value={inputAddingText}
              className="
              m-0
              h-full
              rounded
              border-2
              border-slate-900
              outline-none
              focus:border-purple-600
              "
            />
            <button
              onClick={handleAddTextClick}
              className="
                  flex
                  h-8
                  items-center
                  rounded
                  border-2
                  bg-slate-50
                  px-4
                  py-2
                  font-bold
                  hover:bg-slate-100
                  active:bg-slate-200
                "
            >
              Add Text
            </button>
          </div>
        </section>
        <Stage
          onClick={() => {
            setSelectedTextId(-1);
          }}
          className="w-[1000px] border-2 border-slate-400 bg-white"
          width={1000}
          height={500}
          style={{
            cursor: pointerShape,
          }}
          ref={stageRef}
        >
          <MultiLayersTemplate layers={layers} />
        </Stage>
      </section>
    </BasicTemplate>
  );
};
export default KonvaTemplate;
