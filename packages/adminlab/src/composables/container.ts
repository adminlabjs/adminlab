import { capitalize } from "vue";
import { getProps, makeProps, propsProxy } from "@/utils";

const actionEventPrefix = "action";
type ActionName<T extends string> = `${typeof actionEventPrefix}${T}`;
type ActionMethod = (formData: IObject) => Promise<any> | any;

const actions = ["create", "edit", "delete"] as const;
type Action = typeof actions[number];

const actionMethodNames = actions.map(
  (action) =>
    `${actionEventPrefix}${capitalize(action)}` as ActionName<
      Capitalize<typeof action>
    >
);

export const actionPropsFactory = (exclude?: Action | Action[]) => {
	const arr: Action[] = [];

	if (exclude) {
		if (Array.isArray(exclude)) {
			arr.push(...exclude);
		} else {
			arr.push(exclude);
		}
	}
	const names = actionMethodNames.filter(name => !arr.find(item => name.toLowerCase().indexOf(item) > -1))
	return propsProxy<typeof names[number], ActionMethod, (...args: any[]) => any>(names, Function);
};

export const makeActionProps = () => {
  return makeProps<
    typeof actionMethodNames[number],
    ActionMethod,
    (...args: any[]) => any
  >(actionMethodNames, Function);
};

export const getActionProps = () => {
  return getProps<typeof actionMethodNames[number], ActionMethod>(
    actionMethodNames
  );
};
