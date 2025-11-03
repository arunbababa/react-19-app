import { CHOICESType } from '@/types/UseChoices';

export type Quiz = {
  CHOICES: CHOICESType;
  handleUserChoice: (CHOICE: Record<string, boolean | undefined>) => void;
  handleResult: () => void;
  result: string;
  userChoice: string;
};
