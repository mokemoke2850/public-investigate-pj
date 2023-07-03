import { Layer, Rect, Stage } from 'react-konva';
import BasicTemplate from './BasicTemplate';
import React, { useEffect, useRef, useState } from 'react';
import GridEditLayersTemplate from './konva-layers/GridEditLayersTemplate';
import MultiLayersTemplate from './konva-layers/MultiLayersTemplate';
import { Portal } from 'react-konva-utils';
import AddedTextLayerTemplate from './konva-layers/AddedTextLayerTemplate';
import { AddingImage, AddingText, SelectedIdState } from '../../@types/Konva';
import ImportImageLayerTemplate from './konva-layers/ImportImageLayerTemplate';

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
    addedText: 3,
    addedImage: 2,
  });

  const [addedTexts, setAddedTexts] = useState<AddingText[]>([]);
  const [inputAddingText, setInputAddingText] = useState('');
  const [selectedId, setSelectedId] = useState<SelectedIdState>({
    type: 'none',
    id: -1,
  });

  const [rectPosition] = useState({
    x: 20,
    y: 50,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [uploadImageName, setUploadImageName] = useState('');
  const [uploadImage, setUploadImage] = useState<File>();
  const [imageList, setImageList] = useState<AddingImage[]>([]);
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
        selectedId.type === 'text'
      ) {
        const removedTexts = addedTexts.filter(
          (text) => text.id !== selectedId.id
        );
        setAddedTexts(removedTexts);
      }
    };
    document.addEventListener('keydown', removeText);
    return () => {
      document.removeEventListener('keydown', removeText);
    };
  }, [addedTexts, selectedId]);

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length !== 1) {
      return;
    }
    setUploadImageName(e.target.files[0].name);
    setUploadImage(e.target.files[0]);
  };

  const handleAddImageClick = () => {
    if (uploadImage === undefined) {
      window.alert('select a file');
      return;
    }

    const addingFile = URL.createObjectURL(uploadImage);
    const newImageId =
      imageList.length === 0
        ? 0
        : Math.max(...imageList.map((image) => image.id)) + 1;
    setImageList([
      ...imageList,
      {
        id: newImageId,
        image: addingFile,
        x: 300,
        y: 300,
      },
    ]);
    setUploadImage(undefined);
    setUploadImageName('');
  };

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
          selectedId={selectedId}
          setSelectedTextId={setSelectedId}
          setCursorShapeFunc={setPointerShape}
        />
      ),
      zIndex: zIndex.addedText,
    },
    {
      layer: (
        <ImportImageLayerTemplate
          imageList={imageList}
          selectedId={selectedId}
          setSelectedTextId={setSelectedId}
          setCursorShapeFunc={setPointerShape}
        />
      ),
      zIndex: zIndex.addedImage,
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
          <div className="flex justify-end gap-2">
            <label
              className="rounded bg-purple-600 px-4 py-2  font-bold text-white"
              htmlFor="upload-image"
            >
              Select file
            </label>
            <p className="w-64 min-w-fit rounded bg-white pl-1 align-bottom ">
              {uploadImageName}
            </p>
            <input
              id="upload-image"
              type="file"
              accept="image/jpeg, image/png, image/jpg"
              onChange={handleUploadImage}
              className="hidden"
            />
            <button
              onClick={handleAddImageClick}
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
              Add Image
            </button>
          </div>
        </section>
        <Stage
          onClick={() => {
            setSelectedId({
              type: 'none',
              id: -1,
            });
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
