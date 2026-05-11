import { computed, onMounted, onUnmounted, ref, watch } from "vue";

export type VisualVariantOption = {
  id: string;
  label?: string;
  description?: string;
};

export type VisualVariantOptions = {
  variants: VisualVariantOption[];
  defaultVariant?: string;
  storageKey?: string;
  queryParam?: string;
  label?: string;
  root?: HTMLElement;
  enableKeyboardShortcuts?: boolean;
  onChange?: (variant: string) => void;
};

const DEFAULT_STORAGE_KEY = "visual-variant";
const DEFAULT_QUERY_PARAM = "variant";

export function useVisualVariant(options: VisualVariantOptions) {
  const storageKey = options.storageKey ?? DEFAULT_STORAGE_KEY;
  const queryParam = options.queryParam ?? DEFAULT_QUERY_PARAM;
  const variantIds = computed(() => options.variants.map((variant) => variant.id));
  const current = ref(resolveInitialVariant(options, storageKey, queryParam));
  let target: HTMLElement | undefined;

  onMounted(() => {
    target = options.root ?? document.documentElement;
    applyVariant();

    if (options.enableKeyboardShortcuts ?? true) {
      window.addEventListener("keydown", onKeyDown);
    }
  });

  onUnmounted(() => {
    if (target) {
      delete target.dataset.visualVariant;
    }

    window.removeEventListener("keydown", onKeyDown);
  });

  watch(current, applyVariant);

  function setVariant(next: string) {
    current.value = variantIds.value.includes(next) ? next : variantIds.value[0] ?? "";
  }

  function applyVariant() {
    if (!target || !current.value) {
      return;
    }

    target.dataset.visualVariant = current.value;
    window.localStorage.setItem(storageKey, current.value);
    syncQueryParam(queryParam, current.value);
    options.onChange?.(current.value);
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.altKey || event.ctrlKey || event.metaKey || isTypingTarget(event.target)) {
      return;
    }

    const index = Number(event.key) - 1;

    if (Number.isInteger(index) && index >= 0 && index < variantIds.value.length) {
      setVariant(variantIds.value[index]);
    }
  }

  return {
    current,
    setVariant,
  };
}

function resolveInitialVariant(
  options: VisualVariantOptions,
  storageKey: string,
  queryParam: string,
): string {
  if (options.variants.length === 0) {
    return "";
  }

  if (typeof window !== "undefined") {
    const fromUrl = new URLSearchParams(window.location.search).get(queryParam);

    if (fromUrl && options.variants.some((variant) => variant.id === fromUrl)) {
      return fromUrl;
    }

    const stored = window.localStorage.getItem(storageKey);

    if (stored && options.variants.some((variant) => variant.id === stored)) {
      return stored;
    }
  }

  return options.defaultVariant ?? options.variants[0].id;
}

export function mountVisualVariantSwitcher(
  options: VisualVariantOptions & {
    position?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
  },
) {
  if (options.variants.length === 0) {
    throw new Error("mountVisualVariantSwitcher requires at least one variant.");
  }

  const root = options.root ?? document.documentElement;
  const storageKey = options.storageKey ?? DEFAULT_STORAGE_KEY;
  const queryParam = options.queryParam ?? DEFAULT_QUERY_PARAM;
  const enableKeyboardShortcuts = options.enableKeyboardShortcuts ?? true;
  const labelText = options.label ?? "style";
  const current = ref(resolveInitialVariant(options, storageKey, queryParam));
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

  options.variants.forEach((variant, index) => {
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
    setVariant(current.value);
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
    current.value = options.variants.some((variant) => variant.id === next)
      ? next
      : options.variants[0].id;
    root.dataset.visualVariant = current.value;
    window.localStorage.setItem(storageKey, current.value);
    syncQueryParam(queryParam, current.value);

    for (const [id, button] of buttons) {
      const selected = id === current.value;
      const variant = options.variants.find((option) => option.id === id);
      const text = variant?.label ?? id;
      button.textContent = selected ? `[${text}]` : text;
      button.setAttribute(
        "aria-label",
        variant?.description ? `${text}: ${variant.description}` : text,
      );
    }

    options.onChange?.(current.value);
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.altKey || event.ctrlKey || event.metaKey || isTypingTarget(event.target)) {
      return;
    }

    const index = Number(event.key) - 1;

    if (Number.isInteger(index) && index >= 0 && index < options.variants.length) {
      setVariant(options.variants[index].id);
    }
  }

  return {
    current,
    setVariant,
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

function syncQueryParam(queryParam: string, current: string) {
  if (!queryParam || typeof window === "undefined") {
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
