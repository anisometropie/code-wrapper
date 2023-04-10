const { Plugin } = require('obsidian');

class RustCodeWrapper extends Plugin {
  async onload() {
    this.addCommand({
      id: 'wrap-selected-text-with-rust-code-block',
      name: 'Wrap selected text with Rust code block',
      callback: this.wrapSelectedText.bind(this),
    });
  }

  async wrapSelectedText() {
    const activeLeaf = this.app.workspace.activeLeaf;
    if (activeLeaf.view.getViewType() === 'markdown') {
      const editor = activeLeaf.view.editor;
      const selectedText = editor.getSelection();
      const cursor = editor.getCursor('from');
      const endCursor = editor.getCursor('to');
      const line = editor.getLine(cursor.line);
      const lineAfter = editor.getLine(endCursor.line);

      let beforeSelectedText = "";
      if (cursor.ch > 0) {
        beforeSelectedText = line.slice(0, cursor.ch);
      }

      const afterSelectedText = lineAfter.slice(endCursor.ch);

      const wrappedText = `${beforeSelectedText.trim() ? '\n' : ''}\`\`\`rust\n${selectedText}\n\`\`\`${/\S/.test(afterSelectedText) ? '\n' : ''}`;
      editor.replaceRange(wrappedText, editor.getCursor('from'), editor.getCursor('to'));
    } else {
      new Notice('Please make sure you are in a Markdown editor.');
    }
  }
}

module.exports = RustCodeWrapper;