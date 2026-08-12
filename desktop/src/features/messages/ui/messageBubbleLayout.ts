export const MESSAGE_BUBBLE_CONTENT_PADDING_CLASSES = "px-3.5 pt-2.5";

export function getMessageBubbleBottomPaddingClass(
  hasReactions: boolean,
): string {
  return hasReactions ? "pb-5" : "pb-2.5";
}

export function getMessageBubbleLayout(
  isContinuation: boolean,
  isFollowedByContinuation: boolean,
) {
  const radiusClass = `rounded-r-2xl ${
    isContinuation ? "rounded-tl-md" : "rounded-tl-2xl"
  } ${isFollowedByContinuation ? "rounded-bl-md" : "rounded-bl-2xl"}`;
  const rowSpacingClass = isContinuation
    ? isFollowedByContinuation
      ? "py-0.5"
      : "pb-conversation-row pt-0.5"
    : isFollowedByContinuation
      ? "pb-0.5 pt-conversation-row"
      : "py-conversation-row";

  return { radiusClass, rowSpacingClass };
}
