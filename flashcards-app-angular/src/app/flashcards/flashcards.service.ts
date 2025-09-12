import { inject, Injectable, signal } from '@angular/core';
import { Card, CardSet, NewCard, type NewSet, type Sets } from '../sets-model';
import { map, Subject, tap, throwError } from 'rxjs';
import { cards, Flashcards } from './flashcards';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class FlashcardsService {
  constructor() {}

  httpClient = inject(HttpClient);

  fetchCards(setId: number) {
    return this.httpClient
      .get<{ cards: Card[] }>('http://localhost:3000/cards/' + setId)
      .pipe(
        map((res) => res.cards),
        tap((cards) => {
          this.cardsOfSet.set(cards);
          console.log(this.allCardsOfSet());
        })
      );
  }

  fetchSets() {
    return this.httpClient
      .get<{ sets: Sets }>('http://localhost:3000/sets')
      .pipe(
        tap((res) => {
          this.sets.set(res.sets);
          // console.log(this.allSets());
        })
      );
  }

  private sets = signal<Sets>(Flashcards);

  private cardsOfSet = signal<Card[]>(cards);

  allSets = this.sets.asReadonly();

  allCardsOfSet = this.cardsOfSet.asReadonly();

  updateCard$ = new Subject<NewCard>();

  addSet(newSet: NewSet) {
    // const setId = new Date().getTime().toString();

    // this.sets.update((oldsets) => [...oldsets, { ...newSet, setId: setId }]);

    // const cards: Card[] = newCards.map((newCards) => ({
    //   ...newCards,
    //   setId: setId,
    // }));
    console.log('gaga');

    return this.httpClient
      .post('http://localhost:3000/set', newSet)
      .pipe(tap((res) => {}));

    this.cardsOfSet.update((oldCards) => [...oldCards, ...cards]);
  }

  editSet(editedSet: CardSet, editedCards: Card[]) {
    this.sets.update((oldSets) =>
      oldSets.map((set) => (set.setId === editedSet.setId ? editedSet : set))
    );
    this.cardsOfSet.update((oldCards) =>
      oldCards.filter((card) => card.setId !== editedSet.setId)
    );

    this.cardsOfSet.update((oldCards) => [...oldCards, ...editedCards]);

    this.saveSets();
    this.saveCards();
  }

  getSet(setId: number) {
    return this.sets().find((set) => set.setId === setId);
  }

  getCards(setId: number) {
    return this.cardsOfSet().filter((card) => card.setId === setId);
  }

  deleteSet(setId: number) {
    return this.httpClient
      .delete<{ sets: Sets }>(`http://localhost:3000/sets/${setId}`)
      .pipe(
        tap((res) => {
          // console.log(res);
          this.sets.set(res.sets);
        })
      );

    this.sets.update((oldSets) => oldSets.filter((set) => set.setId !== setId));
    this.deleteCards(setId);
    this.saveSets();
    this.saveCards();
  }

  deleteCards(setId: number) {
    this.cardsOfSet.update((oldcards) =>
      oldcards.filter((card) => card.setId !== setId)
    );
  }

  getCard(cardId: number) {
    return this.allCardsOfSet().find((card) => card.id === cardId);
  }

  replaceCard(updatedCard: Card) {
    this.cardsOfSet.update((oldCards) =>
      oldCards.map((card) => (card.id === updatedCard.id ? updatedCard : card))
    );
    this.saveCards();
  }

  swapCards() {
    // this.cardsOfSet.update((oldCards) =>
    //   oldCards.map((card) =>
    //     card.setId === setId
    //       ? { ...card, term: card.definition, definition: card.term }
    //       : card
    //   )
    // );

    // this.saveCards();
    this.cardsOfSet.update((oldCards) =>
      oldCards.map((card) => ({
        ...card,
        term: card.definition,
        definition: card.term,
      }))
    );
  }

  private saveSets() {
    localStorage.setItem('sets', JSON.stringify(this.sets()));
  }

  private saveCards() {
    localStorage.setItem('cards', JSON.stringify(this.cardsOfSet()));
  }

  shuffleCards() {
    const temp = [...this.cardsOfSet()];
    for (let i = temp.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [temp[i], temp[j]] = [temp[j], temp[i]];
    }
    this.cardsOfSet.set(temp);
  }

  // shuffleCards(setId: number) {
  //   const indices = this.cardsOfSet().reduce<number[]>((acc, val, i) => {
  //     return val.setId === setId ? [...acc, i] : acc;
  //   }, []);

  //   const setCards = this.cardsOfSet().filter(
  //     (card, i) => card.setId === setId
  //   );

  //   const shuffledSetCards = this.shuffle([...setCards]);

  //   const cards = [...this.cardsOfSet()];

  //   indices.forEach((val, i) => {
  //     cards[val] = shuffledSetCards[i];
  //   });

  //   this.cardsOfSet.set(cards);

  //   this.saveCards();
  // }
}
