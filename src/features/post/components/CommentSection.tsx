import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
  MouseEvent,
} from "react";
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  TextareaAutosize,
  CircularProgress,
  Typography,
} from "@mui/material";
import {
  ChevronDown,
  ChevronUp,
  SendHorizontal,
  Heart,
  MoreVertical,
} from "lucide-react";
import Avatar from "boring-avatars";
import { useFocusContext } from "@/contexts/focus/useFocusText";
import api from "@/api/baseApi";
import {
  likeComment,
  createComment,
  fetchComments,
  unlikeComment,
} from "../api/comment.api";
import { CommentUI, CreateCommentDto } from "@/types/comment";
import { useUser } from "@/contexts/UserProvider";
import { User } from "@/types";
import { Link as RouterLink } from "react-router-dom";
import MuiLink from "@mui/material/Link";
import { useSnackbar } from "@/contexts/SnackbarProvider";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useContext } from "react";
import { FreshRepliesCtx } from "./FreshReplies";
import { isTemporaryCommentId } from "@/lib/utils";
/* ------------------------------------------------------------------ */
/* Constants & helpers                                                */
/* ------------------------------------------------------------------ */
const INDENT = 44;

const DATETIME_FORMAT_OPTIONS_FOR_TITLE: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
};

const getTimeAgo = (date: string | Date): string => {
  const now = new Date().getTime();
  const then = new Date(date).getTime();
  const seconds = Math.floor((now - then) / 1000);
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
  }
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  }
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? "s" : ""} ago`;
};

const addReplyRecursive = (
  list: CommentUI[],
  parentId: number,
  reply: CommentUI,
): CommentUI[] =>
  list.map((c) => {
    if (c.id === parentId) {
      return {
        ...c,
        replies: c.replies ? [...c.replies, reply] : [reply],
        reply_count: (c.reply_count ?? 0) + 1,
      };
    }
    return c.replies?.length
      ? { ...c, replies: addReplyRecursive(c.replies, parentId, reply) }
      : c;
  });

const toggleLikeRecursive = (list: CommentUI[], id: number): CommentUI[] =>
  list.map((c) =>
    c.id === id
      ? {
          ...c,
          likedByCurrentUser: !c.likedByCurrentUser,
          like_count: (c.like_count ?? 0) + (c.likedByCurrentUser ? -1 : 1),
        }
      : c.replies?.length
        ? { ...c, replies: toggleLikeRecursive(c.replies, id) }
        : c,
  );

const removeRecursive = (list: CommentUI[], id: number): CommentUI[] => {
  return list
    .filter((c) => c.id !== id)
    .map((c) => {
      if (c.replies?.length) {
        const originalReplyCount = c.replies.length;
        const updatedReplies = removeRecursive(c.replies, id);
        const newReplyCount = updatedReplies.length;

        // If we removed a reply, update the reply_count
        if (originalReplyCount !== newReplyCount) {
          return {
            ...c,
            replies: updatedReplies,
            reply_count: Math.max(
              0,
              (c.reply_count ?? 0) - (originalReplyCount - newReplyCount),
            ),
          };
        }

        return { ...c, replies: updatedReplies };
      }
      return c;
    });
};

const updateContentRecursive = (
  list: CommentUI[],
  id: number,
  content: string,
): CommentUI[] =>
  list.map((c) =>
    c.id === id
      ? { ...c, content, updated_at: new Date() }
      : c.replies?.length
        ? { ...c, replies: updateContentRecursive(c.replies, id, content) }
        : c,
  );

/* ------------------------------------------------------------------ */
/* Single comment row                                                 */
/* ------------------------------------------------------------------ */
interface RowProps {
  targetId: number;
  targetType: "POST" | "BLOG";
  depth?: number;
  comment: CommentUI;
  onLike: (id: number) => void;
  onReply: (id: number, username: string) => void;
  onDelete: (id: number) => void;
  onRepliesFetched: (id: number, replies: CommentUI[]) => void;
  editingId: number | null;
  onStartEdit: (id: number) => void;
  onAbortEdit: () => void;
  onCommitEdit: (id: number, value: string) => Promise<void>;
  onSubmitReply: (parentId: number, content: string) => void;
}

const CommentRow = ({
  targetId,
  targetType,
  depth = 0,
  comment,
  onLike,
  onReply,
  onDelete,
  onRepliesFetched,
  editingId,
  onStartEdit,
  onAbortEdit,
  onCommitEdit,
  onSubmitReply,
}: RowProps) => {
  /* ── fresh-reply context ──────────────────────────────── */
  const { map: freshMap, clear: clearFreshIds } = useContext(FreshRepliesCtx);
  const freshIds: Set<number> = freshMap[comment.id] ?? new Set();
  const { user } = useUser();
  const { showSnackbar } = useSnackbar();
  const CURRENT_USER_ID = user?.id;
  const isMine = comment.user_id === CURRENT_USER_ID;
  const isEditing = editingId === comment.id;
  const editRef = useRef<HTMLTextAreaElement>(null);
  const prevReplyCountRef = useRef(comment.replies?.length || 0);
  const [showReplies, setShowReplies] = useState(false);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const openMenu = Boolean(anchorEl);
  const handleMenu = (e: MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(e.currentTarget);
  const closeMenu = () => setAnchorEl(null);
  const requireAuth = useRequireAuth();
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const replyInputRef = useRef<HTMLTextAreaElement>(null);
  const olderCount = Math.max(0, (comment.reply_count ?? 0) - freshIds.size);
  // show the thread container if there's any older OR any fresh replies
  const showThread = olderCount > 0 || freshIds.size > 0;
  // only show the “View/Hide” button when there are truly older replies
  const showToggle = olderCount > 0;
  const thisCommentIsTemporary = isTemporaryCommentId(comment.id);

  /**
+ * When we come back to the page, `freshIds` may contain ids but
+ * `comment.replies` is still empty.  Pull the replies once so the new
+ * comment can render even while the thread is collapsed.
+ */
  useEffect(() => {
    if (
      freshIds.size > 0 &&
      (!comment.replies || comment.replies.length === 0) &&
      !loading
    ) {
      (async () => {
        try {
          setLoading(true);
          const fetched = await fetchComments(targetId, targetType, comment.id);
          onRepliesFetched(comment.id, fetched as CommentUI[]);
        } finally {
          setLoading(false);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [freshIds]);

  useEffect(() => {
    const prev = prevReplyCountRef.current;
    const curr = comment.replies?.length ?? 0;

    // Only auto-expand if there are NO fresh replies (meaning this is from fetching old replies)
    // Auto-expand **only** when there are no hidden older replies.
    if (prev === 0 && curr > 0 && !showReplies && olderCount === 0) {
      setShowReplies(true);
    }
    prevReplyCountRef.current = curr;
  }, [comment.replies, showReplies, freshIds.size, olderCount]);

  const toggleReplies = async () => {
    const loaded = comment.replies?.length ?? 0;
    const total = comment.reply_count ?? 0;
    const needsToFetch = !showReplies && loaded < total;

    if (needsToFetch) {
      try {
        setLoading(true);
        const fetchedReplies = await fetchComments(
          targetId,
          targetType,
          comment.id,
        );
        onRepliesFetched(comment.id, fetchedReplies as CommentUI[]);
      } catch (err) {
        console.error(
          "Failed to load replies for comment " + comment.id + ":",
          err,
        );
        showSnackbar("Failed to load replies", "error");
      } finally {
        setLoading(false);
      }
    }
    setShowReplies((s) => {
      const next = !s;
      if (next) clearFreshIds(comment.id);
      return next;
    });
  };

  const renderContent = (text: string) => {
    const parts = text.split(/(@\w+)/g);
    return parts.map((part, i) => {
      const m = part.match(/^@(\w+)$/);
      if (m) {
        const username = m[1];
        return (
          <MuiLink
            key={i}
            component={RouterLink}
            to={`/${username}`}
            color="primary"
            underline="hover"
          >
            @{username}
          </MuiLink>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div id={`comment-${comment.id}`} className="w-full">
      <div className="flex gap-3 py-3 w-full">
        {comment.user.profile_picture_url ? (
          <img
            src={comment.user.profile_picture_url}
            alt={comment.user.username}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <Avatar
            name={comment.user.username}
            size={32}
            variant="beam"
            colors={["#84bfc3", "#ff9b62", "#d96153"]}
          />
        )}
        <div className="flex flex-col flex-grow">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-bold">@{comment.user.username}</span>
            <span
              className="text-neutral-500 text-xs"
              title={
                new Date(comment.updated_at).getTime() !==
                new Date(comment.created_at).getTime()
                  ? `Edited ${new Date(comment.updated_at).toLocaleString(
                      undefined,
                      DATETIME_FORMAT_OPTIONS_FOR_TITLE,
                    )}`
                  : undefined
              }
            >
              {getTimeAgo(comment.created_at)}
              {new Date(comment.updated_at).getTime() !==
                new Date(comment.created_at).getTime() && " (edited)"}
            </span>
          </div>

          {isEditing ? (
            <div className="flex flex-col gap-2">
              <TextareaAutosize
                ref={editRef}
                defaultValue={comment.content}
                minRows={2}
                className="w-full border border-neutral-300 rounded-md p-2"
              />
              <div className="flex gap-2 text-xs">
                <Button
                  size="small"
                  onClick={async () =>
                    await onCommitEdit(
                      comment.id,
                      editRef.current!.value.trim(),
                    )
                  }
                >
                  Save
                </Button>
                <Button size="small" variant="outlined" onClick={onAbortEdit}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-sm whitespace-pre-wrap">
              {renderContent(comment.content)}
            </div>
          )}

          {!isEditing && (
            <div className="flex items-center gap-1 mt-1">
              <IconButton
                size="small"
                color={comment.likedByCurrentUser ? "primary" : "default"}
                onClick={() =>
                  requireAuth("like comments", () => onLike(comment.id))
                }
                disabled={false} // We'll handle the debouncing in the parent
              >
                <Heart
                  size={16}
                  fill={comment.likedByCurrentUser ? "currentColor" : "none"}
                  stroke="currentColor"
                />
              </IconButton>
              <Typography variant="caption" sx={{ mr: 2 }}>
                {comment.like_count ?? 0}
              </Typography>

              <Button
                size="small"
                color="primary"
                onClick={() =>
                  requireAuth("reply to comments", () => {
                    setReplying((v) => !v);
                    setTimeout(() => replyInputRef.current?.focus(), 0);
                  })
                }
              >
                {replying ? "Cancel" : "Reply"}
              </Button>
            </div>
          )}
        </div>

        {isMine && !isEditing && (
          <>
            <IconButton
              size="small"
              edge="end"
              disableRipple
              onClick={handleMenu}
              sx={{
                // -- keep it compact
                width: 28,
                height: 28,
                p: 0.5,
                borderRadius: "50%",
                "&:hover": {
                  backgroundColor: "action.hover", // subtle, uses theme value
                },
              }}
            >
              <MoreVertical size={18} />
            </IconButton>

            <Menu anchorEl={anchorEl} open={openMenu} onClose={closeMenu}>
              <MenuItem
                onClick={() => {
                  closeMenu();
                  onStartEdit(comment.id);
                }}
              >
                Edit
              </MenuItem>
              <MenuItem
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  closeMenu();
                  setTimeout(() => {
                    onDelete(comment.id);
                  }, 0);
                }}
              >
                Delete
              </MenuItem>
            </Menu>
          </>
        )}
      </div>

      {/* ▶️  INLINE REPLY INPUT  */}
      {showThread && (
        <div className="flex flex-col gap-1" style={{ marginLeft: INDENT }}>
          {/* A.  View / Hide button (only for true older replies) */}
          {showToggle && (
            <button
              onClick={toggleReplies}
              disabled={loading && !showReplies}
              className="flex items-center gap-1 text-xs text-blue-600 disabled:text-neutral-400"
            >
              {loading && !showReplies ? (
                <CircularProgress size={14} />
              ) : showReplies ? (
                <ChevronUp size={14} />
              ) : (
                <ChevronDown size={14} />
              )}
              {showReplies ? "Hide" : "View"} {olderCount}{" "}
              {olderCount === 1 ? "reply" : "replies"}
            </button>
          )}

          {/* C.  Render replies (older + fresh) */}
          {comment.replies
            ?.filter((r) => showReplies || freshIds.has(r.id))
            .map((r) => (
              <CommentRow
                key={r.id}
                targetId={targetId}
                targetType={targetType}
                depth={depth + 1}
                comment={r}
                onLike={onLike}
                onReply={onReply}
                onDelete={onDelete}
                onRepliesFetched={onRepliesFetched}
                editingId={editingId}
                onStartEdit={onStartEdit}
                onAbortEdit={onAbortEdit}
                onCommitEdit={onCommitEdit}
                onSubmitReply={onSubmitReply}
              />
            ))}
        </div>
      )}
      {/* B.  Inline-reply input - MOVED HERE and corrected indentation & styling */}
      {replying && (
        <div
          className="flex items-start gap-3 mt-2"
          style={{ marginLeft: INDENT }} // Apply indent directly to the reply box container
        >
          {/* avatar */}
          {user?.profile_picture_url ? (
            <img
              src={user.profile_picture_url}
              alt={user.username}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <Avatar
              name={user?.username || "Guest"}
              size={32}
              variant="beam"
              colors={["#84bfc3", "#ff9b62", "#d96153"]}
            />
          )}
          {/* input + buttons */}
          <div className="flex flex-col flex-1 pr-4">
            <TextareaAutosize
              ref={replyInputRef}
              placeholder="Reply…"
              minRows={1} // Consistent minRows
              maxRows={4}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  const txt = replyText.trim();
                  if (!txt) return;
                  // Critical check: ensure parent (this comment) is not temporary before submitting
                  if (thisCommentIsTemporary) {
                    showSnackbar(
                      "Cannot submit reply, parent comment is still saving.",
                      "error",
                    );
                    return;
                  }
                  // setShowReplies(true);
                  onSubmitReply(comment.id, txt); // comment.id here MUST be the real persisted ID
                  setReplyText("");
                  setReplying(false);
                }
              }}
              className="border border-neutral-300 rounded-lg p-3 w-full max-w-full ..."
            />
            <div className="flex justify-end gap-2 mt-1">
              <Button
                size="small"
                color="inherit"
                onClick={() => {
                  setReplyText("");
                  setReplying(false);
                }}
              >
                Cancel
              </Button>
              <Button
                size="small"
                variant="contained"
                disabled={!replyText.trim()}
                onClick={() => {
                  const txt = replyText.trim();
                  if (!txt) return;
                  if (thisCommentIsTemporary) {
                    showSnackbar(
                      "Cannot submit reply, parent comment is still saving.",
                      "error",
                    );
                    return;
                  }
                  //  setShowReplies(true); // keep thread open
                  onSubmitReply(comment.id, txt);
                  setReplyText("");
                  setReplying(false);
                }}
              >
                Reply
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Main component                                                     */
/* ------------------------------------------------------------------ */
interface Props {
  comments: CommentUI[];
  /** id of the post or blog we are commenting on */
  targetId: number;
  /** where to show the input bar - defaults to bottom (post layout) */
  inputPosition?: "top" | "bottom";
  /** distinguishes which table to update on the back-end */
  targetType: "POST" | "BLOG";
  onCommentAdded(): void;
  onCommentDeleted(): void;
  /** if true, don’t draw the white rounded box around comments */
  hideWrapper?: boolean;
}

const CommentSection = forwardRef<HTMLDivElement, Props>(
  (
    {
      comments: initial,
      targetId,
      targetType = "POST",
      inputPosition = "bottom",
      onCommentAdded,
      onCommentDeleted,
      hideWrapper = false,
    },
    _ref,
  ) => {
    const { user } = useUser();
    const { showSnackbar } = useSnackbar();
    const CURRENT_USER_ID = user?.id;
    const { postCommentsRef } = useFocusContext();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const [comments, setComments] = useState<CommentUI[]>(initial);
    const [newComment, setNewComment] = useState("");
    const [replyParentId, setReplyParentId] = useState<number | null>(null);
    const [isPosting, setIsPosting] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const requireAuth = useRequireAuth();
    /** replies that were added while the parent thread is still collapsed */
    const STORAGE_KEY = `freshReplies-${targetType}-${targetId}`;
    const [newRepliesMap, setNewRepliesMap] = useState<
      Record<number, Set<number>>
    >(() => {
      try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        if (!raw) return {};
        const obj = JSON.parse(raw) as Record<string, number[]>;
        const out: Record<number, Set<number>> = {};
        Object.entries(obj).forEach(([k, v]) => (out[+k] = new Set(v)));
        return out;
      } catch {
        return {};
      }
    });

    const appendFresh = (parentId: number, replyId: number) =>
      setNewRepliesMap((prev) => {
        const set = new Set(prev[parentId] ?? []);
        set.add(replyId);
        return { ...prev, [parentId]: set };
      });

    function mergeTrees(prev: CommentUI[], incoming: CommentUI[]): CommentUI[] {
      return incoming.map((inc) => {
        const old = prev.find((p) => p.id === inc.id);

        // If the server gave us no replies but we already have some, keep them.
        const mergedReplies =
          inc.replies && inc.replies.length > 0
            ? inc.replies
            : (old?.replies ?? []);

        return {
          ...inc,
          replies: mergedReplies.map((r) => r), // shallow-copy for safety
        };
      });
    }

    const replaceTempFreshId = (
      parentId: number,
      tmpId: number,
      realId: number,
    ) =>
      setNewRepliesMap((prev) => {
        const set = new Set(prev[parentId]);
        if (!set.size) return prev;
        set.delete(tmpId);
        set.add(realId);
        return { ...prev, [parentId]: set };
      });

    const clearFresh = (parentId: number) =>
      setNewRepliesMap((prev) => {
        if (!prev[parentId]) return prev;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [parentId]: _, ...rest } = prev;
        return rest;
      });
    useEffect(() => {
      setComments((prev) => mergeTrees(prev, initial));
    }, [initial]);

    useImperativeHandle(postCommentsRef, () => ({
      focusInput: () => {
        if (!user) {
          showSnackbar(
            "Please login to comment",
            "warning",
            <Button
              size="small"
              color="inherit"
              onClick={() => (window.location.href = "/login")}
            >
              Login
            </Button>,
          );
          return;
        }
        textareaRef.current?.focus();
      },
    }));

    const attachReplies = (id: number, replies: CommentUI[]) => {
      setComments((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, replies }
            : c.replies?.length
              ? { ...c, replies: attachRepliesTo(c.replies, id, replies) }
              : c,
        ),
      );
    };

    const attachRepliesTo = (
      list: CommentUI[],
      id: number,
      replies: CommentUI[],
    ): CommentUI[] =>
      list.map((c) =>
        c.id === id
          ? { ...c, replies }
          : c.replies?.length
            ? { ...c, replies: attachRepliesTo(c.replies, id, replies) }
            : c,
      );

    /* -------------------- CREATE ---------------------------------- */
    const handleAdd = async (
      contentArg?: string,
      parentIdArg?: number | null,
    ) => {
      const content = (contentArg ?? newComment).trim();
      if (!content) return;

      const parentId = parentIdArg !== undefined ? parentIdArg : replyParentId;

      const tmpId = Date.now();
      const now = new Date();

      const optimistic: CommentUI = {
        id: tmpId,
        user_id: CURRENT_USER_ID || "",
        user: {
          id: CURRENT_USER_ID!,
          username: user?.username || "",
          profile_picture_url: user?.profile_picture_url,
        } as User,
        parent_comment_id: parentId ?? null,
        target_id: targetId,
        target_type: targetType,
        content,
        created_at: now,
        updated_at: now,
        replies: [],
        like_count: 0,
        likedByCurrentUser: false,
        reply_count: 0,
      };

      // Optimistically update UI to show the new reply (and bump reply_count)
      setComments((prev) =>
        parentId
          ? addReplyRecursive(prev, parentId, optimistic)
          : [optimistic, ...prev],
      );

      // mark this reply so it stays visible even if thread is collapsed
      if (parentId) appendFresh(parentId, tmpId);
      listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      // Clear input and set states
      setNewComment("");
      setReplyParentId(null);
      setIsPosting(true);

      try {
        const payload: CreateCommentDto = {
          content,
          target_id: targetId,
          target_type: targetType,
          parent_comment_id: parentId ?? undefined,
        };

        const { data } = await createComment(payload);

        // Replace the optimistic comment while preserving hierarchy
        if (parentId) {
          // For replies, update within the nested structure
          setComments((prev) =>
            prev.map((comment) => {
              if (comment.id === parentId) {
                // Replace the temp reply with the real one in this parent
                return {
                  ...comment,
                  replies:
                    comment.replies?.map((reply) =>
                      reply.id === tmpId ? data : reply,
                    ) || [],
                };
              } else if (comment.replies?.length) {
                // Search deeper in the tree
                return {
                  ...comment,
                  replies: updateReplyInNestedStructure(
                    comment.replies,
                    parentId,
                    tmpId,
                    data,
                  ),
                };
              }
              return comment;
            }),
          );
        } else {
          // For top-level comments, replace the temp one with the real one
          setComments((prev) => prev.map((c) => (c.id === tmpId ? data : c)));
        }

        // update fresh-reply map from tmpId ➜ real id
        if (parentId) replaceTempFreshId(parentId, tmpId, data.id);

        setTimeout(() => {
          if (parentId) {
            const parentEl = document.getElementById(`comment-${parentId}`);
            if (parentEl) {
              parentEl.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          } else {
            listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
          }
        }, 100);
        setReplyParentId(null);
        onCommentAdded();
      } catch (err) {
        console.error(err);
        setComments((prev) => removeRecursive(prev, tmpId));
        showSnackbar("Failed to post comment", "error");
      } finally {
        setIsPosting(false);
      }
    };

    const updateReplyInNestedStructure = (
      replies: CommentUI[],
      parentId: number,
      tmpId: number,
      newData: CommentUI,
    ): CommentUI[] => {
      return replies.map((reply) => {
        if (reply.id === parentId) {
          return {
            ...reply,
            replies:
              reply.replies?.map((r) => (r.id === tmpId ? newData : r)) || [],
          };
        } else if (reply.replies?.length) {
          return {
            ...reply,
            replies: updateReplyInNestedStructure(
              reply.replies,
              parentId,
              tmpId,
              newData,
            ),
          };
        }
        return reply;
      });
    };

    /* -------------------- DELETE ---------------------------------- */
    const handleDelete = async (id: number) => {
      const prev = comments;
      setComments(removeRecursive(prev, id));
      setDeletingId(id);
      try {
        await api.delete(`/comments/${id}`);
        onCommentDeleted();
      } catch (err) {
        console.error(err);
        setComments(prev);
        showSnackbar("Could not delete comment", "error");
      } finally {
        setDeletingId(null);
      }
    };

    /* -------------------- EDIT ------------------------------------ */
    const startEdit = (id: number) => setEditingId(id);
    const abortEdit = () => setEditingId(null);

    const commitEdit = async (id: number, value: string) => {
      if (!value) return;
      const prev = comments;
      setComments(updateContentRecursive(prev, id, value));
      setEditingId(null);
      try {
        await api.patch(`/comments/${id}`, { content: value });
      } catch (err) {
        console.error(err);
        setComments(prev);
        showSnackbar("Could not update comment", "error");
      }
    };

    /* -------------------- LIKE ------------------------------------ */
    const [likingComments, setLikingComments] = useState<Set<number>>(
      new Set(),
    );

    const handleLike = async (id: number) => {
      // Prevent multiple simultaneous like operations on the same comment
      if (likingComments.has(id)) {
        return;
      }

      const comment = comments
        .flatMap(function findAll(c): CommentUI[] {
          return [c, ...(c.replies ? c.replies.flatMap(findAll) : [])];
        })
        .find((c) => c.id === id);

      const alreadyLiked = comment?.likedByCurrentUser;

      // Mark this comment as being processed
      setLikingComments((prev) => new Set(prev).add(id));

      // Optimistically update UI
      setComments((prev) => toggleLikeRecursive(prev, id));

      try {
        if (alreadyLiked) {
          await unlikeComment(id);
        } else {
          await likeComment(id);
        }
      } catch (err) {
        console.error(err);
        // Revert the optimistic update on error
        setComments((prev) => toggleLikeRecursive(prev, id));
        showSnackbar("Failed to update like", "error");
      } finally {
        // Remove the comment from the processing set
        setLikingComments((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }
    };

    /* -------------------- FETCH ----------------------------------- */
    useEffect(() => {
      const loadComments = async () => {
        try {
          const data = await fetchComments(targetId, targetType);
          setComments(data as CommentUI[]);
        } catch (err) {
          console.error("Failed to load comments:", err);
          showSnackbar("Failed to load comments", "error");
        }
      };
      if (targetId) {
        loadComments();
      }
    }, [targetId, showSnackbar, targetType]);

    const InputBar = (
      <div
        className={
          inputPosition === "bottom"
            ? // bottom-fixed version stays the same
              "absolute inset-x-0 bottom-0 flex items-center gap-2 bg-white p-4 border-t border-mountain-200"
            : // top version, but if hideWrapper remove border & rounding
              hideWrapper
              ? "flex items-center gap-2 bg-white mb-4"
              : "flex items-center gap-2 bg-white p-4 border border-mountain-200 rounded-lg mb-4"
        }
      >
        {/* Avatar */}
        {user?.profile_picture_url ? (
          <img
            src={user.profile_picture_url}
            alt={user.username}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <Avatar
            name={user?.username || "Guest"}
            size={32}
            variant="beam"
            colors={["#84bfc3", "#ff9b62", "#d96153"]}
          />
        )}

        {/* Text input + Send button */}
        <div className="flex flex-grow gap-2">
          <TextareaAutosize
            ref={textareaRef}
            placeholder={
              user
                ? replyParentId
                  ? "Replying…"
                  : "Add a comment"
                : "Login to add a comment"
            }
            className="border border-neutral-300 rounded-lg p-3 w-full resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={isPosting || !user}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                newComment.trim() && requireAuth("comment", handleAdd);
              }
            }}
          />

          <Button
            variant="contained"
            className="p-0.5 min-w-auto h-12 aspect-[1/1]"
            onClick={() => requireAuth("comment", handleAdd)}
            disabled={!newComment.trim() || isPosting || !user}
          >
            {isPosting ? <CircularProgress size={24} /> : <SendHorizontal />}
          </Button>
        </div>
      </div>
    );

    const wrapperClass = [
      "relative flex flex-col gap-4 w-full pb-28",
      !hideWrapper && "bg-white rounded-2xl",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div ref={_ref} className={wrapperClass}>
        <span className="font-bold text-md">Comments</span>
        {inputPosition === "top" && InputBar}
        <FreshRepliesCtx.Provider
          value={{ map: newRepliesMap, clear: clearFresh }}
        >
          <div
            ref={listRef}
            className="flex flex-col divide-y divide-neutral-100 overflow-y-auto"
          >
            {comments.length === 0 ? (
              <p className="text-sm text-center text-mountain-500 py-4">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              comments.map((c) => (
                <CommentRow
                  targetId={targetId}
                  targetType={targetType}
                  key={c.id}
                  comment={c}
                  onLike={handleLike}
                  onSubmitReply={(parentId, content) =>
                    requireAuth("reply to comments", () =>
                      handleAdd(content, parentId),
                    )
                  }
                  onReply={(id, username) => {
                    setReplyParentId(id);
                    setNewComment(`@${username} `);
                    textareaRef.current?.focus();
                  }}
                  onDelete={handleDelete}
                  onRepliesFetched={attachReplies}
                  editingId={editingId}
                  onStartEdit={startEdit}
                  onAbortEdit={abortEdit}
                  onCommitEdit={commitEdit}
                />
              ))
            )}
          </div>
        </FreshRepliesCtx.Provider>
        {inputPosition === "bottom" && InputBar}
        {/* input */}

        {deletingId && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center text-sm">
            <CircularProgress size={20} />
            <span className="ml-2">Deleting…</span>
          </div>
        )}
      </div>
    );
  },
);

CommentSection.displayName = "PostComments";
export default CommentSection;
