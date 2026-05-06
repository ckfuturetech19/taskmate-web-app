import { useEffect, useState, useRef } from 'react';
import { TextSelection } from '@tiptap/pm/state';
import { useEditor, EditorContent } from '@tiptap/react';
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
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface NoteEditorProps {
  content: string;
  onChange: (content: string) => void;
  editable?: boolean;
  currentUserName?: string;
}

// Custom TaskItem extension with completedBy attribute + independent task behavior
const CustomTaskItem = TaskItem.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      completedBy: {
        default: null,
        parseHTML: element => element.getAttribute('data-completed-by') || null,
        renderHTML: attributes => {
          if (!attributes.completedBy) return {};
          return { 'data-completed-by': attributes.completedBy };
        },
      },
    };
  },

  addKeyboardShortcuts() {
    return {
      // Override Backspace: when cursor is at the start of a taskItem and content is empty,
      // do NOT merge with the previous task — just stay in place.
      'Backspace': () => {
        const { state } = this.editor;
        const { selection } = state;
        const { $from } = selection;

        // Check if we're inside a taskItem
        const taskItemNode = $from.node($from.depth);
        const parentNode = $from.depth >= 2 ? $from.node($from.depth - 1) : null;

        if (parentNode?.type.name === 'taskItem' || taskItemNode?.type.name === 'taskItem') {
          // Find the taskItem depth
          let taskItemDepth = -1;
          for (let d = $from.depth; d >= 0; d--) {
            if ($from.node(d).type.name === 'taskItem') {
              taskItemDepth = d;
              break;
            }
          }

          if (taskItemDepth >= 0) {
            const taskNode = $from.node(taskItemDepth);
            const startOfTaskContent = $from.start(taskItemDepth);

            // If cursor is at the very start of the task content
            if ($from.pos === startOfTaskContent) {
              // Check if task content is empty
              const textContent = taskNode.textContent.trim();
              if (textContent === '') {
                // Block backspace — don't merge with previous task
                return true;
              }
              // Even if there's text, prevent merging with previous task
              return true;
            }
          }
        }

        // Otherwise, let default backspace behavior proceed
        return false;
      },

      // Override Enter: prevent creating a new task on Enter.
      // Each task should only be added via the "Add Task" button.
      'Enter': () => {
        const { state } = this.editor;
        const { $from } = state.selection;

        // Check if we're inside a taskItem
        for (let d = $from.depth; d >= 0; d--) {
          if ($from.node(d).type.name === 'taskItem') {
            // Block Enter inside task items — new tasks added only via button
            return true;
          }
        }

        return false;
      },
    };
  },
});

const MenuBar = ({ editor }: { editor: any }) => {
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
  }: any) => (
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
      </div>
    </div>
  );
};

const NoteEditor = ({ content, onChange, editable = true, currentUserName }: NoteEditorProps) => {
  // Use a ref to track the previous document state for detecting checkbox toggles
  const prevTaskStatesRef = useRef<Map<number, boolean>>(new Map());
  const isUpdatingRef = useRef(false);
  const currentUserNameRef = useRef(currentUserName);

  // Keep the ref in sync with the prop
  useEffect(() => {
    currentUserNameRef.current = currentUserName;
  }, [currentUserName]);

  // Helper to collect all taskItem positions and their checked state
  const collectTaskStates = (doc: any): Map<number, boolean> => {
    const states = new Map<number, boolean>();
    doc.descendants((node: any, pos: number) => {
      if (node.type.name === 'taskItem') {
        states.set(pos, !!node.attrs.checked);
      }
    });
    return states;
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      TaskList,
      CustomTaskItem.configure({
        nested: true,
      }),
      Placeholder.configure({
        placeholder: 'Write something amazing... Start typing or use the toolbar above.',
      }),
    ],
    content: content,
    editable: editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onTransaction: ({ editor, transaction }) => {
      if (!transaction.docChanged || isUpdatingRef.current) return;
      if (!currentUserNameRef.current) return;

      const newDoc = editor.state.doc;
      const pendingUpdates: Array<{ pos: number; checked: boolean; completedBy: string | null }> = [];

      // Compare old and new task states
      newDoc.descendants((node: any, pos: number) => {
        if (node.type.name === 'taskItem') {
          const wasChecked = prevTaskStatesRef.current.get(pos);
          const isChecked = !!node.attrs.checked;

          // Detect checkbox toggle
          if (wasChecked !== undefined && wasChecked !== isChecked) {
            if (isChecked && !node.attrs.completedBy) {
              // Task just got checked — set completedBy
              pendingUpdates.push({
                pos,
                checked: true,
                completedBy: currentUserNameRef.current!,
              });
            } else if (!isChecked && node.attrs.completedBy) {
              // Task just got unchecked — clear completedBy
              pendingUpdates.push({
                pos,
                checked: false,
                completedBy: null,
              });
            }
          }
        }
      });

      // Update the task states ref
      prevTaskStatesRef.current = collectTaskStates(newDoc);

      // Apply pending updates
      if (pendingUpdates.length > 0) {
        setTimeout(() => {
          if (!editor || editor.isDestroyed) return;
          isUpdatingRef.current = true;

          editor.chain().command(({ tr }) => {
            pendingUpdates.forEach(({ pos, checked, completedBy }) => {
              const node = tr.doc.nodeAt(pos);
              if (node && node.type.name === 'taskItem') {
                tr.setNodeMarkup(pos, undefined, {
                  ...node.attrs,
                  checked,
                  completedBy,
                });
              }
            });
            return true;
          }).run();

          // Update ref after our own update
          prevTaskStatesRef.current = collectTaskStates(editor.state.doc);
          isUpdatingRef.current = false;
        }, 10);
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base dark:prose-invert max-w-none min-h-[500px] px-6 sm:px-8 py-6 focus:outline-none leading-relaxed',
      },
    },
  });

  // Initialize task states when editor is first created
  useEffect(() => {
    if (editor) {
      prevTaskStatesRef.current = collectTaskStates(editor.state.doc);
    }
  }, [editor]);

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      if (!editor.isFocused) {
        editor.commands.setContent(content, { emitUpdate: false });
        // Re-collect task states after external content update
        prevTaskStatesRef.current = collectTaskStates(editor.state.doc);
      }
    }
  }, [content, editor]);

  // Handler to add a new task at the end of the document
  const handleAddTask = () => {
    if (!editor) return;

    const { doc } = editor.state;
    const endPos = doc.content.size;

    // Find if there's already a taskList at the end
    let lastTaskListEnd = -1;
    doc.descendants((node: any, pos: number) => {
      if (node.type.name === 'taskList') {
        lastTaskListEnd = pos + node.nodeSize;
      }
    });

    if (lastTaskListEnd > 0) {
      // There's an existing taskList — insert a new taskItem inside it at the end
      const insertPos = lastTaskListEnd - 1; // before the closing tag of taskList
      editor.chain()
        .focus()
        .command(({ tr }) => {
          const taskItemType = editor.schema.nodes.taskItem;
          const paragraphType = editor.schema.nodes.paragraph;
          const newTaskItem = taskItemType.create(
            { checked: false, completedBy: null },
            paragraphType.create()
          );
          tr.insert(insertPos, newTaskItem);
          // Set cursor inside the new task item
          const resolvedPos = tr.doc.resolve(insertPos + 2);
          tr.setSelection(TextSelection.near(resolvedPos));
          return true;
        })
        .run();
    } else {
      // No taskList exists — create one with a single taskItem
      editor.chain()
        .focus()
        .command(({ tr }) => {
          const taskListType = editor.schema.nodes.taskList;
          const taskItemType = editor.schema.nodes.taskItem;
          const paragraphType = editor.schema.nodes.paragraph;
          const newTaskList = taskListType.create(
            null,
            taskItemType.create(
              { checked: false, completedBy: null },
              paragraphType.create()
            )
          );
          tr.insert(endPos, newTaskList);
          // Set cursor inside the new task
          const resolvedPos = tr.doc.resolve(endPos + 3);
          tr.setSelection(TextSelection.near(resolvedPos));
          return true;
        })
        .run();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-background to-background/80 rounded-lg border border-border overflow-hidden shadow-sm">
      {editable && <MenuBar editor={editor} />}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-background/40">
        <EditorContent editor={editor} />

        {/* Add Task Button */}
        {editable && (
          <div className="px-6 sm:px-8 pb-6">
            <button
              onClick={handleAddTask}
              className="group flex items-center gap-2 w-full py-2.5 px-4 rounded-xl border-2 border-dashed border-border/50 hover:border-primary/40 bg-transparent hover:bg-primary/5 transition-all duration-200 text-muted-foreground hover:text-primary"
            >
              <div className="flex items-center justify-center w-6 h-6 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Plus className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm font-medium">Add new task</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteEditor;
