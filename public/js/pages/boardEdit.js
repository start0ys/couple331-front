import EditorHelper from "../common/editorHelper.js";

const EDITOR_ID = 'editor';

document.addEventListener('DOMContentLoaded', () => {
    initEditor();
})

const initEditor = () => {
    const option = {

    };

    EditorHelper.init(EDITOR_ID, false, option);
}