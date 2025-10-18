import * as _ from "lodash";

interface IInputValidator {
  success: boolean;
  message?: string;
}

export const inputValidator = async <T extends object>(
  inputData: T,
): Promise<IInputValidator> => {
  const objectEntries = Object.entries(inputData);

  for (const [key, value] of objectEntries) {
    if (_.isUndefined(value)) {
      return {
        success: false,
        message: `Param ${key} is missing`,
      };
    }
  }

  return {
    success: true,
  };
};
