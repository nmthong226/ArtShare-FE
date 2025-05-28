import Bold from '@tiptap/extension-bold'
import BulletList from '@tiptap/extension-bullet-list'
import { Color } from '@tiptap/extension-color'
import Document from '@tiptap/extension-document'
import FontFamily from '@tiptap/extension-font-family'
import Heading from '@tiptap/extension-heading'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import ListItem from '@tiptap/extension-list-item'
import Gapcursor from '@tiptap/extension-gapcursor'
import Italic from '@tiptap/extension-italic'
import Image from '@tiptap/extension-image'
import ImageResize from 'tiptap-extension-resize-image';
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Text from '@tiptap/extension-text'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Paragraph from '@tiptap/extension-paragraph'
import History from '@tiptap/extension-history'
import Underline from '@tiptap/extension-underline'
import OrderedList from '@tiptap/extension-ordered-list'
import Youtube from '@tiptap/extension-youtube'
import Placeholder from '@tiptap/extension-placeholder'
import { FontSizeExtension } from "../extensions/font-size";
import { LineHeightExtension } from "../extensions/line-height";

import { EditorContent, useEditor } from '@tiptap/react'

import '../styles/editor.css'

import { useEditorStore } from '../stores/use-editor-store'
import { forwardRef, useImperativeHandle } from 'react'

export type EditorHandle = {
    getContent: () => string | undefined
    setContent: (content: string) => void
    getImages: () => { src: string; alt?: string; title?: string }[]
}

const Editor = forwardRef<EditorHandle>((_, ref) => {
    const { setEditor } = useEditorStore();
    const editor = useEditor({
        onCreate({ editor }) {
            setEditor(editor);
        },
        onDestroy() {
            setEditor(null);
        },
        onUpdate({ editor }) {
            setEditor(editor);
        },
        onSelectionUpdate({ editor }) {
            setEditor(editor);
        },
        onTransaction({ editor }) {
            setEditor(editor);
        },
        onBlur({ editor }) {
            setEditor(editor);
        },
        onFocus({ editor }) {
            setEditor(editor);
        },
        onContentError({ editor }) {
            setEditor(editor);
        },
        editorProps: {
            attributes: {
                style: "padding-left: 56px; padding-right: 56px;",
                class: 'focus:outline-none print:border-0 bg-white border border-[#C7C7C7] flex flex-col min-h-full w-[816px] pt-10 pr-14 pb-10 cursor-text'
            }
        },
        extensions: [
            Bold,
            BulletList,
            Color,
            Document,
            FontFamily,
            FontSizeExtension,
            Gapcursor,
            Heading.configure({
                levels: [1, 2, 3],
            }),
            Highlight.configure({
                multicolor: true,
            }),
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
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
            Text,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            TextStyle,
            Underline,
            OrderedList,
            Placeholder.configure({
                placeholder: 'Write something …',
            }),
            Youtube.configure({
                inline: true,
                controls: true,
                allowFullscreen: true
            }),
            Link.configure({
                openOnClick: false,
                autolink: true,
                defaultProtocol: 'https',
                protocols: ['http', 'https'],
                isAllowedUri: (url, ctx) => {
                    try {
                        // construct URL
                        const parsedUrl = url.includes(':') ? new URL(url) : new URL(`${ctx.defaultProtocol}://${url}`)

                        // use default validation
                        if (!ctx.defaultValidate(parsedUrl.href)) {
                            return false
                        }

                        // disallowed protocols
                        const disallowedProtocols = ['ftp', 'file', 'mailto']
                        const protocol = parsedUrl.protocol.replace(':', '')

                        if (disallowedProtocols.includes(protocol)) {
                            return false
                        }

                        // only allow protocols specified in ctx.protocols
                        const allowedProtocols = ctx.protocols.map(p => (typeof p === 'string' ? p : p.scheme))

                        if (!allowedProtocols.includes(protocol)) {
                            return false
                        }

                        // disallowed domains
                        const disallowedDomains = ['example-phishing.com', 'malicious-site.net']
                        const domain = parsedUrl.hostname

                        if (disallowedDomains.includes(domain)) {
                            return false
                        }

                        // all checks have passed
                        return true
                    } catch {
                        return false
                    }
                },
                shouldAutoLink: url => {
                    try {
                        // construct URL
                        const parsedUrl = url.includes(':') ? new URL(url) : new URL(`https://${url}`)

                        // only auto-link if the domain is not in the disallowed list
                        const disallowedDomains = ['example-no-autolink.com', 'another-no-autolink.com']
                        const domain = parsedUrl.hostname

                        return !disallowedDomains.includes(domain)
                    } catch {
                        return false
                    }
                },
            }),
        ],
        content: ``,
    })

    useImperativeHandle(ref, () => ({
        getContent: () => editor?.getHTML(),
        setContent: (content: string) => {
            if (editor) {
                editor.commands.setContent(content)
            }
        },
        getImages: () => {
            const images: { src: string; alt?: string; title?: string }[] = []
            editor?.state.doc.descendants((node) => {
                if (node.type.name === 'image') {
                    images.push({
                        src: node.attrs.src,
                        alt: node.attrs.alt,
                        title: node.attrs.title,
                    })
                }
            })
            return images
        },
    }))

    return (
        <EditorContent editor={editor} className="max-w-full prose" />
    )
})

export default Editor
