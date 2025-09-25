import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";

export { default as UiTextarea } from "./Textarea.vue";

export const textareaVariants = cva(
  "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md  px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm placeholder:text-sm min-h-[108px]",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        secondary: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export const textareaWrapperVariants = cva(
  "border-b border-[rgba(51,51,51,1)]",
  {
    variants: {
      variant: {
        default: "bg-[rgba(0,0,0,0.1)]",
        secondary: "bg-[rgba(174,174,174,0.1)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type TextareaVariants = VariantProps<typeof textareaVariants>;
