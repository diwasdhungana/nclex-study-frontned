/**
 * Utility functions for working with FormData
 */

/**
 * Converts a FormData object to a plain JavaScript object
 * @param formData The FormData object to convert
 * @returns A plain object with the same keys and values
 */
export const formDataToObject = (formData: FormData): Record<string, any> => {
  return Object.fromEntries(formData.entries());
};

/**
 * Logs all keys and values from a FormData object without using a loop
 * @param formData The FormData object to log
 * @param label Optional label for the log
 */
export const logFormData = (formData: FormData, label = 'FormData contents'): void => {
  console.log(`🔍 ${label}:`, Object.fromEntries(formData.entries()));
};
