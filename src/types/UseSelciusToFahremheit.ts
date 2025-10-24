import { ChangeEvent } from 'react';

export type SelciusToFahremheit = {
  handleCelsiusInputValue: (e: ChangeEvent<HTMLInputElement>) => void;
  fahrenheit: number;
};
