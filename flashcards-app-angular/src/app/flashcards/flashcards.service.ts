import { inject, Injectable, signal } from '@angular/core';
import { Card, CardSet, NewCard, type NewSet, type Sets } from '../sets-model';
import { map, Subject, tap, throwError } from 'rxjs';
import { cards, Flashcards } from './flashcards';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class FlashcardsService {
  constructor() {}

  httpClient = inject(HttpClient);

  private sets = signal<Sets>(Flashcards);

  private cardsOfSet = signal<Card[]>(cards);

  allSets = this.sets.asReadonly();

  allCardsOfSet = this.cardsOfSet.asReadonly();

  fetchCards(setId: number) {
    return this.httpClient
      .get<{ cards: Card[] }>('http://localhost:3000/cards/' + setId)
      .pipe(
        map((res) => res.cards),
        tap((cards) => {
          this.cardsOfSet.set(cards);
        })
      );
  }

  fetchSets() {
    return this.httpClient
      .get<{ sets: Sets }>('http://localhost:3000/sets')
      .pipe(
        tap((res) => {
          // console.log(res.sets);
          this.sets.set(res.sets);
        })
      );
  }

  addSet(newSet: NewSet) {
    return this.httpClient
      .post('http://localhost:3000/set', newSet)
      .pipe(tap((res) => {}));
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
  }

  updateSet(updatedSet: NewSet, setId: number) {
    return this.httpClient.put(`http://localhost:3000/set`, {
      updatedSet,
      setId,
    });
  }

  updateCard(updatedCard: Card) {
    this.cardsOfSet.update((old) =>
      old.map((card) => (card.id === updatedCard.id ? updatedCard : card))
    );

    return this.httpClient.patch('http://localhost:3000/cards', updatedCard);
  }

  editSet(editedSet: CardSet, editedCards: Card[]) {
    this.sets.update((oldSets) =>
      oldSets.map((set) => (set.setId === editedSet.setId ? editedSet : set))
    );
    this.cardsOfSet.update((oldCards) =>
      oldCards.filter((card) => card.setId !== editedSet.setId)
    );

    this.cardsOfSet.update((oldCards) => [...oldCards, ...editedCards]);
  }

  getSet(setId: number) {
    return this.sets().find((set) => set.setId === setId);
  }

  getCards(setId: number) {
    return this.cardsOfSet().filter((card) => card.setId === setId);
  }

  getCard(cardId: number) {
    return this.allCardsOfSet().find((card) => card.id === cardId);
  }

  replaceCard(updatedCard: Card) {
    this.cardsOfSet.update((oldCards) =>
      oldCards.map((card) => (card.id === updatedCard.id ? updatedCard : card))
    );
  }

  swapCards() {
    this.cardsOfSet.update((oldCards) =>
      oldCards.map((card) => ({
        ...card,
        term: card.definition,
        definition: card.term,
      }))
    );
  }

  shuffleCards() {
    const temp = [...this.cardsOfSet()];
    for (let i = temp.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [temp[i], temp[j]] = [temp[j], temp[i]];
    }
    this.cardsOfSet.set(temp);
  }
}
