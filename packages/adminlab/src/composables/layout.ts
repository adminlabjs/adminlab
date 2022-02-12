import { getCurrentInstance, capitalize } from "vue";
import type { Prop } from "vue";
import { getProps } from "@/utils";

const layoutPrefix = "layout";
export const breakpoints = ["xs", "sm", "md", "lg", "xl"] as const;
export const layoutNames = breakpoints.map((breakpoint) => {
  const suffix = capitalize(breakpoint) as Capitalize<typeof breakpoint>;
  return `${layoutPrefix}${suffix}` as LayoutProp<typeof suffix>;
});

const useLayout = (layout: string | number, width: number): string[] => {
  if (!layout) return [];
  layout = layout.toString();
  const ary = layout.split(",");
  if (ary.length === 1) {
    return new Array(width).fill(ary[0]);
  }
  return ary;
};

export const defaultColKey = "default" as const;
type LayoutProp<T extends string> = `${typeof layoutPrefix}${T}`;
type LayoutType = string | number;

export const useFormLayout = (width: number) => {
  const vm = getCurrentInstance()!;
  const props = vm.props as Record<
    keyof ReturnType<typeof makeLayoutProps>,
    LayoutType
  >;

  return breakpoints.reduce(
    (options, val) => {
      const key = `${layoutPrefix}${capitalize(val)}` as LayoutProp<
        Capitalize<typeof val>
      >;
      options[val] = useLayout(props[key], width);
      return options;
    },
    {
      default: useLayout(props.layout, width),
    } as Record<
      typeof defaultColKey | typeof breakpoints[number],
      ReturnType<typeof useLayout>
    >
  );
};

export const makeLayoutProps = () => {
  const makePropValue = () => ({
    type: [String, Number],
  });

  return layoutNames.reduce(
    (props, val) => {
      props[val] = makePropValue();
      return props;
    },
    {
      [layoutPrefix]: makePropValue() as any,
    } as Record<
      typeof layoutPrefix | typeof layoutNames[number],
      Prop<LayoutType>
    >
  );
};

export const getLayoutProps = (
  defaultValue?: Partial<
    Record<"layout" | typeof layoutNames[number], LayoutType>
  >
) => {
  type LayoutProp = typeof layoutNames[number] | "layout";
  const names = ["layout", ...layoutNames] as LayoutProp[];
  const props = getProps<typeof names[number], LayoutType>(names);
  return Object.keys(props).length ? props : defaultValue || {};
};

export type GridFormItemLayout = Partial<
  Record<typeof defaultColKey | typeof breakpoints[number], string | number>
>;
export const makeBaseColOptions = (
  layout: ReturnType<typeof useFormLayout>,
  index: number,
  gridFormItemLayout?: GridFormItemLayout
) => {
  const keys = [...breakpoints, defaultColKey] as const;
  gridFormItemLayout = gridFormItemLayout || {};

  return keys.reduce((options, val) => {
    const preset = gridFormItemLayout?.[val];
    options[val] = typeof preset === "string" ? preset : layout[val][index];
    return options;
  }, {} as Record<keyof ReturnType<typeof useFormLayout>, string>);
};
