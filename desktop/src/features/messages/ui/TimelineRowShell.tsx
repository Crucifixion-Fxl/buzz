import type * as React from "react";
import { timelineRowReserveStyle } from "@/features/messages/lib/rowHeightEstimate";
import {
  getTimelineItemKey,
  type TimelineNonDayItem,
} from "@/features/messages/lib/timelineItems";
import { cn } from "@/shared/lib/cn";
import { useMessageStyle } from "@/shared/lib/messageStylePreference";

export function TimelineRowShell({
  children,
  item,
  useContentVisibility = true,
}: {
  children: React.ReactNode;
  item: TimelineNonDayItem;
  useContentVisibility?: boolean;
}) {
  const messageStyle = useMessageStyle();

  return (
    <div
      className={cn(useContentVisibility && "timeline-row-cv")}
      data-timeline-item-key={getTimelineItemKey(item)}
      style={
        useContentVisibility
          ? timelineRowReserveStyle(item, messageStyle)
          : undefined
      }
    >
      {children}
    </div>
  );
}
