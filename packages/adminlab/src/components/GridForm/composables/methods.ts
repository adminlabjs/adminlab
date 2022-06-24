import { setInstanceProperty } from '@/utils/instance';

type Done = (valid: boolean, model: IObject) => void;

const useSubmit = (validate: (done: Done) => void) => {
  setInstanceProperty({
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
  })
};

const useReset = (resetModel: () => void) => {
  setInstanceProperty({
    resetModel,
  })
};

export const useMethods = (
  validate: Parameters<typeof useSubmit>[0],
  resetModel: Parameters<typeof useReset>[0],
) => {
  useSubmit(validate);
	useReset(resetModel);
};
