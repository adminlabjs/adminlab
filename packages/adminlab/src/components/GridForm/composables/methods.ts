import { getCurrentInstance } from "vue";

type Done = (valid: boolean, model: IObject) => void;

const useSubmit = (validate: (done: Done) => void) => {
  const vm = getCurrentInstance()!;

  Object.assign(vm.proxy, {
    submit: () => {
      return new Promise((resolve, reject) => {
        const done: Done = (valid, model) => {
          if (valid === true || valid === void 0) {
            resolve(model);
          } else {
            reject();
          }
        };

        validate(done);
      });
    },
  });
};

const useReset = (resetModel: () => void) => {
  const vm = getCurrentInstance()!;

  Object.assign(vm.proxy, {
    resetModel,
  });
};

export const useMethods = (
  validate: Parameters<typeof useSubmit>[0],
  resetModel: Parameters<typeof useReset>[0],
) => {
  useSubmit(validate);
	useReset(resetModel);
};
