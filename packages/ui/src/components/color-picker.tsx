"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import type { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { useRender } from "@base-ui/react/use-render";
import { Button } from "@workspace/ui/components/button";
import { useDirection } from "@workspace/ui/components/direction";
import { Input } from "@workspace/ui/components/input";
import {
  InputGroup,
  InputGroupInput,
} from "@workspace/ui/components/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { VisuallyHiddenInput } from "@workspace/ui/components/visually-hidden-input";
import { useAsRef } from "@workspace/ui/hooks/use-as-ref";
import { useIsomorphicLayoutEffect } from "@workspace/ui/hooks/use-isomorphic-layout-effect";
import { useLazyRef } from "@workspace/ui/hooks/use-lazy-ref";
import { useComposedRefs } from "@workspace/ui/lib/compose-refs";
import { cn } from "@workspace/ui/lib/utils";
import { PipetteIcon } from "lucide-react";
import * as React from "react";

const ROOT_NAME = "ColorPicker";
const ROOT_IMPL_NAME = "ColorPickerImpl";
const TRIGGER_NAME = "ColorPickerTrigger";
const CONTENT_NAME = "ColorPickerContent";
const AREA_NAME = "ColorPickerArea";
const HUE_SLIDER_NAME = "ColorPickerHueSlider";
const ALPHA_SLIDER_NAME = "ColorPickerAlphaSlider";
const SWATCH_NAME = "ColorPickerSwatch";
const EYE_DROPPER_NAME = "ColorPickerEyeDropper";
const FORMAT_SELECT_NAME = "ColorPickerFormatSelect";
const INPUT_NAME = "ColorPickerInput";

const colorFormats = ["hex", "rgb", "hsl", "hsb"] as const;

interface DivProps
  extends React.ComponentProps<"div">, useRender.ComponentProps<"div"> {}

type RootElement = HTMLDivElement;
type AreaElement = HTMLDivElement;
type InputElement = HTMLInputElement;

type PopoverChangeEventDetails = PopoverPrimitive.Root.ChangeEventDetails;

type ColorFormat = (typeof colorFormats)[number];

/**
 * @see https://gist.github.com/bkrmendy/f4582173f50fab209ddfef1377ab31e3
 */
interface EyeDropper {
  open: (options?: { signal?: AbortSignal }) => Promise<{ sRGBHex: string }>;
}

declare global {
  interface Window {
    EyeDropper?: {
      new (): EyeDropper;
    };
  }
}

interface ColorValue {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface HSVColorValue {
  h: number;
  s: number;
  v: number;
  a: number;
}

function hexToRgb(hex: string, alpha?: number): ColorValue {
  const normalized = normalizeHexColor(hex);
  if (!normalized) {
    return { r: 0, g: 0, b: 0, a: alpha ?? 1 };
  }

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(
    normalized,
  );

  if (!result) {
    return { r: 0, g: 0, b: 0, a: alpha ?? 1 };
  }

  const parsedAlpha = result[4]
    ? Number.parseInt(result[4], 16) / 255
    : undefined;

  return {
    r: Number.parseInt(result[1] ?? "0", 16),
    g: Number.parseInt(result[2] ?? "0", 16),
    b: Number.parseInt(result[3] ?? "0", 16),
    a: alpha ?? parsedAlpha ?? 1,
  };
}

function rgbToHex(color: ColorValue, includeAlpha = false): string {
  const toHex = (n: number) => {
    const hex = clamp(Math.round(n), 0, 255).toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };
  const alpha = includeAlpha ? toHex(color.a * 255) : "";
  return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}${alpha}`;
}

function rgbToHsv(color: ColorValue): HSVColorValue {
  const r = color.r / 255;
  const g = color.g / 255;
  const b = color.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  let h = 0;
  if (diff !== 0) {
    switch (max) {
      case r:
        h = ((g - b) / diff) % 6;
        break;
      case g:
        h = (b - r) / diff + 2;
        break;
      case b:
        h = (r - g) / diff + 4;
        break;
    }
  }
  h = Math.round(h * 60);
  if (h < 0) h += 360;

  const s = max === 0 ? 0 : diff / max;
  const v = max;

  return {
    h,
    s: Math.round(s * 100),
    v: Math.round(v * 100),
    a: color.a,
  };
}

function hsvToRgb(hsv: HSVColorValue): ColorValue {
  const h = hsv.h / 360;
  const s = hsv.s / 100;
  const v = hsv.v / 100;

  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  let r: number;
  let g: number;
  let b: number;

  switch (i % 6) {
    case 0: {
      r = v;
      g = t;
      b = p;
      break;
    }
    case 1: {
      r = q;
      g = v;
      b = p;
      break;
    }
    case 2: {
      r = p;
      g = v;
      b = t;
      break;
    }
    case 3: {
      r = p;
      g = q;
      b = v;
      break;
    }
    case 4: {
      r = t;
      g = p;
      b = v;
      break;
    }
    case 5: {
      r = v;
      g = p;
      b = q;
      break;
    }
    default: {
      r = 0;
      g = 0;
      b = 0;
    }
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
    a: hsv.a,
  };
}

function colorToString(color: ColorValue, format: ColorFormat = "hex"): string {
  switch (format) {
    case "hex":
      return rgbToHex(color, color.a < 1);
    case "rgb":
      return color.a < 1
        ? `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
        : `rgb(${color.r}, ${color.g}, ${color.b})`;
    case "hsl": {
      const hsl = rgbToHsl(color);
      return color.a < 1
        ? `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${color.a})`
        : `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    }
    case "hsb": {
      const hsv = rgbToHsv(color);
      return color.a < 1
        ? `hsba(${hsv.h}, ${hsv.s}%, ${hsv.v}%, ${color.a})`
        : `hsb(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`;
    }
    default:
      return rgbToHex(color);
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function normalizeHue(value: number) {
  return ((value % 360) + 360) % 360;
}

function normalizeHexColor(value: string) {
  const match = /^#?([a-f\d]{3,4}|[a-f\d]{6}|[a-f\d]{8})$/i.exec(value.trim());

  if (!match) return null;

  const hex = match[1] ?? "";

  if (hex.length === 3 || hex.length === 4) {
    return `#${hex
      .split("")
      .map((channel) => `${channel}${channel}`)
      .join("")}`.toLowerCase();
  }

  return `#${hex}`.toLowerCase();
}

function rgbToHsl(color: ColorValue) {
  const r = color.r / 255;
  const g = color.g / 255;
  const b = color.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  const sum = max + min;

  const l = sum / 2;

  let h = 0;
  let s = 0;

  if (diff !== 0) {
    s = l > 0.5 ? diff / (2 - sum) : diff / sum;

    if (max === r) {
      h = (g - b) / diff + (g < b ? 6 : 0);
    } else if (max === g) {
      h = (b - r) / diff + 2;
    } else if (max === b) {
      h = (r - g) / diff + 4;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb(
  hsl: { h: number; s: number; l: number },
  alpha = 1,
): ColorValue {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
  const m = l - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (h >= 0 && h < 1 / 6) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 1 / 6 && h < 2 / 6) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 2 / 6 && h < 3 / 6) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 3 / 6 && h < 4 / 6) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 4 / 6 && h < 5 / 6) {
    r = x;
    g = 0;
    b = c;
  } else if (h >= 5 / 6 && h < 1) {
    r = c;
    g = 0;
    b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
    a: alpha,
  };
}

function parseColorString(value: string): ColorValue | null {
  const trimmed = value.trim();

  // Parse hex colors
  const normalizedHex = normalizeHexColor(trimmed);
  if (normalizedHex) {
    return hexToRgb(normalizedHex);
  }

  // Parse rgb/rgba colors
  const rgbMatch = trimmed.match(
    /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)$/,
  );
  if (rgbMatch) {
    return {
      r: clamp(Number.parseInt(rgbMatch[1] ?? "0", 10), 0, 255),
      g: clamp(Number.parseInt(rgbMatch[2] ?? "0", 10), 0, 255),
      b: clamp(Number.parseInt(rgbMatch[3] ?? "0", 10), 0, 255),
      a: rgbMatch[4] ? clamp(Number.parseFloat(rgbMatch[4]), 0, 1) : 1,
    };
  }

  // Parse hsl/hsla colors
  const hslMatch = trimmed.match(
    /^hsla?\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(?:,\s*([\d.]+))?\s*\)$/,
  );
  if (hslMatch) {
    return hslToRgb(
      {
        h: normalizeHue(Number.parseInt(hslMatch[1] ?? "0", 10)),
        s: clamp(Number.parseInt(hslMatch[2] ?? "0", 10), 0, 100),
        l: clamp(Number.parseInt(hslMatch[3] ?? "0", 10), 0, 100),
      },
      hslMatch[4] ? clamp(Number.parseFloat(hslMatch[4]), 0, 1) : 1,
    );
  }

  // Parse hsb/hsba colors
  const hsbMatch = trimmed.match(
    /^hsba?\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(?:,\s*([\d.]+))?\s*\)$/,
  );
  if (hsbMatch) {
    const h = normalizeHue(Number.parseInt(hsbMatch[1] ?? "0", 10));
    const s = clamp(Number.parseInt(hsbMatch[2] ?? "0", 10), 0, 100);
    const v = clamp(Number.parseInt(hsbMatch[3] ?? "0", 10), 0, 100);
    const a = hsbMatch[4] ? clamp(Number.parseFloat(hsbMatch[4]), 0, 1) : 1;

    return hsvToRgb({ h, s, v, a });
  }

  return null;
}

type Direction = "ltr" | "rtl";

interface StoreState {
  color: ColorValue;
  hsv: HSVColorValue;
  open: boolean;
  format: ColorFormat;
}

interface Store {
  subscribe: (cb: () => void) => () => void;
  getState: () => StoreState;
  setColor: (value: ColorValue, options?: { emit?: boolean }) => void;
  setHsv: (value: HSVColorValue, options?: { emit?: boolean }) => void;
  setOpen: (value: boolean, eventDetails?: PopoverChangeEventDetails) => void;
  setFormat: (value: ColorFormat) => void;
  notify: () => void;
}

function isSameColorValue(a: ColorValue, b: ColorValue) {
  return a.r === b.r && a.g === b.g && a.b === b.b && a.a === b.a;
}

function isSameHsvValue(a: HSVColorValue, b: HSVColorValue) {
  return a.h === b.h && a.s === b.s && a.v === b.v && a.a === b.a;
}

const StoreContext = React.createContext<Store | null>(null);

function useStoreContext(consumerName: string) {
  const context = React.useContext(StoreContext);
  if (!context) {
    throw new Error(`\`${consumerName}\` must be used within \`${ROOT_NAME}\``);
  }
  return context;
}

function useStore<U>(selector: (state: StoreState) => U): U {
  const store = useStoreContext("useStore");

  const getSnapshot = React.useCallback(
    () => selector(store.getState()),
    [store, selector],
  );

  return React.useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
}

interface ColorPickerContextValue {
  dir: Direction;
  disabled?: boolean;
  inline?: boolean;
  readOnly?: boolean;
  required?: boolean;
}

const ColorPickerContext = React.createContext<ColorPickerContextValue | null>(
  null,
);

function useColorPickerContext(consumerName: string) {
  const context = React.useContext(ColorPickerContext);
  if (!context) {
    throw new Error(`\`${consumerName}\` must be used within \`${ROOT_NAME}\``);
  }
  return context;
}

interface ColorPickerProps
  extends
    Omit<DivProps, "onValueChange">,
    Pick<
      React.ComponentProps<typeof Popover>,
      "defaultOpen" | "open" | "modal"
    > {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onOpenChange?: (
    open: boolean,
    eventDetails?: PopoverChangeEventDetails,
  ) => void;
  dir?: Direction;
  format?: ColorFormat;
  defaultFormat?: ColorFormat;
  onFormatChange?: (format: ColorFormat) => void;
  name?: string;
  asChild?: boolean;
  disabled?: boolean;
  inline?: boolean;
  readOnly?: boolean;
  required?: boolean;
}

function ColorPicker(props: ColorPickerProps) {
  const {
    value: valueProp,
    defaultValue = "#000000",
    onValueChange,
    format: formatProp,
    defaultFormat = "hex",
    onFormatChange,
    defaultOpen,
    open: openProp,
    onOpenChange,
    name,
    disabled,
    inline,
    readOnly,
    required,
    ...rootProps
  } = props;

  const listenersRef = useLazyRef(() => new Set<() => void>());
  const stateRef = useLazyRef<StoreState>(() => {
    const colorString = valueProp ?? defaultValue;
    const color = parseColorString(colorString) ?? hexToRgb(colorString);

    return {
      color,
      hsv: rgbToHsv(color),
      open: openProp ?? defaultOpen ?? false,
      format: formatProp ?? defaultFormat,
    };
  });

  const propsRef = useAsRef({
    onValueChange,
    onOpenChange,
    onFormatChange,
  });

  const store = React.useMemo<Store>(() => {
    return {
      subscribe: (cb) => {
        listenersRef.current.add(cb);
        return () => listenersRef.current.delete(cb);
      },
      getState: () => stateRef.current,
      setColor: (value: ColorValue, options) => {
        if (isSameColorValue(stateRef.current.color, value)) return;

        const prevState = { ...stateRef.current };
        stateRef.current.color = value;

        if (options?.emit !== false && propsRef.current.onValueChange) {
          const colorString = colorToString(value, prevState.format);
          propsRef.current.onValueChange(colorString);
        }

        store.notify();
      },
      setHsv: (value: HSVColorValue, options) => {
        if (isSameHsvValue(stateRef.current.hsv, value)) return;

        const prevState = { ...stateRef.current };
        stateRef.current.hsv = value;

        if (options?.emit !== false && propsRef.current.onValueChange) {
          const colorValue = hsvToRgb(value);
          const colorString = colorToString(colorValue, prevState.format);
          propsRef.current.onValueChange(colorString);
        }

        store.notify();
      },
      setOpen: (value: boolean, eventDetails?: PopoverChangeEventDetails) => {
        if (Object.is(stateRef.current.open, value)) return;

        stateRef.current.open = value;

        if (propsRef.current.onOpenChange) {
          propsRef.current.onOpenChange(value, eventDetails);
        }

        store.notify();
      },
      setFormat: (value: ColorFormat) => {
        if (Object.is(stateRef.current.format, value)) return;

        stateRef.current.format = value;

        if (propsRef.current.onFormatChange) {
          propsRef.current.onFormatChange(value);
        }

        store.notify();
      },
      notify: () => {
        for (const cb of listenersRef.current) {
          cb();
        }
      },
    };
  }, [listenersRef, stateRef, propsRef]);

  return (
    <StoreContext.Provider value={store}>
      <ColorPickerImpl
        {...rootProps}
        value={valueProp}
        format={formatProp}
        defaultOpen={defaultOpen}
        open={openProp}
        name={name}
        disabled={disabled}
        inline={inline}
        readOnly={readOnly}
        required={required}
      />
    </StoreContext.Provider>
  );
}

interface ColorPickerImplProps extends Omit<
  ColorPickerProps,
  | "defaultValue"
  | "onValueChange"
  | "onOpenChange"
  | "defaultFormat"
  | "onFormatChange"
> {}

function ColorPickerImpl(props: ColorPickerImplProps) {
  const {
    value: valueProp,
    format: formatProp,
    dir: dirProp,
    defaultOpen,
    open: openProp,
    name,
    ref,
    render,
    disabled,
    inline,
    modal,
    readOnly,
    required,
    ...rootProps
  } = props;

  const store = useStoreContext(ROOT_IMPL_NAME);

  const contextDir = useDirection();
  const dir = dirProp ?? contextDir;

  const [formTrigger, setFormTrigger] = React.useState<RootElement | null>(
    null,
  );
  const composedRef = useComposedRefs(ref, (node) => setFormTrigger(node));
  const isFormControl = formTrigger ? !!formTrigger.closest("form") : true;

  useIsomorphicLayoutEffect(() => {
    if (valueProp !== undefined) {
      const parsedColor = parseColorString(valueProp);
      const color = parsedColor ?? hexToRgb(valueProp);
      const hsv = rgbToHsv(color);
      store.setColor(color, { emit: false });
      store.setHsv(hsv, { emit: false });
    }
  }, [valueProp, store]);

  useIsomorphicLayoutEffect(() => {
    if (formatProp !== undefined) {
      store.setFormat(formatProp);
    }
  }, [formatProp, store]);

  useIsomorphicLayoutEffect(() => {
    if (openProp !== undefined) {
      store.setOpen(openProp);
    }
  }, [openProp, store]);

  const contextValue = React.useMemo<ColorPickerContextValue>(
    () => ({
      dir,
      disabled,
      inline,
      readOnly,
      required,
    }),
    [dir, disabled, inline, readOnly, required],
  );

  const value = useStore((state) => colorToString(state.color, state.format));
  const open = useStore((state) => state.open);

  const element = useRender({
    defaultTagName: "div",
    props: mergeProps<"div">({ ref: composedRef }, rootProps),
    render,
    state: {
      slot: "color-picker",
    },
  });

  if (inline) {
    return (
      <ColorPickerContext.Provider value={contextValue}>
        {element}
        {isFormControl && (
          <VisuallyHiddenInput
            type="hidden"
            control={formTrigger}
            name={name}
            value={value}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
          />
        )}
      </ColorPickerContext.Provider>
    );
  }

  return (
    <ColorPickerContext.Provider value={contextValue}>
      <Popover
        defaultOpen={defaultOpen}
        open={open}
        onOpenChange={store.setOpen}
        modal={modal}
      >
        {element}
        {isFormControl && (
          <VisuallyHiddenInput
            type="hidden"
            control={formTrigger}
            name={name}
            value={value}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
          />
        )}
      </Popover>
    </ColorPickerContext.Provider>
  );
}

function ColorPickerTrigger(
  props: React.ComponentProps<typeof PopoverTrigger>,
) {
  const { disabled, nativeButton = true, render, ...triggerProps } = props;

  const context = useColorPickerContext(TRIGGER_NAME);

  const isDisabled = disabled || context.disabled;

  return (
    <PopoverTrigger
      disabled={isDisabled}
      nativeButton={nativeButton}
      data-slot="color-picker-trigger"
      render={render ?? <Button />}
      {...triggerProps}
    />
  );
}

function ColorPickerContent(
  props: React.ComponentProps<typeof PopoverContent>,
) {
  const { className, children, style, ...popoverContentProps } = props;

  const context = useColorPickerContext(CONTENT_NAME);

  if (context.inline) {
    return (
      <div
        data-slot="color-picker-content"
        {...popoverContentProps}
        style={typeof style === "function" ? undefined : style}
        className={cn("flex w-85 flex-col gap-4 p-2", className)}
      >
        {children}
      </div>
    );
  }

  return (
    <PopoverContent
      data-slot="color-picker-content"
      {...popoverContentProps}
      className={cn("flex w-85 flex-col gap-4 p-2", className)}
    >
      {children}
    </PopoverContent>
  );
}

function ColorPickerArea(props: DivProps) {
  const {
    onPointerDown: onPointerDownProp,
    onPointerMove: onPointerMoveProp,
    onPointerUp: onPointerUpProp,
    className,
    ref,
    render,
    ...areaProps
  } = props;

  const propsRef = useAsRef({
    onPointerDown: onPointerDownProp,
    onPointerMove: onPointerMoveProp,
    onPointerUp: onPointerUpProp,
  });

  const context = useColorPickerContext(AREA_NAME);
  const store = useStoreContext(AREA_NAME);

  const hsv = useStore((state) => state.hsv);

  const isDraggingRef = React.useRef(false);
  const areaRef = React.useRef<HTMLDivElement>(null);
  const composedRef = useComposedRefs(ref, areaRef);

  const updateColorFromPosition = React.useCallback(
    (clientX: number, clientY: number) => {
      if (!areaRef.current) return;

      const rect = areaRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const y = Math.max(
        0,
        Math.min(1, 1 - (clientY - rect.top) / rect.height),
      );

      const newHsv: HSVColorValue = {
        h: hsv?.h ?? 0,
        s: Math.round(x * 100),
        v: Math.round(y * 100),
        a: hsv?.a ?? 1,
      };

      store.setHsv(newHsv);
      store.setColor(hsvToRgb(newHsv));
    },
    [hsv, store],
  );

  const onPointerDown = React.useCallback(
    (event: React.PointerEvent<AreaElement>) => {
      if (context.disabled) return;
      propsRef.current.onPointerDown?.(event);
      if (event.defaultPrevented) return;

      isDraggingRef.current = true;
      areaRef.current?.setPointerCapture(event.pointerId);
      updateColorFromPosition(event.clientX, event.clientY);
    },
    [context.disabled, updateColorFromPosition, propsRef],
  );

  const onPointerMove = React.useCallback(
    (event: React.PointerEvent<AreaElement>) => {
      propsRef.current.onPointerMove?.(event);
      if (event.defaultPrevented) return;

      if (isDraggingRef.current) {
        updateColorFromPosition(event.clientX, event.clientY);
      }
    },
    [updateColorFromPosition, propsRef],
  );

  const onPointerUp = React.useCallback(
    (event: React.PointerEvent<AreaElement>) => {
      propsRef.current.onPointerUp?.(event);
      if (event.defaultPrevented) return;

      isDraggingRef.current = false;
      areaRef.current?.releasePointerCapture(event.pointerId);
    },
    [propsRef],
  );

  const hue = hsv?.h ?? 0;
  const backgroundHue = hsvToRgb({ h: hue, s: 100, v: 100, a: 1 });

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        ref: composedRef,
        className: cn(
          "relative h-40 w-full cursor-crosshair touch-none rounded-sm border",
          context.disabled && "pointer-events-none opacity-50",
          className,
        ),
        onPointerDown,
        onPointerMove,
        onPointerUp,
        children: (
          <>
            <div className="absolute inset-0 overflow-hidden rounded-sm">
              <div
                className="absolute inset-0"
                style={{
                  backgroundColor: `rgb(${backgroundHue.r}, ${backgroundHue.g}, ${backgroundHue.b})`,
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to right, #fff, transparent)",
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to bottom, transparent, #000)",
                }}
              />
            </div>
            <div
              className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-sm"
              style={{
                left: `${hsv?.s ?? 0}%`,
                top: `${100 - (hsv?.v ?? 0)}%`,
              }}
            />
          </>
        ),
      },
      areaProps,
    ),
    render,
    state: {
      slot: "color-picker-area",
    },
  });
}

function ColorPickerHueSlider(
  props: React.ComponentProps<typeof SliderPrimitive.Root>,
) {
  const { className, ...sliderProps } = props;

  const context = useColorPickerContext(HUE_SLIDER_NAME);
  const store = useStoreContext(HUE_SLIDER_NAME);

  const hsv = useStore((state) => state.hsv);

  const onValueChange = React.useCallback(
    (value: number | readonly number[]) => {
      const values = Array.isArray(value) ? value : [value];
      const newHsv: HSVColorValue = {
        h: values[0] ?? 0,
        s: hsv?.s ?? 0,
        v: hsv?.v ?? 0,
        a: hsv?.a ?? 1,
      };
      store.setHsv(newHsv);
      store.setColor(hsvToRgb(newHsv));
    },
    [hsv, store],
  );

  return (
    <SliderPrimitive.Root
      data-slot="color-picker-hue-slider"
      {...sliderProps}
      max={360}
      step={1}
      className={cn(
        "relative flex w-full touch-none items-center select-none",
        className,
      )}
      value={[hsv?.h ?? 0]}
      onValueChange={onValueChange}
      disabled={context.disabled}
    >
      <SliderPrimitive.Control className="relative flex w-full items-center">
        <SliderPrimitive.Track className="relative h-3 w-full grow overflow-hidden rounded-full bg-[linear-gradient(to_right,#ff0000_0%,#ffff00_16.66%,#00ff00_33.33%,#00ffff_50%,#0000ff_66.66%,#ff00ff_83.33%,#ff0000_100%)]" />
        <SliderPrimitive.Thumb className="block size-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50" />
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
}

function ColorPickerAlphaSlider(
  props: React.ComponentProps<typeof SliderPrimitive.Root>,
) {
  const { className, ...sliderProps } = props;

  const context = useColorPickerContext(ALPHA_SLIDER_NAME);
  const store = useStoreContext(ALPHA_SLIDER_NAME);

  const color = useStore((state) => state.color);
  const hsv = useStore((state) => state.hsv);

  const onValueChange = React.useCallback(
    (value: number | readonly number[]) => {
      const values = Array.isArray(value) ? value : [value];
      const alpha = (values[0] ?? 0) / 100;
      const newColor = { ...color, a: alpha };
      const newHsv = { ...hsv, a: alpha };
      store.setColor(newColor);
      store.setHsv(newHsv);
    },
    [color, hsv, store],
  );

  const gradientColor = `rgb(${color?.r ?? 0}, ${color?.g ?? 0}, ${color?.b ?? 0})`;

  return (
    <SliderPrimitive.Root
      data-slot="color-picker-alpha-slider"
      {...sliderProps}
      max={100}
      step={1}
      disabled={context.disabled}
      className={cn(
        "relative flex w-full touch-none items-center select-none",
        className,
      )}
      value={[Math.round((color?.a ?? 1) * 100)]}
      onValueChange={onValueChange}
    >
      <SliderPrimitive.Control className="relative flex w-full items-center">
        <SliderPrimitive.Track
          className="relative h-3 w-full grow overflow-hidden rounded-full"
          style={{
            background:
              "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)",
            backgroundSize: "8px 8px",
            backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px",
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `linear-gradient(to right, transparent, ${gradientColor})`,
            }}
          />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block size-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50" />
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
}

function ColorPickerSwatch(props: DivProps) {
  const { className, render, ...swatchProps } = props;

  const context = useColorPickerContext(SWATCH_NAME);

  const color = useStore((state) => state.color);
  const format = useStore((state) => state.format);

  const backgroundStyle = React.useMemo(() => {
    if (!color) {
      return {
        background:
          "linear-gradient(to bottom right, transparent calc(50% - 1px), hsl(var(--destructive)) calc(50% - 1px) calc(50% + 1px), transparent calc(50% + 1px)) no-repeat",
      };
    }

    const colorString = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;

    if (color.a < 1) {
      return {
        background: `linear-gradient(${colorString}, ${colorString}), repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 0% 50% / 8px 8px`,
      };
    }

    return {
      backgroundColor: colorString,
    };
  }, [color]);

  const ariaLabel = !color
    ? "No color selected"
    : `Current color: ${colorToString(color, format)}`;

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        role: "img",
        "aria-label": ariaLabel,
        className: cn(
          "box-border size-8 rounded-sm border shadow-sm",
          context.disabled && "opacity-50",
          className,
        ),
        style: {
          ...backgroundStyle,
          forcedColorAdjust: "none",
        },
      },
      swatchProps,
    ),
    render,
    state: {
      slot: "color-picker-swatch",
    },
  });
}

function ColorPickerEyeDropper(props: React.ComponentProps<typeof Button>) {
  const { size: sizeProp, children, disabled, ...buttonProps } = props;

  const context = useColorPickerContext(EYE_DROPPER_NAME);
  const store = useStoreContext(EYE_DROPPER_NAME);

  const color = useStore((state) => state.color);

  const isDisabled = disabled || context.disabled;

  const onEyeDropper = React.useCallback(async () => {
    if (!window.EyeDropper) return;

    try {
      const eyeDropper = new window.EyeDropper();
      const result = await eyeDropper.open();

      if (result.sRGBHex) {
        const currentAlpha = color?.a ?? 1;
        const newColor = hexToRgb(result.sRGBHex, currentAlpha);
        const newHsv = rgbToHsv(newColor);
        store.setColor(newColor);
        store.setHsv(newHsv);
      }
    } catch (error) {
      console.warn("EyeDropper error:", error);
    }
  }, [color, store]);

  const hasEyeDropper = typeof window !== "undefined" && !!window.EyeDropper;

  if (!hasEyeDropper) return null;

  const size = sizeProp ?? (children ? "default" : "icon");

  return (
    <Button
      data-slot="color-picker-eye-dropper"
      {...buttonProps}
      aria-label={buttonProps["aria-label"] ?? "Pick color from screen"}
      variant="outline"
      size={size}
      onClick={onEyeDropper}
      disabled={isDisabled}
    >
      {children ?? <PipetteIcon />}
    </Button>
  );
}

interface ColorPickerFormatSelectProps
  extends
    Omit<React.ComponentProps<typeof Select>, "value" | "onValueChange">,
    Pick<React.ComponentProps<typeof SelectTrigger>, "size" | "className"> {
  formats?: readonly ColorFormat[];
}

function ColorPickerFormatSelect(props: ColorPickerFormatSelectProps) {
  const { size, disabled, className, formats, ...selectProps } = props;

  const context = useColorPickerContext(FORMAT_SELECT_NAME);
  const store = useStoreContext(FORMAT_SELECT_NAME);
  const isDisabled = disabled || context.disabled;

  const format = useStore((state) => state.format);
  const availableFormats = formats?.length ? formats : colorFormats;

  const onFormatChange = React.useCallback(
    (value: ColorFormat) => {
      store.setFormat(value);
    },
    [store],
  );

  return (
    <Select
      data-slot="color-picker-format-select"
      {...selectProps}
      value={format}
      onValueChange={(value) => onFormatChange(value as ColorFormat)}
      disabled={isDisabled}
    >
      <SelectTrigger
        data-slot="color-picker-format-select-trigger"
        size={size ?? "default"}
        className={cn(className)}
      >
        <SelectValue className="uppercase" />
      </SelectTrigger>
      <SelectContent>
        {availableFormats.map((format) => (
          <SelectItem key={format} value={format}>
            {format.toUpperCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

interface ColorPickerInputProps extends Omit<
  React.ComponentProps<typeof Input>,
  "value" | "onChange" | "color"
> {
  withoutAlpha?: boolean;
}

function ColorPickerInput(props: ColorPickerInputProps) {
  const store = useStoreContext(INPUT_NAME);
  const context = useColorPickerContext(INPUT_NAME);

  const color = useStore((state) => state.color);
  const format = useStore((state) => state.format);
  const hsv = useStore((state) => state.hsv);

  const onColorChange = React.useCallback(
    (newColor: ColorValue) => {
      const newHsv = rgbToHsv(newColor);
      store.setColor(newColor);
      store.setHsv(newHsv);
    },
    [store],
  );

  if (format === "hex") {
    return (
      <HexInput
        color={color}
        onColorChange={onColorChange}
        context={context}
        {...props}
      />
    );
  }

  if (format === "rgb") {
    return (
      <RgbInput
        color={color}
        onColorChange={onColorChange}
        context={context}
        {...props}
      />
    );
  }

  if (format === "hsl") {
    return (
      <HslInput
        color={color}
        onColorChange={onColorChange}
        context={context}
        {...props}
      />
    );
  }

  if (format === "hsb") {
    return (
      <HsbInput
        hsv={hsv}
        onColorChange={onColorChange}
        context={context}
        {...props}
      />
    );
  }
}

interface InputGroupItemProps
  extends React.ComponentProps<typeof InputGroupInput> {
  position?: "first" | "middle" | "last" | "isolated";
}

function InputGroupItem({
  className,
  position: _position,
  ...props
}: InputGroupItemProps) {
  return (
    <InputGroupInput
      className={cn(
        "h-8 [-moz-appearance:textfield] tabular-nums [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none",
        className,
      )}
      {...props}
    />
  );
}

interface FormatInputProps extends ColorPickerInputProps {
  color: ColorValue;
  onColorChange: (color: ColorValue) => void;
  context: ColorPickerContextValue;
}

function HexInput(props: FormatInputProps) {
  const {
    color,
    onColorChange,
    context,
    withoutAlpha,
    className,
    ...inputProps
  } = props;

  const hexValue = rgbToHex(color);
  const alphaValue = Math.round((color?.a ?? 1) * 100);

  const onHexChange = React.useCallback(
    (event: React.ChangeEvent<InputElement>) => {
      const value = event.target.value;
      const parsedColor = parseColorString(value);
      if (parsedColor) {
        onColorChange({ ...parsedColor, a: color?.a ?? 1 });
      }
    },
    [color, onColorChange],
  );

  const onAlphaChange = React.useCallback(
    (event: React.ChangeEvent<InputElement>) => {
      const value = Number.parseInt(event.target.value, 10);
      if (!Number.isNaN(value) && value >= 0 && value <= 100) {
        onColorChange({ ...color, a: value / 100 });
      }
    },
    [color, onColorChange],
  );

  if (withoutAlpha) {
    return (
      <InputGroup data-color-picker-input-wrapper="" className={className}>
        <InputGroupItem
          aria-label="Hex color value"
          position="isolated"
          {...inputProps}
          placeholder="#000000"
          className="font-mono"
          value={hexValue}
          onChange={onHexChange}
          disabled={context.disabled}
        />
      </InputGroup>
    );
  }

  return (
    <InputGroup data-color-picker-input-wrapper="" className={className}>
      <InputGroupItem
        aria-label="Hex color value"
        position="first"
        {...inputProps}
        placeholder="#000000"
        className="flex-1 font-mono"
        value={hexValue}
        onChange={onHexChange}
        disabled={context.disabled}
      />
      <InputGroupItem
        aria-label="Alpha transparency percentage"
        position="last"
        {...inputProps}
        placeholder="100"
        inputMode="numeric"
        pattern="[0-9]*"
        min="0"
        max="100"
        className="w-14"
        value={alphaValue}
        onChange={onAlphaChange}
        disabled={context.disabled}
      />
    </InputGroup>
  );
}

function RgbInput(props: FormatInputProps) {
  const {
    color,
    onColorChange,
    context,
    withoutAlpha,
    className,
    ...inputProps
  } = props;

  const rValue = Math.round(color?.r ?? 0);
  const gValue = Math.round(color?.g ?? 0);
  const bValue = Math.round(color?.b ?? 0);
  const alphaValue = Math.round((color?.a ?? 1) * 100);

  const onChannelChange = React.useCallback(
    (channel: "r" | "g" | "b" | "a", max: number, isAlpha = false) =>
      (event: React.ChangeEvent<InputElement>) => {
        const value = Number.parseInt(event.target.value, 10);
        if (!Number.isNaN(value) && value >= 0 && value <= max) {
          const newValue = isAlpha ? value / 100 : value;
          onColorChange({ ...color, [channel]: newValue });
        }
      },
    [color, onColorChange],
  );

  return (
    <InputGroup data-color-picker-input-wrapper="" className={className}>
      <InputGroupItem
        aria-label="Red color component (0-255)"
        position="first"
        {...inputProps}
        placeholder="0"
        inputMode="numeric"
        pattern="[0-9]*"
        min="0"
        max="255"
        className="w-14"
        value={rValue}
        onChange={onChannelChange("r", 255)}
        disabled={context.disabled}
      />
      <InputGroupItem
        aria-label="Green color component (0-255)"
        position="middle"
        {...inputProps}
        placeholder="0"
        inputMode="numeric"
        pattern="[0-9]*"
        min="0"
        max="255"
        className="w-14"
        value={gValue}
        onChange={onChannelChange("g", 255)}
        disabled={context.disabled}
      />
      <InputGroupItem
        aria-label="Blue color component (0-255)"
        position={withoutAlpha ? "last" : "middle"}
        {...inputProps}
        placeholder="0"
        inputMode="numeric"
        pattern="[0-9]*"
        min="0"
        max="255"
        className="w-14"
        value={bValue}
        onChange={onChannelChange("b", 255)}
        disabled={context.disabled}
      />
      {!withoutAlpha && (
        <InputGroupItem
          aria-label="Alpha transparency percentage"
          position="last"
          {...inputProps}
          placeholder="100"
          inputMode="numeric"
          pattern="[0-9]*"
          min="0"
          max="100"
          className="w-14"
          value={alphaValue}
          onChange={onChannelChange("a", 100, true)}
          disabled={context.disabled}
        />
      )}
    </InputGroup>
  );
}

function HslInput(props: FormatInputProps) {
  const {
    color,
    onColorChange,
    context,
    withoutAlpha,
    className,
    ...inputProps
  } = props;

  const hsl = React.useMemo(() => rgbToHsl(color), [color]);
  const alphaValue = Math.round((color?.a ?? 1) * 100);

  const onHslChannelChange = React.useCallback(
    (channel: "h" | "s" | "l", max: number) =>
      (event: React.ChangeEvent<InputElement>) => {
        const value = Number.parseInt(event.target.value, 10);
        if (!Number.isNaN(value) && value >= 0 && value <= max) {
          const newHsl = { ...hsl, [channel]: value };
          const newColor = hslToRgb(newHsl, color?.a ?? 1);
          onColorChange(newColor);
        }
      },
    [hsl, color, onColorChange],
  );

  const onAlphaChange = React.useCallback(
    (event: React.ChangeEvent<InputElement>) => {
      const value = Number.parseInt(event.target.value, 10);
      if (!Number.isNaN(value) && value >= 0 && value <= 100) {
        onColorChange({ ...color, a: value / 100 });
      }
    },
    [color, onColorChange],
  );

  return (
    <InputGroup data-color-picker-input-wrapper="" className={className}>
      <InputGroupItem
        aria-label="Hue degree (0-360)"
        position="first"
        {...inputProps}
        placeholder="0"
        inputMode="numeric"
        pattern="[0-9]*"
        min="0"
        max="360"
        className="w-14"
        value={hsl.h}
        onChange={onHslChannelChange("h", 360)}
        disabled={context.disabled}
      />
      <InputGroupItem
        aria-label="Saturation percentage (0-100)"
        position="middle"
        {...inputProps}
        placeholder="0"
        inputMode="numeric"
        pattern="[0-9]*"
        min="0"
        max="100"
        className="w-14"
        value={hsl.s}
        onChange={onHslChannelChange("s", 100)}
        disabled={context.disabled}
      />
      <InputGroupItem
        aria-label="Lightness percentage (0-100)"
        position={withoutAlpha ? "last" : "middle"}
        {...inputProps}
        placeholder="0"
        inputMode="numeric"
        pattern="[0-9]*"
        min="0"
        max="100"
        className="w-14"
        value={hsl.l}
        onChange={onHslChannelChange("l", 100)}
        disabled={context.disabled}
      />
      {!withoutAlpha && (
        <InputGroupItem
          aria-label="Alpha transparency percentage"
          position="last"
          {...inputProps}
          placeholder="100"
          inputMode="numeric"
          pattern="[0-9]*"
          min="0"
          max="100"
          className="w-14"
          value={alphaValue}
          onChange={onAlphaChange}
          disabled={context.disabled}
        />
      )}
    </InputGroup>
  );
}

interface HsbInputProps extends Omit<FormatInputProps, "color"> {
  hsv: HSVColorValue;
}

function HsbInput(props: HsbInputProps) {
  const {
    hsv,
    onColorChange,
    context,
    withoutAlpha,
    className,
    ...inputProps
  } = props;

  const alphaValue = Math.round((hsv?.a ?? 1) * 100);

  const onHsvChannelChange = React.useCallback(
    (channel: "h" | "s" | "v", max: number) =>
      (event: React.ChangeEvent<InputElement>) => {
        const value = Number.parseInt(event.target.value, 10);
        if (!Number.isNaN(value) && value >= 0 && value <= max) {
          const newHsv = { ...hsv, [channel]: value };
          const newColor = hsvToRgb(newHsv);
          onColorChange(newColor);
        }
      },
    [hsv, onColorChange],
  );

  const onAlphaChange = React.useCallback(
    (event: React.ChangeEvent<InputElement>) => {
      const value = Number.parseInt(event.target.value, 10);
      if (!Number.isNaN(value) && value >= 0 && value <= 100) {
        const currentColor = hsvToRgb(hsv);
        onColorChange({ ...currentColor, a: value / 100 });
      }
    },
    [hsv, onColorChange],
  );

  return (
    <InputGroup data-color-picker-input-wrapper="" className={className}>
      <InputGroupItem
        aria-label="Hue degree (0-360)"
        position="first"
        {...inputProps}
        placeholder="0"
        inputMode="numeric"
        pattern="[0-9]*"
        min="0"
        max="360"
        className="w-14"
        value={hsv?.h ?? 0}
        onChange={onHsvChannelChange("h", 360)}
        disabled={context.disabled}
      />
      <InputGroupItem
        aria-label="Saturation percentage (0-100)"
        position="middle"
        {...inputProps}
        placeholder="0"
        inputMode="numeric"
        pattern="[0-9]*"
        min="0"
        max="100"
        className="w-14"
        value={hsv?.s ?? 0}
        onChange={onHsvChannelChange("s", 100)}
        disabled={context.disabled}
      />
      <InputGroupItem
        aria-label="Brightness percentage (0-100)"
        position={withoutAlpha ? "last" : "middle"}
        {...inputProps}
        placeholder="0"
        inputMode="numeric"
        pattern="[0-9]*"
        min="0"
        max="100"
        className="w-14"
        value={hsv?.v ?? 0}
        onChange={onHsvChannelChange("v", 100)}
        disabled={context.disabled}
      />
      {!withoutAlpha && (
        <InputGroupItem
          aria-label="Alpha transparency percentage"
          position="last"
          {...inputProps}
          placeholder="100"
          inputMode="numeric"
          pattern="[0-9]*"
          min="0"
          max="100"
          className="w-14"
          value={alphaValue}
          onChange={onAlphaChange}
          disabled={context.disabled}
        />
      )}
    </InputGroup>
  );
}

export {
  type ColorFormat,
  ColorPicker,
  ColorPickerAlphaSlider,
  ColorPickerArea,
  ColorPickerContent,
  ColorPickerEyeDropper,
  ColorPickerFormatSelect,
  ColorPickerHueSlider,
  ColorPickerInput,
  type ColorPickerProps,
  ColorPickerSwatch,
  ColorPickerTrigger,
  useStore as useColorPicker,
};
