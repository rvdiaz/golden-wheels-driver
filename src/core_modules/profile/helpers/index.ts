import { IncomeSource } from '../interfaces';

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export const INCOME_SOURCE = Object.values(IncomeSource).map((value) => ({
  label: capitalize(value),
  value,
}));
