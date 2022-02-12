import { installationOptions } from "@/adminlab";
import { ComponentType, framework } from "@/framework";
import {
  UseImageOptions,
  UseProgressOptions,
  UseTagOptions,
} from "@/types/components";
import { isPromise } from "@/utils";
import { h } from "vue";

export const createLinkNode = (link: string, label: string, props: IObject) => {
  return h(
    "a",
    {
      ...props,
      href: link,
      target: "_blank",
    },
    label || link
  );
};

export const createImageNode = (
  src: string,
  props: IObject,
  isAvatar: boolean
) => {
  const _class = isAvatar ? "a-avatar" : "a-image";
  let _props = props || {};

  if (isAvatar) {
    const { componentProps = {}, size = 30 } = installationOptions.modules?.table?.avatar || {};
    _props = Object.assign({}, componentProps, _props);

    const _size = typeof size === "number" ? `${size}px` : size;
    const style = _props.style || (_props.style = {});

    Object.assign(style, {
      "width": _size,
      "height": _size,
    })
  }

  const options: UseImageOptions = {
    src,
    imgClass: _class,
    props: _props,
  };

  return framework.makeNode(ComponentType.Image, options);
};

export const createColorNode = (
  color: string,
  label: string,
  props: IObject
) => {
  let className = "a-flex a-align-center";

  if (props.class) {
    className += ` ${props.class}`;
  }

  const { classes, style: colorStyle = {} } =
    installationOptions.modules?.table?.color || {};
  if (classes) {
    className += ` ${classes}`;
  }

  props.style = Object.assign(colorStyle, props.style || {});

  return h(
    "span",
    {
      ...props,
      class: className,
    },
    [
      h("span", {
        style: {
          background: color,
        },
        class: "a-color",
      }),

      h("span", null, (label || color || "").toUpperCase()),
    ]
  );
};

export const createTextNode = (text: string, props: IObject) => {
  return h("span", props, text);
};

export const createProgressNode = (value: any, props: IObject = {}, label?: string) => {
  const type = ComponentType.Progress;

  if (label === void 0) {
    label = Number(value.toFixed(2)).toString();
    label += "%";
  }

  const options: UseProgressOptions = {
    value,
    props,
    label,
  };

  return framework.makeNode(type, options);
};

export const createMapNode = (
  config: Partial<MapConfig>,
  value: any,
  customProps: IObject = {}
) => {
  const { type, loadOptions, dependsOn } = config;
  let { options } = config;

  if (!options || !options.length) {
    if (!dependsOn && loadOptions instanceof Function) {
      const result = loadOptions();
      if (!isPromise(result)) {
        // @ts-ignore
        options = result;
      }
    }
  }

  if (Array.isArray(options)) {
    const option = options.find((option) => option.value === value);

    if (option) {
      // doc: icon只支持tag
      const { props, icon, label, textColor, color } = option;
      const result = Object.assign(
        {},
        customProps || {},
        props ? props("table") : {}
      );

      if (type === "text" || type === "status") {
        if (!result.style) result.style = {};

        if (textColor) {
          result.style.color = textColor;
        }

        // text类型 或未指定颜色
        if (type === "text" || !color) return createTextNode(label, result);

        return h(
          "div",
          {
            class: "a-flex a-align-center a-map-status",
          },
          [
            h("span", {
              style: {
                background: color,
              },
            }),
            createTextNode(label, result),
          ]
        );
      }

      const useTagOptions: UseTagOptions = {
        text: label,
        textColor,
        color,
        icon,
        props: result,
      };

      return framework.makeNode(ComponentType.Tag, useTagOptions);
    }
  }
};
