import { computed, onMounted, onUnmounted, ref, watch } from "vue";

export type VisualVariantOption = {
  id: string;
  label?: string;
};

export type VisualVariantOptions = {
  variants: VisualVariantOption[];
  defaultVariant?: string;
  storageKey?: string;
  root?: HTMLElement;
  onChange?: (variant: string) => void;
};

const DEFAULT_STORAGE_KEY = "visual-variant";

export function useVisualVariant(options: VisualVariantOptions) {
  const storageKey = options.storageKey ?? DEFAULT_STORAGE_KEY;
  const variantIds = computed(() => options.variants.map((variant) => variant.id));
  const current = ref(resolveInitialVariant(options, storageKey));
  let target: HTMLElement | undefined;

  onMounted(() => {
    target = options.root ?? document.documentElement;
    applyVariant();
  });

  onUnmounted(() => {
    if (target) {
      delete target.dataset.visualVariant;
    }
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
    options.onChange?.(current.value);
  }

  return {
    current,
    setVariant,
  };
}

function resolveInitialVariant(
  options: VisualVariantOptions,
  storageKey: string,
): string {
  if (options.variants.length === 0) {
    return "";
  }

  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem(storageKey);

    if (stored && options.variants.some((variant) => variant.id === stored)) {
      return stored;
    }
  }

  return options.defaultVariant ?? options.variants[0].id;
}
