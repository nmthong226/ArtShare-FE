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
  postId: number;
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
}

const CommentRow = ({
  postId,
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
}: RowProps) => {
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

  useEffect(() => {
    const prev = prevReplyCountRef.current;
    const curr = comment.replies?.length ?? 0;
    if (prev === 0 && curr > 0 && !showReplies) {
      setShowReplies(true);
    }
    prevReplyCountRef.current = curr;
  }, [comment.replies, showReplies]);

  const toggleReplies = async () => {
    const needsToFetch =
      !showReplies &&
      (comment.replies === undefined ||
        (comment.replies.length === 0 && (comment.reply_count ?? 0) > 0));

    if (needsToFetch) {
      try {
        setLoading(true);
        const fetchedReplies = await fetchComments(postId, comment.id);
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
    setShowReplies((s) => !s);
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
              className="text-neutral-500 dark:text-neutral-400 text-xs"
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
                  requireAuth("reply to comments", () =>
                    onReply(comment.id, comment.user.username),
                  )
                }
              >
                Reply
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

      {/* Replies */}
      {((comment.reply_count ?? 0) > 0 ||
        (comment.replies?.length ?? 0) > 0) && (
        <div className="flex flex-col gap-1" style={{ marginLeft: INDENT }}>
          <button
            onClick={toggleReplies}
            disabled={loading && !showReplies}
            className="flex items-center gap-1 text-xs text-blue-600 disabled:text-neutral-400 dark:text-blue-200"
          >
            {showReplies ? <ChevronUp size={14} /> : <ChevronDown size={14} />}{" "}
            {showReplies ? "Hide" : "View"}{" "}
            {comment.replies
              ? `${comment.replies.length} ${comment.replies.length === 1 ? "reply" : "replies"}`
              : "replies"}
          </button>

          {showReplies &&
            comment.replies &&
            comment.replies.length > 0 &&
            comment.replies.map((r: CommentUI) => (
              <CommentRow
                postId={postId}
                key={r.id}
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
              />
            ))}
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
  postId: number;
  onCommentAdded(): void;
  onCommentDeleted(): void;
}

const PostComments = forwardRef<HTMLDivElement, Props>(
  ({ comments: initial, postId, onCommentAdded, onCommentDeleted }, _ref) => {
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

    useEffect(() => {
      setComments(initial);
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
    const handleAdd = async () => {
      const content = newComment.trim();
      if (!content) return;

      const tmpId = Date.now();
      const now = new Date();
      const parentId = replyParentId;

      const optimistic: CommentUI = {
        id: tmpId,
        user_id: CURRENT_USER_ID || "",
        user: {
          id: CURRENT_USER_ID!,
          username: user?.username || "",
          profile_picture_url: user?.profile_picture_url,
        } as User,
        parent_comment_id: replyParentId,
        target_id: postId,
        target_type: "POST",
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

      listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      // Clear input and set states
      setNewComment("");
      onCommentAdded();
      setReplyParentId(null);
      setIsPosting(true);

      try {
        const payload: CreateCommentDto = {
          content,
          target_id: postId,
          target_type: "POST",
          parent_comment_id: parentId ?? undefined,
        };

        const { data } = await createComment(payload);

        // Replace the optimistic comment while preserving hierarchy
        if (parentId) {
          // For replies, update within the nested structure
          setComments((prev) =>
            prev.map((comment) => {
              if (comment.id === replyParentId) {
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
                    replyParentId,
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

        setTimeout(() => {
          if (replyParentId) {
            const parentEl = document.getElementById(
              `comment-${replyParentId}`,
            );
            if (parentEl) {
              parentEl.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          } else {
            listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
          }
        }, 100);
        setReplyParentId(null);
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
          const data = await fetchComments(postId);
          setComments(data as CommentUI[]);
        } catch (err) {
          console.error("Failed to load comments:", err);
          showSnackbar("Failed to load comments", "error");
        }
      };
      if (postId) {
        loadComments();
      }
    }, [postId, showSnackbar]);

    return (
      <div
        ref={_ref}
        className="flex flex-col gap-4 bg-white dark:bg-mountain-950 rounded-2xl w-full pb-28"
      >
        <h4 className="font-bold text-sm">Comments</h4>

        <div ref={listRef} className="flex flex-col overflow-y-auto">
          {comments.length === 0 ? (
            <p className="text-sm text-center text-mountain-500 py-4">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            comments.map((c) => (
              <CommentRow
                postId={postId}
                key={c.id}
                comment={c}
                onLike={handleLike}
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

        {/* input */}
        <div className="right-0 bottom-0 left-0 absolute flex gap-2 bg-white dark:bg-mountain-950 p-4 border-t-[1px] border-mountain-200 rounded-2xl rounded-t-none">
          {user?.profile_picture_url ? (
            <img
              src={user.profile_picture_url}
              alt={user.username}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : user ? (
            <Avatar
              name={user.username || ""}
              size={32}
              variant="beam"
              colors={["#84bfc3", "#ff9b62", "#d96153"]}
            />
          ) : (
            <Avatar
              name="Guest"
              size={32}
              variant="beam"
              colors={["#84bfc3", "#ff9b62", "#d96153"]}
            />
          )}
          <div className="flex flex-grow gap-2">
            <TextareaAutosize
              ref={textareaRef}
              placeholder={
                user
                  ? replyParentId
                    ? `Replying to...`
                    : "Add a comment"
                  : "Login to add a comment"
              }
              className="border border-neutral-300 rounded-lg p-3 w-full resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={isPosting || !user}
              onFocus={() => {
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
                  textareaRef.current?.blur();
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (newComment.trim()) {
                    requireAuth("comment", handleAdd);
                  }
                }
              }}
            />

            <Button
              variant="contained"
              className="p-0.5 min-w-auto h-12 aspect-[1/1]"
              onClick={() => requireAuth("comment", handleAdd)}
              disabled={!newComment.trim() || isPosting || !user}
            >
              {isPosting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <SendHorizontal />
              )}
            </Button>
          </div>
        </div>

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

PostComments.displayName = "PostComments";
export default PostComments;
