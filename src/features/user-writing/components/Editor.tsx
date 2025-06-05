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
import { forwardRef, useImperativeHandle, useState } from "react";
import { useEditorStore } from "../stores/use-editor-store";
import { Node as ProseMirrorNode } from "@tiptap/pm/model";
import { EditorView } from "@tiptap/pm/view";
import { Mark, MarkType, ResolvedPos } from "@tiptap/pm/model";
import "./Editor.css";

export type EditorHandle = {
  getContent: () => string | undefined;
  setContent: (content: string) => void;
  getImages: () => { src: string; alt?: string; title?: string }[];
  focus: () => void;
};

const getMarkRange = ($pos?: ResolvedPos, type?: MarkType) => {
  if (!$pos || !type) {
    return false;
  }

  // Get the node at or before the cursor.
  // If $pos.parentOffset is 0, it means cursor is at the start of a node or parent.
  // If $pos.textOffset is 0 but $pos.parentOffset > 0, cursor is at the start of an inline node.
  // We want the node that the cursor is "in" or immediately to its left.
  const nodeBefore = $pos.nodeBefore;
  const nodeAfter = $pos.nodeAfter;
  let targetNode: ProseMirrorNode | null | undefined = null;
  let targetNodePos = -1;

  // Check if the cursor is inside a text node
  if ($pos.parent.isTextblock && $pos.depth > 0) {
    // Check if we are inside a text-containing block
    if ($pos.textOffset > 0) {
      // Cursor is inside a text node
      targetNode = $pos.parent.child($pos.index());
      targetNodePos =
        $pos.start() + $pos.parent.child($pos.index()).attrs.offset; // This might not be right, use $pos.pos - $pos.textOffset
      targetNodePos = $pos.pos - $pos.textOffset;
    } else if ($pos.index() > 0 && $pos.parent.child($pos.index() - 1).isText) {
      // Cursor is at the start of a text node, look left
      targetNode = $pos.parent.child($pos.index() - 1);
      targetNodePos = $pos.pos - targetNode.nodeSize;
    } else if ($pos.parent.child($pos.index()).isText) {
      // Cursor is at start of first text node
      targetNode = $pos.parent.child($pos.index());
      targetNodePos = $pos.pos;
    }
  }

  // If we couldn't find a text node directly, try $pos.nodeBefore or $pos.nodeAfter if they are text nodes.
  // This part might be redundant if the above logic is solid.
  if (!targetNode) {
    if (nodeBefore && nodeBefore.isText) {
      targetNode = nodeBefore;
      targetNodePos = $pos.pos - nodeBefore.nodeSize;
    } else if (nodeAfter && nodeAfter.isText) {
      targetNode = nodeAfter;
      targetNodePos = $pos.pos;
    }
  }

  if (!targetNode || !targetNode.isText) {
    // Fallback: If cursor is not directly in/near text, check marks at $pos
    const marksAtPos = $pos.marks();
    const markAtCursor = marksAtPos.find((m) => m.type === type);
    if (markAtCursor) {
      let from = $pos.pos;
      let to = $pos.pos;
      if (
        $pos.nodeAfter &&
        $pos.nodeAfter.isText &&
        markAtCursor.isInSet($pos.nodeAfter.marks)
      ) {
        to = $pos.pos + $pos.nodeAfter.nodeSize;
      } else if (
        $pos.nodeBefore &&
        $pos.nodeBefore.isText &&
        markAtCursor.isInSet($pos.nodeBefore.marks)
      ) {
        from = $pos.pos - $pos.nodeBefore.nodeSize;
      } else {
        // Mark is likely on a non-text node or at an edge, try a minimal range
        const textNode =
          $pos.textOffset > 0
            ? $pos.parent.child($pos.index())
            : $pos.nodeAfter;
        if (textNode && textNode.isText) {
          from = $pos.pos - $pos.textOffset;
          to = from + textNode.nodeSize;
        } else {
          return false; // Cannot determine range
        }
      }
      return { from, to, mark: markAtCursor };
    }
    return false;
  }

  const mark = targetNode.marks.find((m) => m.type === type);
  if (!mark) {
    return false;
  }

  const currentPos = targetNodePos;
  let from = currentPos;
  let to = currentPos + targetNode.nodeSize;

  // Scan backward from the targetNode
  let currentIndex = $pos.parent.childCount;
  // Find currentIndex of targetNode
  for (let i = 0; i < $pos.parent.childCount; i++) {
    if ($pos.parent.child(i) === targetNode) {
      currentIndex = i;
      break;
    }
  }

  while (currentIndex > 0) {
    const prevNode = $pos.parent.child(currentIndex - 1);
    if (prevNode.isText && mark.isInSet(prevNode.marks)) {
      from -= prevNode.nodeSize;
      currentIndex--;
    } else {
      break;
    }
  }

  // Reset currentIndex for forward scan
  for (let i = 0; i < $pos.parent.childCount; i++) {
    if ($pos.parent.child(i) === targetNode) {
      currentIndex = i;
      break;
    }
  }

  // Scan forward from the targetNode
  while (currentIndex < $pos.parent.childCount - 1) {
    const nextNode = $pos.parent.child(currentIndex + 1);
    if (nextNode.isText && mark.isInSet(nextNode.marks)) {
      to += nextNode.nodeSize;
      currentIndex++;
    } else {
      break;
    }
  }

  return {
    from,
    to,
    mark,
  };
};
// Helper function to find the complete range of a link
const findLinkRange = (doc: ProseMirrorNode, pos: number, linkMark: Mark) => {
  let start = pos;
  let end = pos;

  // Go backwards to find start of link
  while (start > 0) {
    const prevPos = doc.resolve(start - 1);
    const hasLink = prevPos
      .marks()
      .some(
        (m: Mark) =>
          m.type === linkMark.type && m.attrs.href === linkMark.attrs.href,
      );
    if (hasLink) {
      start--;
    } else {
      break;
    }
  }

  // Go forwards to find end of link
  while (end < doc.content.size) {
    const nextPos = doc.resolve(end);
    const hasLink = nextPos
      .marks()
      .some(
        (m: Mark) =>
          m.type === linkMark.type && m.attrs.href === linkMark.attrs.href,
      );
    if (hasLink) {
      end++;
    } else {
      break;
    }
  }

  return { start, end };
};

// Types for link modal
interface LinkRange {
  start: number;
  end: number;
}

interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUrl: string;
  onSave: (url: string) => void;
  position: { x: number; y: number };
}

// Link Edit Modal Component
const LinkEditModal = ({
  isOpen,
  onClose,
  currentUrl,
  onSave,
  position,
}: LinkModalProps) => {
  const [url, setUrl] = useState(currentUrl || "");

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(url);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div
      className="fixed bg-white border border-gray-200 rounded-md shadow-lg p-3 z-50 min-w-80"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    >
      <div className="mb-2 text-sm font-medium text-gray-700">Edit Link</div>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter URL..."
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        autoFocus
      />
      <div className="mt-2 flex gap-2">
        <button
          onClick={handleSave}
          className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
        >
          Save
        </button>
        <button
          onClick={onClose}
          className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const Editor = forwardRef<EditorHandle>((_, ref) => {
  const { setEditor } = useEditorStore();
  const [linkModal, setLinkModal] = useState<{
    isOpen: boolean;
    url: string;
    position: { x: number; y: number };
    linkRange: LinkRange | null;
    view: EditorView | null;
  }>({
    isOpen: false,
    url: "",
    position: { x: 0, y: 0 },
    linkRange: null,
    view: null,
  });

  const editor = useEditor(
    {
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
        Link.configure({
          openOnClick: false,
          autolink: true,
          HTMLAttributes: {
            target: "_blank",
            rel: "noopener noreferrer",
          },
        }),
      ],
      editorProps: {
        attributes: {
          class: `focus:outline-none print:border-0 bg-white border border-[#C7C7C7] flex flex-col min-h-full w-[816px] cursor-text reset-tailwind p-10`,
          style: "all:revert;",
        },
        handleClick: (view, pos, event) => {
          const { schema, doc } = view.state;
          const range = doc.resolve(pos);
          const link = range
            .marks()
            .find((mark) => mark.type === schema.marks.link);

          if (link && (event.ctrlKey || event.metaKey)) {
            event.preventDefault();
            window.open(link.attrs.href, "_blank", "noopener,noreferrer");
            return true;
          }
          return false;
        },
        handleDOMEvents: {
          contextmenu: (view, event) => {
            const { schema, doc } = view.state;
            const pos = view.posAtCoords({
              left: event.clientX,
              top: event.clientY,
            });
            if (!pos) return false;

            const range = doc.resolve(pos.pos);
            const link = range
              .marks()
              .find((mark) => mark.type === schema.marks.link);

            if (link) {
              event.preventDefault();

              const contextMenu = document.createElement("div");
              contextMenu.className =
                "fixed bg-white border border-gray-200 rounded-md shadow-lg p-1 z-50";
              contextMenu.style.left = `${event.clientX}px`;
              contextMenu.style.top = `${event.clientY}px`;

              // Open Link option
              const openButton = document.createElement("button");
              openButton.className =
                "block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded";
              openButton.innerHTML = "🔗 Open Link";
              openButton.onclick = () => {
                window.open(link.attrs.href, "_blank", "noopener,noreferrer");
                document.body.removeChild(contextMenu);
              };

              // Edit Link option
              const editButton = document.createElement("button");
              editButton.className =
                "block w-full text-left px-3 py-2 text-sm hover:bg-blue-50 text-blue-600 rounded";
              editButton.innerHTML = "✏️ Edit Link";
              editButton.onclick = () => {
                const linkRange = findLinkRange(doc, pos.pos, link);
                setLinkModal({
                  isOpen: true,
                  url: link.attrs.href,
                  position: { x: event.clientX, y: event.clientY },
                  linkRange,
                  view,
                });
                document.body.removeChild(contextMenu);
              };

              // Remove Link option
              const unlinkButton = document.createElement("button");
              unlinkButton.className =
                "block w-full text-left px-3 py-2 text-sm hover:bg-red-50 text-red-600 rounded";
              unlinkButton.innerHTML = "🔓 Remove Link";
              unlinkButton.onclick = () => {
                const $pos = view.state.doc.resolve(pos.pos); // Resolve the cursor position
                const markRange = getMarkRange($pos, schema.marks.link); // Use the MarkType

                if (markRange) {
                  const tr = view.state.tr.removeMark(
                    markRange.from,
                    markRange.to,
                    schema.marks.link, // You can also use markRange.mark.type here
                  );
                  view.dispatch(tr);
                } else {
                  // Fallback or alternative if getMarkRange doesn't find it,
                  // though it should if `link` was found initially.
                  // For safety, you could try the original Tiptap command as a fallback:
                  view.dispatch(
                    view.state.tr.removeMark(
                      pos.pos,
                      pos.pos + 1,
                      schema.marks.link,
                    ),
                  ); // Tries to remove at cursor
                  // Or use the Tiptap command:
                  // editor?.chain().focus().unsetLink().run(); // If editor instance is accessible
                }

                document.body.removeChild(contextMenu);
              };

              contextMenu.appendChild(openButton);
              contextMenu.appendChild(editButton);
              contextMenu.appendChild(unlinkButton);
              document.body.appendChild(contextMenu);

              // Remove menu when clicking elsewhere
              const removeMenu = () => {
                if (document.body.contains(contextMenu)) {
                  document.body.removeChild(contextMenu);
                }
                document.removeEventListener("click", removeMenu);
              };
              setTimeout(
                () => document.addEventListener("click", removeMenu),
                0,
              );

              return true;
            }
            return false;
          },
        },
      },
      onCreate({ editor }) {
        setEditor(editor);
      },
    },
    [],
  );

  const handleLinkSave = (newUrl: string) => {
    if (linkModal.view && linkModal.linkRange) {
      const { view, linkRange } = linkModal;
      const { schema } = view.state;

      // Remove old link and add new one
      const tr = view.state.tr
        .removeMark(linkRange.start, linkRange.end, schema.marks.link)
        .addMark(
          linkRange.start,
          linkRange.end,
          schema.marks.link.create({ href: newUrl }),
        );

      view.dispatch(tr);
    }
  };

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

  return (
    <>
      <EditorContent editor={editor} className="max-w-full prose" />
      <LinkEditModal
        isOpen={linkModal.isOpen}
        onClose={() => setLinkModal((prev) => ({ ...prev, isOpen: false }))}
        currentUrl={linkModal.url}
        onSave={handleLinkSave}
        position={linkModal.position}
      />
    </>
  );
});

export default Editor;
