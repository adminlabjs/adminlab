import { h, getCurrentInstance, isVNode, withDirectives } from "vue";
import type { VNode, Slots } from "vue";
import {
  UseButtonOptions,
  UseDropdownItemOptions,
  UseDropdownOptions,
  UseTableOptions,
} from "@/types/components";
import { ComponentType, framework } from "@/framework";
import type { UsePropsReturn, ContainerCore } from "../state";
import {
  createColorNode,
  createImageNode,
  createLinkNode,
  createMapNode,
  createProgressNode,
  createTextNode,
} from "./util";
import { formatTime, isFunction, isObject, isPromise } from "@/utils";
import type { ConfirmEvent } from "@/design/Confirm/AConfirm";
import { installationOptions, setCurrentModule } from "@/adminlab";
import { TableWrapper } from "@/design";

type OnActionEventHandler = (event: {
  action?: string;
  autoRefresh?: boolean;
  confirm?: ActionButtonConfirm;
  callback?: TableActionHandler;
}) => void;

const isCustomColumn = (column: InternalTableColumn) => {
  const custom = column && column.custom;

  if (
    !custom ||
    (!column.field && !custom.buttons && !custom.template && !custom.name) ||
    custom.visible === false
  ) {
    return false;
  }

  const { define, map, transformer, formatter, buttons, render, template } =
    custom;
  return (
    !!define ||
    !!map ||
    !!transformer ||
    !!formatter ||
    (Array.isArray(buttons) && buttons.length > 0) ||
    buttons instanceof Function ||
    render instanceof Function ||
    template
  );
};

const isActionButtonGroup = (
  val: TableActionButton | TableActionGroup | string
): val is TableActionGroup => {
  return typeof val === "object" && !!(val as TableActionGroup).dropdown;
};

// 处理操作区
// 1、按钮超过N个的部分自动收到更多按钮里
const processActions = (buttons: Exclude<TableColumnButtons, Function>) => {
  const ary = buttons.slice();

  let count = 0;
  const max = installationOptions?.modules?.table?.maxButtonCount;

  if (max) {
    const dropdownButtons: TableActionButton[] = [];

    for (let i = 0; i < ary.length; i++) {
      const button = ary[i];
      if (!isActionButtonGroup(button)) {
        if (count >= max) {
          dropdownButtons.push(button);
          ary.splice(i, 1);
          i--;
        }
        count++;
      }
    }

    if (dropdownButtons.length) {
      ary.push({
        dropdown: {
          buttons: dropdownButtons,
          label: "更多",
        },
      });
    }
  }

  return ary;
};

const generateButtons = (
  buttons: TableColumnButtons,
  row: any,
  onClick: OnActionEventHandler
) => {
  const nodes: VNode[] = [];

  const makeButtonProps = (options: TableActionButton | string) => {
    if (options instanceof Function) {
      options = options(row);
    }

    let action: string | undefined;
    let label = "";
    let confirm: ActionButtonConfirm | undefined;
    let callback: TableActionHandler | undefined;
    let btnProps;
    let autoRefresh = true;

    if (typeof options === "string") {
      // todo: 国际化
      if (options === "edit") label = "编辑";
      if (options === "copy") label = "复制";
      if (options === "delete") label = "删除";
      if (!label) label = options;
      action = options;
    } else {
      action = options.action;
      label = options.label || action || "";
      if (options.confirm) {
        if (options.confirm === true) {
          confirm = {};
        } else {
          confirm = options.confirm;
        }
      }
      btnProps = options.props;
      callback = options.handler;

      if (typeof options.autoRefresh === "boolean") {
        autoRefresh = options.autoRefresh;
      }
    }

    return {
      action,
      label,
      confirm,
      callback,
      props: btnProps,
      onClick: () => {
        onClick({
          action,
          confirm,
          callback,
          autoRefresh,
        });
      },
    };
  };

  if (buttons instanceof Function) {
    buttons = buttons(row);
  }

  processActions(buttons).forEach((button) => {
    if (isActionButtonGroup(button)) {
      const dropdownOptions: UseDropdownOptions = {
        text: true,
        color: "primary",
        // todo: 国际化
        label: button.dropdown.label || "更多",
        props: button.dropdown.props,
      };

      const { component: Dropdown, props: dropdownProps } =
        framework.useComponent(ComponentType.Dropdown, dropdownOptions);
      const dropdown = h(Dropdown, dropdownProps, () =>
        button.dropdown.buttons.map((item) => {
          const { label, props, onClick } = makeButtonProps(item);
          const dropdownItemOptions: UseDropdownItemOptions = {
            label,
            props,
            onClick,
          };
          return framework.makeNode(
            ComponentType.DropdownItem,
            dropdownItemOptions
          );
        })
      );
      nodes.push(dropdown);
    } else {
      const { label, props, onClick } = makeButtonProps(button);
      const useButtonOptions: UseButtonOptions = {
        label,
        text: true,
        color: "primary",
        props,
        onClick,
      };
      const buttonNode = framework.makeNode(
        ComponentType.Button,
        useButtonOptions
      );
      nodes.push(buttonNode);
    }
  });

  return nodes;
};

const generateCustomColumn = (
  column: InternalTableColumn,
  scope: any,
  row: any,
  actionHandler: OnActionEventHandler,
  findColumn: (name: string) => InternalTableColumn | undefined
) => {
  const { field, custom } = column;
  const {
    define,
    map,
    transformer,
    props: makeProps,
    buttons,
    render,
    template,
    name,
    extension,
    formatter,
  } = custom!;

  const renderTemplates = (template?: Template) => {
    if (!template) return;

    if (isFunction(template)) {
      return template((val) => {
        const templates = !Array.isArray(val) ? [val] : val;
        return templates.reduce((nodes, name) => {
          if (name && !nodes[name]) {
            if (name === custom!.name) {
              console.warn(`[adminlab]: template cannot nest itself`);
            } else {
              const target = findColumn(name);
              if (target) {
                nodes[name] = generateCustomColumn(
                  target,
                  scope,
                  row,
                  actionHandler,
                  findColumn
                );
              }
            }
          }
          return nodes;
        }, {} as Record<string, VNode | VNode[]>);
      });
    }

    if (Array.isArray(template)) {
      return template.map((val) => renderTemplate(val));
    }

    return renderTemplate(template);
  };

  const renderTemplate = (
    data: Exclude<Template, Function | Array<any>>
  ): VNode => {
    let template = "";
    let className = "a-template";
    let style = {};

    if (typeof data === "object") {
      if (typeof data.children === "object") {
        return h(
          "div",
          {
            class: data.classes,
            style: data.style,
          },
          renderTemplates(data.children)
        );
      } else {
        template = data.children || "";
        if (data.classes) className = data.classes;
        if (data.style) style = data.style;
      }
    } else {
      template = data;
    }

    const reg = /\{\{(.*?)\}\}/g;
    const nodes: Array<VNode | VNode[]> = [];
    let tag = "__REPLACED__";

    while (template.indexOf(tag) > -1) {
      tag += Date.now();
    }

    template = template.replace(reg, ($1, $2) => {
      if (name === $2) {
        console.warn(`[adminlab]: template cannot nest itself`);
        return $1;
      }

      const target = findColumn($2);
      if (!target) {
        console.warn(`[adminlab]: unknow name: ${$2}`);
        return $1;
      }

      nodes.push(
        generateCustomColumn(target, scope, row, actionHandler, findColumn)
      );

      return tag;
    });

    return h(
      "div",
      {
        class: className,
        style,
      },
      template.split(tag).map((val) => {
        if (val) {
          return createTextNode(val, {});
        }
        return nodes.shift();
      })
    );
  };

  const result = renderTemplates(template);
  if (result) return result;

  if (isFunction(render)) {
    return render(scope);
  }

  const props = makeProps ? makeProps("table", row) || {} : {};

  if (Array.isArray(buttons) || buttons instanceof Function) {
    return h(
      "div",
      {
        class: "a-inline-flex a-align-center",
      },
      generateButtons(buttons, row, actionHandler)
    );
  }

  const oldValue = row[field];
  let newValue = oldValue;
  let label = oldValue;

  if (define === "date" || define === "datetime") {
    let format = extension?.format;

    if (typeof format !== "string") {
      format = "yyyy/MM/dd HH:mm:ss";
      if (define === "date") format = "yyyy/MM/dd";
    }

    let value = newValue;
    if (typeof value === "number") {
      value = value.toString();
      if (value.length === 10) {
        // unix
        newValue = newValue * 1000;
      }
      value = Number(value);
    }

    return createTextNode(formatTime(value, format), props);
  }

  if (formatter) {
    if (typeof formatter === "string") {
      label = formatter.replace(/\{\{(.+?)\}\}/g, (arg1, arg2) => {
        return row[arg2];
      });
    } else if (isFunction(formatter)) {
      label = formatter(row, scope);
    }
  } else {
    if (define === "switch") {
      // todo: 国际化 & 与map协调
      label = oldValue ? "是" : "否";
    }
  }

  if (transformer instanceof Function) {
    newValue = transformer(row, scope);
  }

  if (define === "link") {
    return createLinkNode(newValue, label, props);
  }

  if (define === "image" || define === "avatar") {
    return createImageNode(newValue, props, define === "avatar");
  }

  if (define === "color") {
    return createColorNode(newValue, label, props);
  }

  if (define === "progress") {
    return createProgressNode(newValue, props, formatter ? label : void 0);
  }

  if (map) {
    const mapNode = createMapNode(map, newValue, props);
    if (mapNode) return mapNode;
  }

  return createTextNode(label, props);
};

// 获取用户自定义的插槽
const getSlots = (node: VNode) => {
  let slots: Record<string, any> = {};

  if (isVNode(node)) {
    if (isObject(node.children)) {
      slots = node.children;
      delete slots["_"];
    }
  }

  return slots as Slots;
};

export const useTable = (
  node: VNode,
  adapter: FrameworkAdapter,
  opts: ContainerCore
) => {
  setCurrentModule("table");

  const vm = getCurrentInstance()!;
  const props = vm.props as UsePropsReturn;
  const { state, fetch } = opts;
  const {
    listData,
    internalColumns,
    formDialog,
    loading,
    pagination,
    total,
    refs,
    openFormDialog,
  } = state;

  const originalColumns = props.columns;
  const visibleColumns = originalColumns.filter(
    (column) => !(column && column.custom?.visible === false)
  );

  const options: UseTableOptions = {
    listData: listData.value,
    columns: visibleColumns,
    loading: loading.value.table,
    pagination: Object.assign({}, pagination.value),
    total: total.value,
    slots: getSlots(node),

    onRequest: (event) => {
      pagination.value = event;
      fetch();
    },

    generateCustomColumns: (makeInternalColumn) => {
      const columns = originalColumns.map(makeInternalColumn);

      if (!internalColumns.value.length && columns.length) {
        internalColumns.value = columns;
      }

      const findColumn = (name: string) =>
        columns.find((column) => column.custom?.name === name);

      return visibleColumns
        .map(makeInternalColumn)
        .map((_, i) => ({
          ..._,
          index: i,
        }))
        .filter(isCustomColumn)
        .map((column) => {
          return {
            field: column.field,
            index: column.index,
            render: (scope, row) => {
              return generateCustomColumn(
                column,
                scope,
                row,
                (event) => {
                  const { action, autoRefresh } = event;
                  let { confirm, callback: handler } = event;

                  if (action === "edit") {
                    formDialog.copy = null;
                    formDialog.edit = Object.assign({}, row);
                    openFormDialog();
                    return;
                  }
                  if (action === "copy") {
                    formDialog.copy = Object.assign({}, row);
                    formDialog.edit = null;
                    openFormDialog();
                    return;
                  }

                  if (action === "delete") {
                    if (!confirm && confirm !== false) {
                      confirm = {};
                    }
                    if (!handler) {
                      handler = props.actionDelete;
                    }
                  }

                  if (confirm) {
                    (refs.confirm.value as any).open({
                      title: confirm.title,
                      content: confirm.content,
                      callback: (e: ConfirmEvent) => {
                        if (handler instanceof Function) {
                          const { done, startLoading, stopLoading } = e;
                          const result = handler(row, scope, action);
                          if (isPromise(result)) {
                            startLoading();
                            result
                              .then(() => {
                                done();
                                if (action === "delete") {
                                  const { page, pageSize } = pagination.value;
                                  if (page > 1) {
                                    const pageCount = Math.ceil(
                                      total.value / pageSize
                                    );
                                    if (
                                      listData.value.length === 1 &&
                                      page === pageCount
                                    ) {
                                      pagination.value.page--;
                                    }
                                  }
                                }
                                if (
                                  action === "delete" ||
                                  autoRefresh !== false
                                ) {
                                  fetch();
                                }
                              })
                              .finally(stopLoading);
                          } else {
                            done();
                          }
                        } else {
                          console.warn(
                            `[adminlab]: action \`${action}\` missing callback function`
                          );
                        }
                      },
                    });
                  } else {
                    if (isFunction(handler)) {
                      handler(row, scope, action);
                    }
                  }
                },
                findColumn
              );
            },
          };
        });
    },
  };

  const {
    props: tableProps = {},
    slots = {},
    directives,
  } = adapter.useComponent(ComponentType.Table, options) || {};

  const result = h(node, tableProps, slots);

  return Array.isArray(directives) && directives.length
    ? withDirectives(result, directives)
    : result;
};

export const useTableWrapper = (node: VNode, opts: ContainerCore) => {
  const { state, fetch } = opts;
  const { loading, error } = state;

  return h(
    TableWrapper,
    {
      loading: loading.value.table,
      error: error.value,
      onReload: fetch,
    },
    () => node
  );
};
