
const pick = <T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
  return keys.reduce((acc, key) => {
    if (key in obj) {
      acc[key] = obj[key];
    }
    return acc;
  }, {} as Pick<T, K>);
};

const omit = <T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
  return Object.keys(obj).reduce((acc, key) => {
    if (!keys.includes(key as K)) {
      (acc as any)[key] = obj[key];
    }
    return acc;
  }, {} as Omit<T, K>);
};

const slug = (text: string, separator: string = '-'): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
    .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
    .replace(/[ìíịỉĩ]/g, 'i')
    .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
    .replace(/[ùúụủũưừứựửữ]/g, 'u')
    .replace(/[ỳýỵỷỹ]/g, 'y')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, separator) // Replace spaces with separator
    .replace(/-+/g, separator) // Replace multiple hyphens with single separator
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
};

export { pick, omit, slug };
