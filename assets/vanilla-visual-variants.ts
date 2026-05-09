export type VisualVariantOption = {
  id: string;
  label?: string;
};

export type VisualVariantSwitcherOptions = {
  variants: VisualVariantOption[];
  defaultVariant?: string;
  storageKey?: string;
  root?: HTMLElement;
  position?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
  onChange?: (variant: string) => void;
};

export type VisualVariantSwitcher = {
  set: (variant: string) => void;
  get: () => string;
  destroy: () => void;
};

const DEFAULT_STORAGE_KEY = "visual-variant";

export function mountVisualVariantSwitcher(
  options: VisualVariantSwitcherOptions,
): VisualVariantSwitcher {
  const root = options.root ?? document.documentElement;
  const storageKey = options.storageKey ?? DEFAULT_STORAGE_KEY;
  const variants = options.variants;

  if (variants.length === 0) {
    throw new Error("mountVisualVariantSwitcher requires at least one variant.");
  }

  const initialVariant =
    readStoredVariant(storageKey, variants) ??
    options.defaultVariant ??
    variants[0].id;

  let current = normalizeVariant(initialVariant, variants);
  const el = document.createElement("div");
  const buttons = new Map<string, HTMLButtonElement>();

  el.setAttribute("data-visual-variant-switcher", "1");
  el.style.position = "fixed";
  el.style.zIndex = "2147483647";
  el.style.display = "flex";
  el.style.gap = "4px";
  el.style.padding = "6px";
  el.style.border = "1px solid rgba(255,255,255,.18)";
  el.style.borderRadius = "8px";
  el.style.background = "rgba(15, 23, 42, .86)";
  el.style.backdropFilter = "blur(10px)";
  el.style.font = "12px system-ui, sans-serif";

  applyPosition(el, options.position ?? "bottom-left");

  const label = document.createElement("span");
  label.textContent = "Variants";
  label.style.color = "rgba(255,255,255,.72)";
  label.style.padding = "4px 6px";
  el.append(label);

  for (const variant of variants) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = variant.label ?? variant.id;
    button.style.border = "0";
    button.style.borderRadius = "6px";
    button.style.padding = "4px 7px";
    button.style.cursor = "pointer";
    button.addEventListener("click", () => setVariant(variant.id));
    buttons.set(variant.id, button);
    el.append(button);
  }

  document.body.append(el);
  setVariant(current);

  function setVariant(next: string) {
    current = normalizeVariant(next, variants);
    root.dataset.visualVariant = current;
    localStorage.setItem(storageKey, current);

    for (const [id, button] of buttons) {
      const selected = id === current;
      button.style.background = selected ? "#ffffff" : "rgba(255,255,255,.12)";
      button.style.color = selected ? "#0f172a" : "#ffffff";
    }

    options.onChange?.(current);
  }

  return {
    set: setVariant,
    get: () => current,
    destroy: () => {
      el.remove();
      delete root.dataset.visualVariant;
    },
  };
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
