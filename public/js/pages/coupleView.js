import EditorHelper from "../common/editorHelper.js";

const EDITOR_ID = 'editor';

document.addEventListener('DOMContentLoaded', () => {
    initEditor();
});

const initEditor = () => {
    const option = {
        initialValue: '<h3>테스트</h3><div>테스트드드으</div>'
    };

    EditorHelper.init(EDITOR_ID, true, option);
}