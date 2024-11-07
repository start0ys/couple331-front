import Editor from '@toast-ui/editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import "tui-color-picker/dist/tui-color-picker.css";
import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";
import colorSyntax from "@toast-ui/editor-plugin-color-syntax";

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
            defaultOption.previewStyle =  'vertical';
            defaultOption.plugins=[colorSyntax];
            const editor = new Editor(Object.assign({}, defaultOption, option));
            this.editors[editorId] = editor;
        }
    }

    getEditor(editorId) {
        return this.editors[editorId] || null;
    }

    getHTML(editorId) {
        const editor = this.getEditor(editorId);
        if (!editor) {
            return '';
        }

        return editor.getHTML() || '';
    }

    getEditorElements(editorId) {
        const editor = this.getEditor(editorId);
        if (!editor) {
            return '';
        }
        
        return editor.getEditorElements() || '';
    }

}

export default new EditorHelper();