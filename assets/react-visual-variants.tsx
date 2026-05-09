import { useEffect, useMemo, useState } from "react";

export type VisualVariantOption = {
  id: string;
  label?: string;
};

export type VisualVariantSwitcherProps = {
  variants: VisualVariantOption[];
  defaultVariant?: string;
  storageKey?: string;
  root?: HTMLElement | null;
  onChange?: (variant: string) => void;
};

const DEFAULT_STORAGE_KEY = "visual-variant";

export function useVisualVariant({
  variants,
  defaultVariant,
  storageKey = DEFAULT_STORAGE_KEY,
  root,
  onChange,
}: VisualVariantSwitcherProps) {
  const variantIds = useMemo(() => variants.map((variant) => variant.id), [variants]);

  const [current, setCurrent] = useState(() => {
    if (variants.length === 0) {
      return "";
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
    onChange?.(current);
  }, [current, onChange, root, storageKey]);

  useEffect(() => {
    const target = root ?? document.documentElement;

    return () => {
      delete target.dataset.visualVariant;
    };
  }, [root]);

  return {
    current,
    setCurrent,
  };
}

export function VisualVariantSwitcher(props: VisualVariantSwitcherProps) {
  const { variants } = props;
  const { current, setCurrent } = useVisualVariant(props);

  if (variants.length === 0) {
    return null;
  }

  return (
    <div
      data-visual-variant-switcher="1"
      style={{
        position: "fixed",
        bottom: 12,
        left: 12,
        zIndex: 2147483647,
        display: "flex",
        gap: 4,
        padding: 6,
        border: "1px solid rgba(255,255,255,.18)",
        borderRadius: 8,
        background: "rgba(15, 23, 42, .86)",
        backdropFilter: "blur(10px)",
        font: "12px system-ui, sans-serif",
      }}
    >
      <span style={{ color: "rgba(255,255,255,.72)", padding: "4px 6px" }}>
        Variants
      </span>
      {variants.map((variant) => {
        const selected = variant.id === current;

        return (
          <button
            key={variant.id}
            type="button"
            aria-pressed={selected}
            onClick={() => setCurrent(variant.id)}
            style={{
              border: 0,
              borderRadius: 6,
              padding: "4px 7px",
              cursor: "pointer",
              background: selected ? "#ffffff" : "rgba(255,255,255,.12)",
              color: selected ? "#0f172a" : "#ffffff",
            }}
          >
            {variant.label ?? variant.id}
          </button>
        );
      })}
    </div>
  );
}
