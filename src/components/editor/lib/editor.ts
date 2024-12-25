import { Editor, isTextSelection } from '@tiptap/core';

export const isTextSelected = (editor: Editor) => {
  const {
    state: {
      doc,
      selection,
      selection: { empty, from, to }
    }
  } = editor;

  // Sometime check for `empty` is not enough.
  // Doubleclick an empty paragraph returns a node size of 2.
  // So we check also for an empty text size.
  const isEmptyTextBlock =
    !doc.textBetween(from, to).length && isTextSelection(selection);
  //   console.log({ empty, isEmptyTextBlock, edit: editor.isEditable });
  if (empty || isEmptyTextBlock || !editor.isEditable) {
    return false;
  }

  return true;
};

export default isTextSelected;
