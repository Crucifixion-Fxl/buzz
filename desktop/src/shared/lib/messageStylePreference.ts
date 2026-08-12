import * as React from "react";

/** Device-level presentation used across conversation surfaces. */
export type MessageStyle = "classic" | "bubbles";

export const MESSAGE_STYLE_STORAGE_KEY = "buzz.appearance.messageStyle";
export const DEFAULT_MESSAGE_STYLE: MessageStyle = "classic";

const savedListeners = new Set<() => void>();
const appliedListeners = new Set<() => void>();
let savedMessageStyle: MessageStyle = DEFAULT_MESSAGE_STYLE;
let appliedMessageStyle: MessageStyle = DEFAULT_MESSAGE_STYLE;

export function parseMessageStyle(
  value: string | null | undefined,
): MessageStyle {
  return value === "classic" || value === "bubbles"
    ? value
    : DEFAULT_MESSAGE_STYLE;
}

function readStoredMessageStyle(): MessageStyle {
  try {
    return parseMessageStyle(
      globalThis.localStorage?.getItem(MESSAGE_STYLE_STORAGE_KEY),
    );
  } catch {
    return DEFAULT_MESSAGE_STYLE;
  }
}

function applyMessageStyle(style: MessageStyle): void {
  globalThis.document?.documentElement?.setAttribute(
    "data-message-style",
    style,
  );
}

function notify(listeners: Set<() => void>): void {
  for (const listener of listeners) listener();
}

/** Apply the persisted preference before React renders to avoid a layout jump. */
export function initializeMessageStylePreference(): void {
  const nextStyle = readStoredMessageStyle();
  const savedChanged = nextStyle !== savedMessageStyle;
  const appliedChanged = nextStyle !== appliedMessageStyle;
  savedMessageStyle = nextStyle;
  appliedMessageStyle = nextStyle;
  applyMessageStyle(nextStyle);
  if (savedChanged) notify(savedListeners);
  if (appliedChanged) notify(appliedListeners);
}

function subscribeSaved(listener: () => void): () => void {
  savedListeners.add(listener);
  return () => savedListeners.delete(listener);
}

function subscribeApplied(listener: () => void): () => void {
  appliedListeners.add(listener);
  return () => appliedListeners.delete(listener);
}

export function getMessageStyle(): MessageStyle {
  return appliedMessageStyle;
}

export function getSavedMessageStyle(): MessageStyle {
  return savedMessageStyle;
}

export function setMessageStyle(style: MessageStyle): void {
  const savedChanged = style !== savedMessageStyle;
  const appliedChanged = style !== appliedMessageStyle;
  savedMessageStyle = style;
  appliedMessageStyle = style;
  applyMessageStyle(style);
  try {
    globalThis.localStorage?.setItem(MESSAGE_STYLE_STORAGE_KEY, style);
  } catch {
    // Persistence is best-effort; the live preference still applies.
  }
  if (savedChanged) notify(savedListeners);
  if (appliedChanged) notify(appliedListeners);
}

/** Temporarily apply a style without changing the saved preference. */
export function previewMessageStyle(style: MessageStyle | null): void {
  const nextStyle = style ?? savedMessageStyle;
  if (nextStyle === appliedMessageStyle) return;
  appliedMessageStyle = nextStyle;
  applyMessageStyle(nextStyle);
  notify(appliedListeners);
}

/** The currently applied style, including a temporary settings preview. */
export function useMessageStyle(): MessageStyle {
  return React.useSyncExternalStore(
    subscribeApplied,
    getMessageStyle,
    () => DEFAULT_MESSAGE_STYLE,
  );
}

/** The persisted style used to mark the selected settings option. */
export function useSavedMessageStyle(): MessageStyle {
  return React.useSyncExternalStore(
    subscribeSaved,
    getSavedMessageStyle,
    () => DEFAULT_MESSAGE_STYLE,
  );
}
