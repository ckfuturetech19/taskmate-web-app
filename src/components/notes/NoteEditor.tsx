import { useEffect, useState } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  CheckSquare,
  Heading1,
  Heading2,
  Quote,
  Undo2,
  Redo2,
  Code,
  Type,
  Strikethrough,
  ListTodo,
  Maximize2,
  Minimize2,
  PlusSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

import { NoteMember } from '@/services/noteService';

interface NoteEditorProps {
  content: string;
  onChange: (content: string) => void;
  editable?: boolean;
  currentUserName?: string | null;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  onFocusChange?: (focused: boolean) => void;
}

const MenuBar = ({ editor, onToggleFullscreen, isFullscreen }: { editor: Editor, onToggleFullscreen?: () => void, isFullscreen?: boolean }) => {
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    if (!editor) return;

    const updateState = () => {
      setCanUndo(editor.can().undo());
      setCanRedo(editor.can().redo());
    };

    updateState();
    editor.on('update', updateState);
    editor.on('selectionUpdate', updateState);

    return () => {
      editor.off('update', updateState);
      editor.off('selectionUpdate', updateState);
    };
  }, [editor]);

  if (!editor) return null;

  const ToolbarButton = ({
    icon: Icon,
    action,
    active = false,
    label,
    disabled = false
  }: {
    icon: any;
    action: () => void;
    active?: boolean;
    label: string;
    disabled?: boolean;
  }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={(e) => {
        e.preventDefault();
        if (!disabled) action();
      }}
      disabled={disabled}
      className={cn(
        "h-9 w-9 p-0 transition-all duration-200 rounded-lg",
        disabled
          ? "opacity-40 cursor-not-allowed text-muted-foreground"
          : active
            ? "bg-primary/20 text-primary hover:bg-primary/30 shadow-sm"
            : "text-foreground/70 hover:bg-muted hover:text-foreground"
      )}
      title={label}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );

  return (
    <div className="border-b bg-card/70 backdrop-blur-md sticky top-0 z-20 shadow-sm">
      <div className="flex flex-wrap items-center gap-2 p-3">
        {/* Undo/Redo Group */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            icon={Undo2}
            action={() => editor.chain().focus().undo().run()}
            disabled={!canUndo}
            label="Undo (Ctrl+Z)"
          />
          <ToolbarButton
            icon={Redo2}
            action={() => editor.chain().focus().redo().run()}
            disabled={!canRedo}
            label="Redo (Ctrl+Y)"
          />
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Heading Group */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            icon={Heading1}
            action={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            active={editor.isActive('heading', { level: 1 })}
            label="Heading 1"
          />
          <ToolbarButton
            icon={Heading2}
            action={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive('heading', { level: 2 })}
            label="Heading 2"
          />
          <ToolbarButton
            icon={Type}
            action={() => editor.chain().focus().setParagraph().run()}
            active={editor.isActive('paragraph')}
            label="Paragraph"
          />
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Text Formatting Group */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            icon={Bold}
            action={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive('bold')}
            label="Bold (Ctrl+B)"
          />
          <ToolbarButton
            icon={Italic}
            action={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive('italic')}
            label="Italic (Ctrl+I)"
          />
          <ToolbarButton
            icon={Strikethrough}
            action={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive('strike')}
            label="Strikethrough"
          />
          <ToolbarButton
            icon={Code}
            action={() => editor.chain().focus().toggleCode().run()}
            active={editor.isActive('code')}
            label="Inline Code"
          />
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* List Group */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            icon={List}
            action={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive('bulletList')}
            label="Bullet List"
          />
          <ToolbarButton
            icon={ListOrdered}
            action={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive('orderedList')}
            label="Numbered List"
          />
          <ToolbarButton
            icon={ListTodo}
            action={() => editor.chain().focus().toggleTaskList().run()}
            active={editor.isActive('taskList')}
            label="Checklist"
          />
          <ToolbarButton
            icon={Quote}
            action={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive('blockquote')}
            label="Quote"
          />
        </div>

        {onToggleFullscreen && (
          <>
            <Separator orientation="vertical" className="h-6" />
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleFullscreen}
              className="h-9 w-9 p-0 transition-all duration-200 rounded-lg text-foreground/70 hover:bg-muted hover:text-foreground"
              title={isFullscreen ? "Exit Focus Mode" : "Enter Focus Mode"}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

const NoteEditor = ({ content, onChange, editable = true, currentUserName, isFullscreen, onToggleFullscreen, onFocusChange }: NoteEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      TaskList,
      TaskItem.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            completedBy: {
              default: null,
              parseHTML: element => element.getAttribute('data-completed-by'),
              renderHTML: attributes => {
                if (!attributes.completedBy) return {};
                return { 'data-completed-by': attributes.completedBy };
              },
            },
            completedAt: {
              default: null,
              parseHTML: element => element.getAttribute('data-completed-at'),
              renderHTML: attributes => {
                if (!attributes.completedAt) return {};
                return { 'data-completed-at': attributes.completedAt };
              },
            },
          }
        },
        addKeyboardShortcuts() {
          const parentShortcuts = this.parent?.() || {};
          return {
            ...parentShortcuts,
            Enter: () => {
              if (this.editor.isActive('taskItem')) {
                return this.editor.commands.setHardBreak();
              }
              return false;
            },
            Backspace: () => {
              const { state } = this.editor;
              const { selection } = state;
              const { $anchor, empty } = selection;

              if (empty && this.editor.isActive('taskItem')) {
                if ($anchor.parentOffset === 0) {
                  if ($anchor.parent.content.size > 0) {
                    return true;
                  } else {
                    return this.editor.commands.liftListItem('taskItem');
                  }
                }
              }
              return false;
            },
          };
        },
      }).configure({
        nested: true,
      }),
      Placeholder.configure({
        placeholder: 'Write something amazing... Start typing or use the toolbar above.',
      }),
    ],
    content: content,
    editable: editable,
    onUpdate: ({ editor }) => {
      // Find checked items without metadata and add them
      const { state, dispatch } = editor.view;
      const { tr } = state;
      let modified = false;

      state.doc.descendants((node, pos) => {
        if (node.type.name === 'taskItem' && node.attrs.checked && !node.attrs.completedBy) {
          tr.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            completedBy: currentUserName || 'Someone',
            completedAt: new Date().toISOString(),
          });
          modified = true;
        } else if (node.type.name === 'taskItem' && !node.attrs.checked && node.attrs.completedBy) {
          tr.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            completedBy: null,
            completedAt: null,
          });
          modified = true;
        }
      });

      if (modified) {
        dispatch(tr);
      }

      onChange(editor.getHTML());
    },
    onFocus: () => onFocusChange?.(true),
    onBlur: () => onFocusChange?.(false),
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base dark:prose-invert max-w-none min-h-[500px] px-6 sm:px-8 py-6 focus:outline-none leading-relaxed',
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      if (!editor.isFocused) {
        editor.commands.setContent(content, { emitUpdate: false });
      }
    }
  }, [content, editor]);

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-background to-background/80 rounded-lg border border-border overflow-hidden shadow-sm">
      {editable && <MenuBar editor={editor} onToggleFullscreen={onToggleFullscreen} isFullscreen={isFullscreen} />}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-background/40 relative">
        {editor && (
          <BubbleMenu
            editor={editor}
            options={{ placement: 'bottom' }}
            shouldShow={({ editor, state, from, to }) => {
              return from === to && editor.isActive('taskItem');
            }}
          >
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                editor.chain().focus().splitListItem('taskItem').run();
              }}
              className="h-8 shadow-md rounded-md flex items-center gap-1.5 bg-background border border-border hover:bg-muted text-foreground z-50"
            >
              <PlusSquare className="h-4 w-4 text-primary" />
              <span className="font-medium text-xs">Add Task</span>
            </Button>
          </BubbleMenu>
        )}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default NoteEditor;
