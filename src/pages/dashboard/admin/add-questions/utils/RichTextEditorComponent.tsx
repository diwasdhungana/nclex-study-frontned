import './richTextStyle.scss';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor, EditorContent } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import Document from '@tiptap/extension-document';
import Gapcursor from '@tiptap/extension-gapcursor';
import Paragraph from '@tiptap/extension-paragraph';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import Text from '@tiptap/extension-text';
import Image from '@tiptap/extension-image';
import { useFileUpload } from '@/hooks/api/fileUpload';
import {
  TbTable,
  TbColumnInsertLeft,
  TbColumnInsertRight,
  TbColumnRemove,
  TbRowInsertTop,
  TbRowInsertBottom,
  TbRowRemove,
  TbTableOff,
  TbPhoto,
} from 'react-icons/tb';
import { notifications } from '@mantine/notifications';

export function RichTextEditorComponent({
  content,
  setContent,
  index,
}: {
  content: string;
  setContent: (item: any, index: number) => void;
  index: number;
}): JSX.Element {
  const { mutate: uploadImage, isPending: uploadImagePending } = useFileUpload();
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Document,
      Paragraph,
      Text,
      Gapcursor,
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'tiptap-table',
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
      Image.configure({
        HTMLAttributes: {
          class: 'editor-image',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML(), index ? index : 0);
    },
  });

  // Table functions (keeping existing ones)
  const addTable = () => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const addColumnBefore = () => {
    editor?.chain().focus().addColumnBefore().run();
  };

  const addColumnAfter = () => {
    editor?.chain().focus().addColumnAfter().run();
  };

  const deleteColumn = () => {
    editor?.chain().focus().deleteColumn().run();
  };

  const addRowBefore = () => {
    editor?.chain().focus().addRowBefore().run();
  };

  const addRowAfter = () => {
    editor?.chain().focus().addRowAfter().run();
  };

  const deleteRow = () => {
    editor?.chain().focus().deleteRow().run();
  };

  const deleteTable = () => {
    editor?.chain().focus().deleteTable().run();
  };

  const isTableSelected = () => {
    return editor?.isActive('table') ?? false;
  };

  // Image handling functions
  const addImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async (e: Event) => {
      // Type assertion to make TypeScript understand this is an input element
      const target = e.target as HTMLInputElement;

      if (!target.files?.length) return;
      const file = target.files[0];

      console.log('file', file);
      const formData = new FormData();
      formData.append('file', file);

      uploadImage(
        { variables: formData },
        {
          onSuccess: (data) => {
            editor?.chain().focus().setImage({ src: data }).run();
          },
          onError: (error) => {
            console.log('error', error);
            if (error.messages[0]) {
              notifications.show({ message: error.messages[0], color: '#ff4136' });
            } else {
              notifications.show({ message: 'Uploads will be available soon.', color: '#ff4136' });
            }
          },
        }
      );
    };

    // Move this outside of the onchange handler
    input.click();
  };
  return (
    <div>
      <RichTextEditor editor={editor} aria-disabled={uploadImagePending}>
        <RichTextEditor.Toolbar sticky stickyOffset={60}>
          {/* Existing control groups */}
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.ClearFormatting />
            <RichTextEditor.Highlight />
            <RichTextEditor.Code />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.H1 />
            <RichTextEditor.H2 />
            <RichTextEditor.H3 />
            <RichTextEditor.H4 />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Blockquote />
            <RichTextEditor.Hr />
            <RichTextEditor.BulletList />
            <RichTextEditor.OrderedList />
            <RichTextEditor.Subscript />
            <RichTextEditor.Superscript />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.AlignLeft />
            <RichTextEditor.AlignCenter />
            <RichTextEditor.AlignJustify />
            <RichTextEditor.AlignRight />
          </RichTextEditor.ControlsGroup>

          {/* Table Controls Group */}
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Control onClick={addTable} title="Insert Table">
              <TbTable size={16} />
            </RichTextEditor.Control>
            <RichTextEditor.Control
              onClick={addColumnBefore}
              title="Add Column Before"
              disabled={!isTableSelected()}
            >
              <TbColumnInsertLeft size={16} />
            </RichTextEditor.Control>
            <RichTextEditor.Control
              onClick={addColumnAfter}
              title="Add Column After"
              disabled={!isTableSelected()}
            >
              <TbColumnInsertRight size={16} />
            </RichTextEditor.Control>
            <RichTextEditor.Control
              onClick={deleteColumn}
              title="Delete Column"
              disabled={!isTableSelected()}
            >
              <TbColumnRemove size={16} />
            </RichTextEditor.Control>
            <RichTextEditor.Control
              onClick={addRowBefore}
              title="Add Row Before"
              disabled={!isTableSelected()}
            >
              <TbRowInsertTop size={16} />
            </RichTextEditor.Control>
            <RichTextEditor.Control
              onClick={addRowAfter}
              title="Add Row After"
              disabled={!isTableSelected()}
            >
              <TbRowInsertBottom size={16} />
            </RichTextEditor.Control>
            <RichTextEditor.Control
              onClick={deleteRow}
              title="Delete Row"
              disabled={!isTableSelected()}
            >
              <TbRowRemove size={16} />
            </RichTextEditor.Control>
            <RichTextEditor.Control
              onClick={deleteTable}
              title="Delete Table"
              disabled={!isTableSelected()}
            >
              <TbTableOff size={16} />
            </RichTextEditor.Control>
          </RichTextEditor.ControlsGroup>

          {/* Image Control Group */}
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Control onClick={addImage} title="Add Image">
              <TbPhoto size={16} />
            </RichTextEditor.Control>
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Undo />
            <RichTextEditor.Redo />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>
        <RichTextEditor.Content />
      </RichTextEditor>
    </div>
  );
}
