import { defineComponent, h } from "vue";
import type { Prop, PropType } from "vue";
import { ComponentType, framework } from "@/framework";
import { UseButtonOptions } from "@/types/components";
import { setCurrentModule } from "@/adminlab";
import { AToolbarBtn } from "./";

// todo: 国际化
const commonlyUsedAction = {
  create: "新建",
  refresh: "刷新",
  search: "搜索",
  reset: "重置",
} as const;

const otherAction = {} as const;

type Action = keyof typeof commonlyUsedAction | keyof typeof otherAction;

enum DisplayType {
  CommonlyUsed = "commonlyUsed",
  All = "all",
  None = "none",
}

const actions = Object.keys(commonlyUsedAction).concat(
  Object.keys(otherAction)
) as Action[];

const makeToolbarProps = () => {
  return actions.reduce((props, key) => {
    props[key] = {
      type: Boolean,
      default: undefined,
    };
    return props;
  }, {} as Record<Action, Prop<boolean, undefined>>);
};

export default defineComponent({
  name: "AToolbar",
  inheritAttrs: false,
  emits: ["action"],

  setup(props, { attrs, slots, emit }) {
    return () => {
      const { loading, defaultDisplay, actions: propsActions } = props;
      const getBtnProps = () => {
        const prefix = "btn-";
        return Object.keys(attrs).reduce((props, key) => {
          if (key.startsWith(prefix)) {
            const _key = key.split(prefix)[1];
            if (_key) {
              props[_key] = attrs[key];
            }
          }
          return props;
        }, {} as IObject);
      }

      const getButtons = () => {
        return Array.isArray(propsActions) ? propsActions : actions.filter((action) => {
          const prop = props[action];
          if (prop === void 0) {
            if (defaultDisplay === DisplayType.All) return true;
            if (defaultDisplay === DisplayType.CommonlyUsed) {
              return commonlyUsedAction.hasOwnProperty(action);
            }
            return false;
          }

          return !!prop;
        });
      };

      const actionDict: Record<Action, any> = Object.assign(
        {},
        commonlyUsedAction,
        otherAction
      );

      setCurrentModule("toolbar");

      return h(
        "div",
        {
          style: attrs.style,
          class: `a-toolbar${attrs.class ? ' ' + attrs.class : ""}`,
        },
        getButtons().map((action) => {
          const options: UseButtonOptions = {
            color: "primary",
            props: getBtnProps(),
            label: actionDict[action],
            onClick: () => emit("action", action),
            loading: (action === "refresh" || action === "search") && loading,
            disabled: action === "reset" && loading,
          };

          return framework.makeNode(ComponentType.Button, options);
        }).concat(slots.default ? slots.default().map(node => {
          const component = node.type;
          if (component === AToolbarBtn) {
            return h(node, {
              color: "primary",
              props: Object.assign({}, node.props || {}, getBtnProps()),
              onAction: (action: string) => emit('action', action)
            })
          }
          return node;
        }) : [])
      );
    };
  },

  props: {
    ...makeToolbarProps(),
    loading: {
      type: Boolean,
    },
    defaultDisplay: {
      type: String as PropType<DisplayType>,
      default: DisplayType.CommonlyUsed,
    },
    actions: {
      type: Array as PropType<Array<keyof typeof commonlyUsedAction>>,
    }
  },
});
