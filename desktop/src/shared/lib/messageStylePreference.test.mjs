import assert from "node:assert/strict";
import test from "node:test";

const values = new Map();
const attributes = new Map();

globalThis.localStorage = {
  getItem: (key) => values.get(key) ?? null,
  setItem: (key, value) => values.set(key, String(value)),
};
globalThis.document = {
  documentElement: {
    setAttribute: (name, value) => attributes.set(name, value),
  },
};

const preference = await import("./messageStylePreference.ts");

test("defaults invalid and missing message styles to classic", () => {
  assert.equal(preference.parseMessageStyle(null), "classic");
  assert.equal(preference.parseMessageStyle("plain"), "classic");
  assert.equal(preference.parseMessageStyle("classic"), "classic");
  assert.equal(preference.parseMessageStyle("bubbles"), "bubbles");
});

test("persists and applies the selected message style", () => {
  preference.setMessageStyle("bubbles");
  assert.equal(preference.getMessageStyle(), "bubbles");
  assert.equal(preference.getSavedMessageStyle(), "bubbles");
  assert.equal(values.get(preference.MESSAGE_STYLE_STORAGE_KEY), "bubbles");
  assert.equal(attributes.get("data-message-style"), "bubbles");
});

test("previews a style without changing the saved preference", () => {
  preference.setMessageStyle("classic");
  preference.previewMessageStyle("bubbles");
  assert.equal(preference.getMessageStyle(), "bubbles");
  assert.equal(preference.getSavedMessageStyle(), "classic");
  assert.equal(values.get(preference.MESSAGE_STYLE_STORAGE_KEY), "classic");
  assert.equal(attributes.get("data-message-style"), "bubbles");

  preference.previewMessageStyle(null);
  assert.equal(preference.getMessageStyle(), "classic");
  assert.equal(attributes.get("data-message-style"), "classic");
});

test("initializes from the persisted message style", () => {
  values.set(preference.MESSAGE_STYLE_STORAGE_KEY, "bubbles");
  preference.initializeMessageStylePreference();
  assert.equal(preference.getMessageStyle(), "bubbles");
  assert.equal(preference.getSavedMessageStyle(), "bubbles");
});
