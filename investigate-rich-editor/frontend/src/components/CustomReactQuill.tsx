import { useMemo, useRef, useState } from 'react';
import ReactQuill, { UnprivilegedEditor, Quill } from 'react-quill';
// import 'react-quill/dist/quill.snow.css'; // normal css theme
import '../custom-quill.snow.css'; // custom css theme for japanese
import { BsSendPlus } from 'react-icons/bs';
import quillEmoji from 'quill-emoji';
import 'quill-emoji/dist/quill-emoji.css';
import { SaveImageResponseBody } from '../@types/ResponseBody';
const { EmojiBlot, ShortNameEmoji, ToolbarEmoji, TextAreaEmoji } = quillEmoji;
// import { createMockFetch } from '../mock/mockFetch';
import QuillImageDropAndPaste from 'quill-image-drop-and-paste';
import { ImageData } from 'quill-image-drop-and-paste';

type DeltaStatic = ReturnType<UnprivilegedEditor['getContents']>;

const BACKEND_STORAGE_URL = 'http://localhost:3000/api/upload';

Quill.register(
  {
    'formats/emoji': EmojiBlot,
    'modules/emoji-shortname': ShortNameEmoji,
    'modules/emoji-toolbar': ToolbarEmoji,
    'modules/emoji-textarea': TextAreaEmoji,
    'modules/imageDropAndPaste': QuillImageDropAndPaste,
  },
  true
);

const createJpegFileFromBase64 = (base64: string): File => {
  const bin = atob(base64.replace(/^.*,/, ''));
  const buffer = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    buffer[i] = bin.charCodeAt(i);
  }
  const blob = new Blob([buffer.buffer], {
    type: 'image/jpeg',
  });
  return new File([blob], 'image.jpg', { type: 'image/jpeg' });
};

const saveImageToS3 = async (image: File): Promise<SaveImageResponseBody> => {
  const formData = new FormData();
  formData.append('file', image);

  const response = fetch(BACKEND_STORAGE_URL, {
    method: 'POST',
    body: formData,
  }).then((res) => res.json());
  // const mockFetch = createMockFetch<SaveImageResponseBody>({
  //   imageName: saveName,
  //   imageUrl:
  //     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
  // });
  // const response = mockFetch(BACKEND_STORAGE_URL, {
  //   method: 'POST',
  //   body: formData,
  // }).then((res) => res.json());

  return response;
};

const toolBarContainer = [
  ['bold', 'italic', 'underline', 'strike'],
  [
    {
      color: [
        '#000000',
        '#e60000',
        '#ff9900',
        '#ffff00',
        '#008a00',
        '#0066cc',
        '#9933ff',
        '#ffffff',
        '#facccc',
        '#ffebcc',
        '#ffffcc',
        '#cce8cc',
        '#cce0f5',
        '#ebd6ff',
        '#bbbbbb',
        '#f06666',
        '#ffc266',
        '#ffff66',
        '#66b966',
        '#66a3e0',
        '#c285ff',
        '#888888',
        '#a10000',
        '#b26b00',
        '#b2b200',
        '#006100',
        '#0047b2',
        '#6b24b2',
        '#444444',
        '#5c0000',
        '#663d00',
        '#666600',
        '#003700',
        '#002966',
        '#3d1466',
      ],
    },
    {
      background: [
        '#000000',
        '#e60000',
        '#ff9900',
        '#ffff00',
        '#008a00',
        '#0066cc',
        '#9933ff',
        '#ffffff',
        '#facccc',
        '#ffebcc',
        '#ffffcc',
        '#cce8cc',
        '#cce0f5',
        '#ebd6ff',
        '#bbbbbb',
        '#f06666',
        '#ffc266',
        '#ffff66',
        '#66b966',
        '#66a3e0',
        '#c285ff',
        '#888888',
        '#a10000',
        '#b26b00',
        '#b2b200',
        '#006100',
        '#0047b2',
        '#6b24b2',
        '#444444',
        '#5c0000',
        '#663d00',
        '#666600',
        '#003700',
        '#002966',
        '#3d1466',
      ],
    },
  ],
  ['link', 'image', 'emoji'],
];

const saveImageURL: string[] = [];

const CustomReactQuill = () => {
  const [editorValue, setEditorValue] = useState('');
  const [editorState, setEditorState] = useState<UnprivilegedEditor>();
  const [receiveEditorValue, setReceiveEditorValue] = useState<
    DeltaStatic | undefined
  >(undefined);

  const [uploading, setUploading] = useState(false);

  const ref = useRef<ReactQuill>(null);

  const insertToEditor = (url: string) => {
    if (!ref.current?.editor) return;
    const range = ref.current.editor.getSelection();
    if (!range) return;
    ref.current.editor.insertEmbed(range.index, 'image', url);
  };

  const dropLocalImage = (
    _imageURL: string,
    _type: string,
    imageData: ImageData
  ) => {
    const file = imageData.toFile();
    if (!file) return;
    uploadFile(file);
  };

  const uploadFile = (file: File) => {
    // file type is only image.
    if (/^image\//.test(file.type)) {
      setUploading(true);
      saveImageToS3(file)
        .then((res) => {
          insertToEditor(res.downloadUrl);
          saveImageURL.push(res.downloadUrl);
        })
        .finally(() => {
          setUploading(false);
        });
    } else {
      alert('画像のみアップロードできます。');
    }
  };

  const selectLocalImage = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.click();

    input.onchange = () => {
      if (!input.files) return;
      const file = input.files[0];
      uploadFile(file);
    };
  };

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: toolBarContainer,
        handlers: {
          image: selectLocalImage,
        },
      },
      clipboard: {
        matchers: [
          [
            'IMG',
            (
              _node: unknown,
              delta: { ops: { insert: { image: string } }[] }
            ) => {
              const base64Data = delta.ops?.[0].insert.image ?? '';
              if (!base64Data) return delta;
              const file = createJpegFileFromBase64(base64Data);
              setUploading(true);
              saveImageToS3(file)
                .then((res) => {
                  return res.downloadUrl;
                })
                .then((url) => {
                  // insert image to editor instead of base64
                  insertToEditor(url);
                })
                .finally(() => {
                  setUploading(false);
                });
              // overwrite delta to prevent insert image from base64
              return { delta, ops: [] };
            },
          ],
        ],
      },
      'emoji-toolbar': true,
      'emoji-textarea': false,
      'emoji-shortname': true,
      imageDropAndPaste: {
        handler: dropLocalImage,
      },
    };
  }, []);

  const handleOnSave = () => {
    if (!editorState) return;
    localStorage.setItem('quill-content', editorValue);
  };

  const handleOnLoad = () => {
    const raw = localStorage.getItem('quill-content');
    if (!raw) return;
    setEditorValue(raw);
  };

  const handleSendMessage = () => {
    if (uploading) return;
    const message = editorState?.getText();
    const rawMessage = editorState?.getContents();
    console.log(rawMessage);
    console.log(JSON.stringify(rawMessage));
    const uploadImageURL = rawMessage?.ops?.map((val) => val.insert?.image);
    console.log('saveImageURL', saveImageURL);
    console.log('uploadImageURL', uploadImageURL);
    const deleteImageURL = saveImageURL.filter(
      (val) => !uploadImageURL?.includes(val)
    );
    console.log('deleteImageURL', deleteImageURL);
    // window.alert(`Send a following message.\n${message}`);
    setReceiveEditorValue(rawMessage ?? undefined);
  };

  return (
    <>
      <div>
        <button onClick={handleOnSave}>Save</button>
        <button onClick={handleOnLoad}>Load</button>
      </div>
      <div style={{ width: 750 }}>
        <ReactQuill
          theme="snow"
          value={editorValue}
          onChange={(value, _delta, _source, editor) => {
            setEditorValue(value);
            setEditorState(editor);
          }}
          style={{
            width: '100%',
            border: '1px solid #ccc',
            borderRadius: 5,
            borderBottom: 'none',
            cursor: uploading ? 'wait' : 'text',
          }}
          modules={modules}
          placeholder="Write something..."
          ref={ref}
        />
        <div
          style={{
            width: '100%',
            border: '1px solid #ccc',
            paddingTop: '3px',
            paddingBottom: '3px',
          }}
        >
          <button
            style={{
              width: 50,
              backgroundColor: 'transparent',
              border: 'none',
              cursor: uploading ? 'wait' : 'pointer',
            }}
            onClick={handleSendMessage}
          >
            <BsSendPlus />
          </button>
        </div>
      </div>
      <div style={{ width: 750 }}>
        <h2>Receive the Message</h2>
        <ReactQuill
          theme="snow"
          value={receiveEditorValue}
          readOnly={true}
          modules={{ toolbar: false }}
          style={{
            width: '100%',
            border: '1px solid #ccc',
            borderRadius: 5,
            borderBottom: 'none',
            cursor: uploading ? 'wait' : 'text',
          }}
        />
      </div>
    </>
  );
};
export default CustomReactQuill;
