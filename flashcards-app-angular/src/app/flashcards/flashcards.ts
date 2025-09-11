import { Card, Sets } from '../sets-model';

export const Flashcards: Sets = [
  {
    title: 'italian-english',
    description: 'animals',
    setId: 1,
    numCards: 3,
  },

  {
    title: 'italian english vocabulary',
    description: 'fruit',
    setId: 2,
    numCards: 4,
  },

  {
    title: 'german english vocabulary',
    description: 'vegetables',
    setId: 3,
    numCards: 5,
  },
];

export const cards: Card[] = [
  {
    id: 1,
    setId: 1,
    term: 'cane',
    definition: 'dog',
  },
  {
    id: 2,
    setId: 1,
    term: 'gatto',
    definition: 'cat',
  },
  {
    id: 3,
    setId: 1,
    term: 'pecora',
    definition: 'sheep',
  },
  {
    id: 4,
    setId: 2,
    term: 'mela',
    definition: 'apple',
  },
  {
    id: 5,
    setId: 2,
    term: 'uva',
    definition: 'grape',
  },
  {
    id: 6,
    setId: 2,
    term: 'fragola',
    definition: 'strawberry',
  },
  {
    id: 7,
    setId: 2,
    term: 'arancia',
    definition: 'orange',
  },
  {
    id: 8,
    setId: 3,
    term: 'die Gurke',
    definition: 'cucumber',
  },
  {
    id: 9,
    setId: 3,
    term: 'die Kartoffel',
    definition: 'potato',
  },
  {
    id: 10,
    setId: 3,
    term: 'die Zwiebel',
    definition: 'onion',
  },
  {
    id: 11,
    setId: 3,
    term: 'die Möhre',
    definition: 'carrot',
  },
  {
    id: 12,
    setId: 3,
    term: 'der Spinat',
    definition: 'spinach',
  },
];
