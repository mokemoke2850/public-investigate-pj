import { useEffect, useState, useMemo } from 'react';
import { EditorState, convertToRaw, convertFromRaw, RichUtils } from 'draft-js';
import Editor, { createEditorStateWithText } from '@draft-js-plugins/editor';
import 'draft-js/dist/Draft.css';
import createInlineToolbarPlugin from '@draft-js-plugins/inline-toolbar';
import { BoldButton, UnderlineButton } from '@draft-js-plugins/buttons';
import createLinkPlugin from '@draft-js-plugins/anchor';
import '@draft-js-plugins/inline-toolbar/lib/plugin.css';

const CustomDraftjsEditor = () => {
  const [editorState, setEditorState] = useState(() =>
    createEditorStateWithText('')
  );
  const [readOnly, setReadOnly] = useState(true);
  const [plugins, InlineToolbar, LinkButton] = useMemo(() => {
    const linkPlugin = createLinkPlugin();
    const inlineToolbarPlugin = createInlineToolbarPlugin();
    return [
      [inlineToolbarPlugin, linkPlugin],
      inlineToolbarPlugin.InlineToolbar,
      linkPlugin.LinkButton,
    ];
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem('text-content');
    if (!raw) return;
    const contentState = convertFromRaw(JSON.parse(raw));
    const newEditorState = EditorState.createWithContent(contentState);
    setEditorState(newEditorState);
  }, []);

  const handleOnSave = () => {
    const contentState = editorState.getCurrentContent();
    const raw = convertToRaw(contentState);
    localStorage.setItem('text-content', JSON.stringify(raw, null, 2));
    setReadOnly(true);
  };

  const handleOnEdit = () => {
    setReadOnly(false);
  };

  const handleOnLoad = () => {
    const raw = localStorage.getItem('text-content');
    if (!raw) return;
    const contentState = convertFromRaw(JSON.parse(raw));
    const newEditorState = EditorState.createWithContent(contentState);
    setEditorState(newEditorState);
  };

  const toggleBold = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
  };

  return (
    <>
      <div>
        {/* <button onClick={handleOnLoad}>Load</button> */}
        {readOnly ? (
          <button onClick={() => handleOnEdit()}>Edit</button>
        ) : (
          <button onClick={() => handleOnSave()}>Save</button>
        )}
      </div>
      <div>
        <button
          onClick={(e) => {
            toggleBold(e);
          }}
        >
          Bold
        </button>
      </div>
      <Editor
        editorState={editorState}
        onChange={setEditorState}
        plugins={plugins}
        placeholder="Input here!"
        readOnly={readOnly}
      />
      <InlineToolbar>
        {(externalProps) => (
          <>
            <BoldButton {...externalProps} />
            <UnderlineButton {...externalProps} />
            <LinkButton {...externalProps} />
          </>
        )}
      </InlineToolbar>
    </>
  );
};
export default CustomDraftjsEditor;
