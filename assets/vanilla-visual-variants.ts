export type VisualVariantOption = {
  id: string;
  label?: string;
  description?: string;
};

export type VisualVariantSwitcherOptions = {
  variants: VisualVariantOption[];
  defaultVariant?: string;
  storageKey?: string;
  queryParam?: string;
  label?: string;
  root?: HTMLElement;
  position?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
  enableKeyboardShortcuts?: boolean;
  onChange?: (variant: string) => void;
};

export type VisualVariantSwitcher = {
  set: (variant: string) => void;
  get: () => string;
  destroy: () => void;
};

const DEFAULT_STORAGE_KEY = "visual-variant";
const DEFAULT_QUERY_PARAM = "variant";

export function mountVisualVariantSwitcher(
  options: VisualVariantSwitcherOptions,
): VisualVariantSwitcher {
  const root = options.root ?? document.documentElement;
  const storageKey = options.storageKey ?? DEFAULT_STORAGE_KEY;
  const queryParam = options.queryParam ?? DEFAULT_QUERY_PARAM;
  const enableKeyboardShortcuts = options.enableKeyboardShortcuts ?? true;
  const labelText = options.label ?? "style";
  const variants = options.variants;

  if (variants.length === 0) {
    throw new Error("mountVisualVariantSwitcher requires at least one variant.");
  }

  const initialVariant =
    readUrlVariant(queryParam, variants) ??
    readStoredVariant(storageKey, variants) ??
    options.defaultVariant ??
    variants[0].id;

  let current = normalizeVariant(initialVariant, variants);
  const el = document.createElement("div");
  const buttons = new Map<string, HTMLButtonElement>();

  el.setAttribute("data-visual-variant-switcher", "1");
  el.style.position = "absolute";
  el.style.zIndex = "2147483647";
  el.style.display = "flex";
  el.style.alignItems = "center";
  el.style.gap = "6px";
  el.style.padding = "3px 5px";
  el.style.border = "0";
  el.style.background = "transparent";
  el.style.color = "#111827";
  el.style.font = "12px system-ui, sans-serif";
  el.style.lineHeight = "1.4";

  applyPosition(el, options.position ?? "bottom-left");

  const label = document.createElement("span");
  label.textContent = `${labelText}:`;
  el.append(label);

  variants.forEach((variant, index) => {
    if (index > 0) {
      const separator = document.createElement("span");
      separator.textContent = "|";
      separator.setAttribute("aria-hidden", "true");
      el.append(separator);
    }

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = variant.label ?? variant.id;
    if (variant.description) {
      button.title = variant.description;
    }
    button.style.border = "0";
    button.style.padding = "0";
    button.style.cursor = "pointer";
    button.style.background = "transparent";
    button.style.color = "inherit";
    button.style.font = "inherit";
    button.addEventListener("click", () => setVariant(variant.id));
    buttons.set(variant.id, button);
    el.append(button);
  });

  const mount = () => {
    document.body.append(el);
    setVariant(current);
  };

  if (document.body) {
    mount();
  } else {
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  }

  if (enableKeyboardShortcuts) {
    window.addEventListener("keydown", onKeyDown);
  }

  function setVariant(next: string) {
    current = normalizeVariant(next, variants);
    root.dataset.visualVariant = current;
    localStorage.setItem(storageKey, current);
    syncQueryParam(queryParam, current);

    for (const [id, button] of buttons) {
      const selected = id === current;
      const variant = variants.find((option) => option.id === id);
      const text = variant?.label ?? id;
      button.textContent = selected ? `[${text}]` : text;
      button.setAttribute(
        "aria-label",
        variant?.description ? `${text}: ${variant.description}` : text,
      );
    }

    options.onChange?.(current);
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.altKey || event.ctrlKey || event.metaKey || isTypingTarget(event.target)) {
      return;
    }

    const index = Number(event.key) - 1;

    if (Number.isInteger(index) && index >= 0 && index < variants.length) {
      setVariant(variants[index].id);
    }
  }

  return {
    set: setVariant,
    get: () => current,
    destroy: () => {
      window.removeEventListener("keydown", onKeyDown);
      el.remove();
      delete root.dataset.visualVariant;
    },
  };
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tag = target.tagName.toLowerCase();
  return tag === "input" || tag === "textarea" || tag === "select" || target.isContentEditable;
}

function readUrlVariant(
  queryParam: string,
  variants: VisualVariantOption[],
): string | undefined {
  if (!queryParam) {
    return undefined;
  }

  const selected = new URLSearchParams(window.location.search).get(queryParam);
  return selected && variants.some((variant) => variant.id === selected)
    ? selected
    : undefined;
}

function readStoredVariant(
  storageKey: string,
  variants: VisualVariantOption[],
): string | undefined {
  const stored = localStorage.getItem(storageKey);
  return stored && variants.some((variant) => variant.id === stored)
    ? stored
    : undefined;
}

function normalizeVariant(
  variant: string,
  variants: VisualVariantOption[],
): string {
  return variants.some((option) => option.id === variant)
    ? variant
    : variants[0].id;
}

function syncQueryParam(queryParam: string, current: string) {
  if (!queryParam) {
    return;
  }

  const url = new URL(window.location.href);
  url.searchParams.set(queryParam, current);
  window.history.replaceState(window.history.state, "", url);
}

function applyPosition(el: HTMLElement, position: string) {
  const offset = "12px";

  if (position.includes("bottom")) {
    el.style.bottom = offset;
  } else {
    el.style.top = offset;
  }

  if (position.includes("right")) {
    el.style.right = offset;
  } else {
    el.style.left = offset;
  }
}
