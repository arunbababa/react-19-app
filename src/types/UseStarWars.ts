type PersonData = {
  name: string; // 名前
  height: string; // 身長
  mass: string; // 体重
  hair_color: string; // 髪の色
};

type UseStarWars = {
  personData: PersonData | null;
  handleSubmit: () => void;
};

export type { PersonData, UseStarWars };
