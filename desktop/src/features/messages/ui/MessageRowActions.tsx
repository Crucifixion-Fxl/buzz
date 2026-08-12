import type {
  TimelineMessage,
  TimelineReaction,
} from "@/features/messages/types";
import { cn } from "@/shared/lib/cn";
import { MessageActionBar } from "./MessageActionBar";

type MessageRowActionsProps = {
  actionBarPlacement: "floating" | "inside";
  anchorToBubble: boolean;
  channelId?: string | null;
  isContinuation: boolean;
  isFollowingThread?: boolean;
  isUnread?: boolean;
  message: TimelineMessage;
  onDelete?: (message: TimelineMessage) => void;
  onEdit?: (message: TimelineMessage) => void;
  onFollowThread?: (message: TimelineMessage) => void;
  onMarkRead?: (message: TimelineMessage) => void;
  onMarkUnread?: (message: TimelineMessage) => void;
  onReactionBadgeBurstRequest?: (emoji: string) => void;
  onReactionSelect?: (emoji: string) => Promise<void>;
  onRemindLater?: (message: TimelineMessage) => void;
  onReply?: (message: TimelineMessage) => void;
  onSendToChannel?: (message: TimelineMessage) => Promise<void>;
  onUnfollowThread?: (message: TimelineMessage) => void;
  reactionErrorMessage?: string | null;
  reactions: TimelineReaction[];
  showMessageBubbles: boolean;
};

export function MessageRowActions({
  actionBarPlacement,
  anchorToBubble,
  channelId,
  isContinuation,
  isFollowingThread,
  isUnread,
  message,
  onDelete,
  onEdit,
  onFollowThread,
  onMarkRead,
  onMarkUnread,
  onReactionBadgeBurstRequest,
  onReactionSelect,
  onRemindLater,
  onReply,
  onSendToChannel,
  onUnfollowThread,
  reactionErrorMessage,
  reactions,
  showMessageBubbles,
}: MessageRowActionsProps) {
  const floatingPosition = isContinuation
    ? showMessageBubbles
      ? "sm:-top-1 sm:-translate-y-1/2"
      : "sm:-top-3 sm:-translate-y-1/2"
    : showMessageBubbles
      ? "sm:top-2 sm:-translate-y-1/2"
      : "sm:top-0 sm:-translate-y-1/2";

  return (
    <div
      className={cn(
        "absolute z-10",
        showMessageBubbles
          ? anchorToBubble
            ? "-right-2 -top-2"
            : "right-1 top-1"
          : "right-2 top-1 sm:pointer-events-none",
        !showMessageBubbles &&
          (actionBarPlacement === "floating"
            ? floatingPosition
            : "sm:top-1 sm:translate-y-0"),
      )}
    >
      <MessageActionBar
        channelId={channelId}
        isFollowingThread={isFollowingThread}
        isUnread={isUnread}
        message={message}
        onDelete={onDelete}
        onEdit={onEdit}
        onFollowThread={onFollowThread}
        onMarkRead={onMarkRead}
        onMarkUnread={onMarkUnread}
        onReactionBadgeBurstRequest={onReactionBadgeBurstRequest}
        onReactionSelect={onReactionSelect}
        onRemindLater={onRemindLater}
        onReply={onReply}
        onSendToChannel={onSendToChannel}
        onUnfollowThread={onUnfollowThread}
        presentation={showMessageBubbles ? "menu" : "tray"}
        reactionErrorMessage={reactionErrorMessage}
        reactions={reactions}
      />
    </div>
  );
}
