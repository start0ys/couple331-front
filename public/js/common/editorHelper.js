import Editor from '@toast-ui/editor';
import '@toast-ui/editor/dist/toastui-editor.css';

class EditorHelper {
    constructor() {
        this.editors = {};
    }

    init(editorId, isView, option = {}) {
        const editorEl = document.getElementById(editorId);

        const defaultOption = {
            el: editorEl,
        };

        if(isView) {
            defaultOption.viewer = true;
            Editor.factory(Object.assign({}, defaultOption, option));
        } else {
            defaultOption.initialEditType = 'wysiwyg';
            const editor = new Editor(Object.assign({}, defaultOption, option));
            this.editors[editorId] = editor;
        }
    }
}

export default new EditorHelper();