import { Intent, Position, Tooltip } from "@blueprintjs/core";
import hljs from "highlight.js";
import React from "react";

export const highlight = (str, lang) => {
  if (lang != null && hljs.getLanguage(lang)) {
    try {
      return hljs.highlight(lang, str).value;
    } catch (err) {
      console.error(err.stack);
    }
  }

  try {
    return hljs.highlightAuto(str).value;
  } catch (err) {
    console.error(err.stack);
  }

  return "";
};

const decorate = (content, intent, child) => (
  <Tooltip
    content={content}
    intent={intent}
    position={Position.RIGHT}
    inline
    defaultIsOpen
    isOpen
  >
    {child}
  </Tooltip>
);

export const renderTextInput = ({
  input,
  label,
  meta: { touched, error, warning },
  placeholder,
  required,
  className,
  ...props
}) => {
  const widget = (
    <label className="bp3-label">
      {label} {required && <span className="bp3-text-muted">(required)</span>}
      <input
        className={`bp3-input ${className || ""}`}
        type="text"
        dir="auto"
        placeholder={placeholder}
        {...input}
        {...props}
      />
    </label>
  );

  if (touched) {
    if (error) {
      return decorate(error, Intent.DANGER, widget);
    }

    if (warning) {
      return decorate(warning, Intent.WARNING, widget);
    }
  }

  return widget;
};
