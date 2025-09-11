export type Sets = CardSet[];

// export type NewSet = {
//   title: string;
//   description: string;
// };

export type CardSet = {
  title: string;
  description: string;
  setId: number;
  numCards: number;
};

export type Card = {
  term: string;
  definition: string;
  setId: number;
  id: number;
};

export type NewCard = {
  term: string;
  definition: string;
};

export type NewSet = {
  title: string;
  description: string;
  cards: NewCard[];
};
