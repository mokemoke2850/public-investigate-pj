# Investigate Rich Editor

## Notes

### [Draft.js](https://draftjs.org/)

#### Fix for Draft.js Not Displaying in Vite

You need to add the following configuration to `vite.config.js`. This is necessary because Vite doesn't automatically define a global field.

```ts
export default defineConfig({
  define: {
    global: {},
  },
});
```

### [Quill](https://quilljs.com/)

- [ReactQuill](https://github.com/zenoamaro/react-quill)

#### Add Color Palette to Toolbar

[WYSIWYG エディタ Quill を使って文字の色を変更するまで](https://qiita.com/t-kigi/items/cbb4d77352db26ea0c8a)

#### Change Language of the Components

[Translate into non English language? #411](https://github.com/zenoamaro/react-quill/issues/411)

1. Copy the `quill.snow.css` file from `node_modules/quill/dist` to `src/assets/quill.snow.css` and modify the language in the copied file.

2. Import the modified file into your Quill Editor Component.

#### Add Emoji Selector to Toolbar

[quill-emoji](https://github.com/contentco/quill-emoji)

[How can I integrate emoji in react-quill? #356](https://github.com/zenoamaro/react-quill/issues/356#issuecomment-501175331)

You have to import the `quill-emoji` module and add it to the toolbar.

However, the extension doesn't work when you use it like the official page of `quill-emoji`. Instead, you can use the following code, which is referenced from the above issue.

```ts
import quillEmoji from 'quill-emoji';
import 'quill-emoji/dist/quill-emoji.css';
const { EmojiBlot, ShortNameEmoji, ToolbarEmoji, TextAreaEmoji } = quillEmoji;

Quill.register(
  {
    'formats/emoji': EmojiBlot,
    'modules/emoji-shortname': ShortNameEmoji,
    'modules/emoji-toolbar': ToolbarEmoji,
    'modules/emoji-textarea': TextAreaEmoji,
  },
  true
);

const modules = {
  toolbar: [... , ['emoji']], // Add your toolbar options
  'emoji-toolbar': true,
  'emoji-textarea': false,
  'emoji-shortname': true,
};
```

#### Add Image Selector to Toolbar

You have to add the module like below.

```ts
const modules = {
  toolbar: [... , ['image']], // Add your toolbar options
};

```

#### Upload a Image instead of a Base64.

[ReactQuill で画像を Amazon S3 に保存する方法](https://zenn.dev/lilac/articles/d3351028c02ed1)

You upload a image from the image selector. The image is converted to a Base64 string and inserted into the editor. However, the image is not uploaded to the server. If you want to upload and show the image from the server, you have to add the handler like below.

```ts
// you can use any image upload handler you want
const modules = {
  toolbar: {
    container: toolBarContainer,
    handlers: selectLocalImage(),
  },
};
```

#### Upload a Image to the Server from Clipboard

Even when you set the above handler, you paste a image from the clipboard, the image is converted to a Base64 string and inserted into the editor. If you want to upload and show the image from the server, you have to overwrite the logic which is executed when pasting a image like below.

```ts
const modules = {
  toolbar: {
    container: toolBarContainer,
    handlers: selectLocalImage(),
  },
  clipboard: {
    matchers: [
      [
        'IMG',
        (_node: unknown, delta: { ops: { insert: { image: string } }[] }) => {
          const base64Data = delta.ops?.[0].insert.image ?? '';
          if (!base64Data) return delta;
          const file = createJpegFileFromBase64(base64Data);
          setUploading(true);
          const uuid = uuidv4();
          saveImageToS3(file, `file_${uuid}`)
            .then((res) => {
              return res.imageUrl;
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
};
```

#### Upload a Image to the Server from Drag and Drop

[quill-image-drop-and-paste](https://github.com/chenjuneking/quill-image-drop-and-paste)
