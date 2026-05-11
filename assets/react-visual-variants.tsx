import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

export type VisualVariantOption = {
  id: string;
  label?: string;
  description?: string;
};

export type VisualVariantSwitcherProps = {
  variants: VisualVariantOption[];
  defaultVariant?: string;
  storageKey?: string;
  queryParam?: string;
  label?: string;
  root?: HTMLElement | null;
  enableKeyboardShortcuts?: boolean;
  onChange?: (variant: string) => void;
};

const DEFAULT_STORAGE_KEY = "visual-variant";
const DEFAULT_QUERY_PARAM = "variant";

export function useVisualVariant({
  variants,
  defaultVariant,
  storageKey = DEFAULT_STORAGE_KEY,
  queryParam = DEFAULT_QUERY_PARAM,
  root,
  enableKeyboardShortcuts = true,
  onChange,
}: VisualVariantSwitcherProps) {
  const variantIds = useMemo(() => variants.map((variant) => variant.id), [variants]);

  const [current, setCurrent] = useState(() => {
    if (variants.length === 0) {
      return "";
    }

    const fromUrl =
      typeof window === "undefined"
        ? null
        : new URLSearchParams(window.location.search).get(queryParam);

    if (fromUrl && variants.some((variant) => variant.id === fromUrl)) {
      return fromUrl;
    }

    const stored =
      typeof window === "undefined" ? null : window.localStorage.getItem(storageKey);

    if (stored && variants.some((variant) => variant.id === stored)) {
      return stored;
    }

    return defaultVariant ?? variants[0].id;
  });

  useEffect(() => {
    if (variantIds.length === 0) {
      return;
    }

    if (!variantIds.includes(current)) {
      setCurrent(variantIds[0]);
    }
  }, [current, variantIds]);

  useEffect(() => {
    if (!current) {
      return;
    }

    const target = root ?? document.documentElement;
    target.dataset.visualVariant = current;
    window.localStorage.setItem(storageKey, current);
    syncQueryParam(queryParam, current);
    onChange?.(current);
  }, [current, onChange, queryParam, root, storageKey]);

  useEffect(() => {
    const target = root ?? document.documentElement;

    return () => {
      delete target.dataset.visualVariant;
    };
  }, [root]);

  useEffect(() => {
    if (!enableKeyboardShortcuts) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.altKey || event.ctrlKey || event.metaKey || isTypingTarget(event.target)) {
        return;
      }

      const index = Number(event.key) - 1;

      if (Number.isInteger(index) && index >= 0 && index < variantIds.length) {
        setCurrent(variantIds[index]);
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enableKeyboardShortcuts, variantIds]);

  return {
    current,
    setCurrent,
  };
}

function syncQueryParam(queryParam: string, current: string) {
  if (!queryParam || typeof window === "undefined") {
    return;
  }

  const url = new URL(window.location.href);
  url.searchParams.set(queryParam, current);
  window.history.replaceState(window.history.state, "", url);
}

export function VisualVariantSwitcher(props: VisualVariantSwitcherProps) {
  const { variants, label = "style" } = props;
  const { current, setCurrent } = useVisualVariant(props);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setMountNode(document.body);
  }, []);

  if (variants.length === 0 || !mountNode) {
    return null;
  }

  return createPortal(
    <div
      data-visual-variant-switcher="1"
      style={{
        position: "absolute",
        bottom: 12,
        left: 12,
        zIndex: 2147483647,
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "3px 5px",
        border: "0",
        background: "transparent",
        color: "#111827",
        font: "12px system-ui, sans-serif",
        lineHeight: 1.4,
      }}
    >
      <span>{label}:</span>
      {variants.map((variant) => {
        const selected = variant.id === current;
        const text = selected ? `[${variant.label ?? variant.id}]` : (variant.label ?? variant.id);

        return (
          <span key={variant.id} style={{ display: "inline-flex", gap: 6 }}>
            {variant !== variants[0] ? <span aria-hidden="true">|</span> : null}
            <button
              type="button"
              title={variant.description}
              aria-label={variant.description ? `${text}: ${variant.description}` : text}
              aria-pressed={selected}
              onClick={() => setCurrent(variant.id)}
              style={{
                border: 0,
                padding: 0,
                cursor: "pointer",
                background: "transparent",
                color: "inherit",
                font: "inherit",
              }}
            >
              {text}
            </button>
          </span>
        );
      })}
    </div>,
    mountNode,
  );
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tag = target.tagName.toLowerCase();
  return tag === "input" || tag === "textarea" || tag === "select" || target.isContentEditable;
}
