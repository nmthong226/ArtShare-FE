import { useEditor, EditorContent } from "@tiptap/react";
import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import Color from "@tiptap/extension-color";
import Document from "@tiptap/extension-document";
import FontFamily from "@tiptap/extension-font-family";
import Heading from "@tiptap/extension-heading";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
import Gapcursor from "@tiptap/extension-gapcursor";
import Italic from "@tiptap/extension-italic";
import Image from "@tiptap/extension-image";
import ImageResize from "tiptap-extension-resize-image";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Text from "@tiptap/extension-text";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Paragraph from "@tiptap/extension-paragraph";
import History from "@tiptap/extension-history";
import Underline from "@tiptap/extension-underline";
import OrderedList from "@tiptap/extension-ordered-list";
import Youtube from "@tiptap/extension-youtube";
import Placeholder from "@tiptap/extension-placeholder";
import { FontSizeExtension } from "../extensions/font-size";
import { LineHeightExtension } from "../extensions/line-height";
import { forwardRef, useImperativeHandle } from "react";
import { useEditorStore } from "../stores/use-editor-store";

import './Editor.css';

export type EditorHandle = {
  getContent: () => string | undefined;
  setContent: (content: string) => void;
  getImages: () => { src: string; alt?: string; title?: string }[];
  focus: () => void;
};

const Editor = forwardRef<EditorHandle>((_, ref) => {
  const { setEditor } = useEditorStore();

  const editor = useEditor(
    {
      /**
       * This must be true when you use the two-argument overload.
       * It tells Tiptap: "Create the Editor immediately and keep it mounted."
       */
      immediatelyRender: true,

      editable: true,
      content: "",
      extensions: [
        Bold,
        BulletList,
        Color,
        Document,
        FontFamily,
        FontSizeExtension,
        Gapcursor,
        Heading.configure({ levels: [1, 2, 3] }),
        Highlight.configure({ multicolor: true }),
        History,
        ListItem,
        LineHeightExtension.configure({
          types: ["heading", "paragraph"],
          defaultLineHeight: "normal",
        }),
        Paragraph,
        Italic,
        Image,
        ImageResize,
        Table.configure({ resizable: true }),
        TableRow,
        TableHeader,
        TableCell,
        TaskList,
        TaskItem.configure({ nested: true }),
        Text,
        TextAlign.configure({ types: ["heading", "paragraph"] }),
        TextStyle,
        Underline,
        OrderedList,
        Placeholder.configure({ placeholder: "Write something …" }),
        Youtube.configure({
          inline: true,
          controls: true,
          allowFullscreen: true,
        }),
        Link.configure({ openOnClick: false, autolink: true }),
      ],
      editorProps: {
        attributes: {
          class:
            `focus:outline-none print:border-0 bg-white border border-[#C7C7C7] flex flex-col min-h-full w-[816px] cursor-text reset-tailwind p-10`,
          style: "all:revert;",
        },
      },

      /**
       * Save the Editor instance once, in the global store.
       * Do not re-save on every transaction.
       */
      onCreate({ editor }) {
        setEditor(editor);
      },
    },
    [],
  );

  useImperativeHandle(ref, () => ({
    getContent: () => editor?.getHTML(),
    setContent: (content: string) => {
      if (editor) {
        editor.commands.setContent(content);
        setTimeout(() => {
          if (editor && !editor.isDestroyed) {
            editor.chain().focus().run();
          }
        }, 50);
      }
    },
    getImages: () => {
      const images: { src: string; alt?: string; title?: string }[] = [];
      editor?.state.doc.descendants((node) => {
        if (node.type.name === "image") {
          images.push({
            src: node.attrs.src,
            alt: node.attrs.alt,
            title: node.attrs.title,
          });
        }
      });
      return images;
    },
    focus: () => {
      if (editor && !editor.isDestroyed) {
        editor.chain().focus().run();
        setTimeout(() => {
          const dom = document.querySelector(".tiptap");
          if (dom) {
            (dom as HTMLElement).focus();
          }
        }, 10);
      }
    },
  }));

  return <EditorContent editor={editor} className="max-w-full prose" />;
});

export default Editor;
