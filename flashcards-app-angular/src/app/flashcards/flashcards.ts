import { Card, Sets } from '../sets-model';

export const Flashcards: Sets = [
  {
    title: 'italian-english',
    description: 'animals',
    setId: 'm1',
  },

  {
    title: 'italian english vocabulary',
    description: 'fruit',
    setId: 'f1',
  },

  {
    title: 'german english vocabulary',
    description: 'vegetables',
    setId: 'g1',
  },
];

export const cards: Card[] = [
  {
    id: 'c1',
    setId: 'm1',
    term: 'cane',
    definition: 'dog',
  },
  {
    id: 'c2',
    setId: 'm1',
    term: 'gatto',
    definition: 'cat',
  },
  {
    id: 'c3',
    setId: 'm1',
    term: 'pecora',
    definition: 'sheep',
  },
  {
    id: 'a1',
    setId: 'f1',
    term: 'mela',
    definition: 'apple',
  },
  {
    id: 'a2',
    setId: 'f1',
    term: 'uva',
    definition: 'grape',
  },
  {
    id: 'a3',
    setId: 'f1',
    term: 'fragola',
    definition: 'strawberry',
  },
  {
    id: 'a4',
    setId: 'f1',
    term: 'arancia',
    definition: 'orange',
  },
  {
    id: 'v1',
    setId: 'g1',
    term: 'die Gurke',
    definition: 'cucumber',
  },
  {
    id: 'v2',
    setId: 'g1',
    term: 'die Kartoffel',
    definition: 'potato',
  },
  {
    id: 'v3',
    setId: 'g1',
    term: 'die Zwiebel',
    definition: 'onion',
  },
  {
    id: 'v4',
    setId: 'g1',
    term: 'die Möhre',
    definition: 'carrot',
  },
  {
    id: 'v5',
    setId: 'g1',
    term: 'der Spinat',
    definition: 'spinach',
  },
];
