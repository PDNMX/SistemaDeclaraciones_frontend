import { Catalogo } from '@models/declaracion/common.model';

export const findInArray = (list: string[], option: string): string | null => {
  const element = list.find((item) => item === option);

  return element || null;
};

export const findOption = (list: Catalogo[], clave: string): Catalogo | null => {
  const element = list.find((item) => item?.clave === clave);

  return element || null;
};

export const ifExistsEnableFields = (value: any, form: any, formRoute: string): void => {
  if (value) {
    form.get(formRoute).enable();
  } else {
    form.get(formRoute).disable();
  }
};
