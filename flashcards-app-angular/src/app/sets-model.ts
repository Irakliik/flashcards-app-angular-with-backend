export type Sets = CardSet[];

export type NewSet = {
  title: string;
  description: string;
};

export type CardSet = {
  title: string;
  description: string;
  setId: string;
};

export type Card = {
  term: string;
  definition: string;
  setId: string;
  id: string;
};

export type NewCard = {
  term: string;
  definition: string;
  id: string;
};
