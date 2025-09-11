import { inject, Injectable, signal } from '@angular/core';
import { Card, CardSet, NewCard, type NewSet, type Sets } from '../sets-model';
import { catchError, map, Subject, tap, throwError } from 'rxjs';
import { cards, Flashcards } from './flashcards';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class FlashcardsService {
  // constructor() {
  //   const sets = localStorage.getItem('sets');
  //   const cards = localStorage.getItem('cards');

  //   if (sets) {
  //     this.sets.set(JSON.parse(sets));
  //   }

  //   if (cards) {
  //     this.cards.set(JSON.parse(cards));
  //   }
  // }

  httpClient = inject(HttpClient);

  fetchCards(setId: number) {
    return this.httpClient
      .get<{ cards: Card[] }>('http://localhost:3000/cards/' + setId)
      .pipe(map((res) => res.cards));
  }

  fetchSets() {
    return this.httpClient
      .get<{ sets: Sets }>('http://localhost:3000/sets')
      .pipe(
        tap((res) => {
          this.sets.set(res.sets);
        })
      );
  }

  private sets = signal<Sets>(Flashcards);

  private cards = signal<Card[]>(cards);

  allSets = this.sets.asReadonly();

  allCards = this.cards.asReadonly();

  updateCard$ = new Subject<NewCard>();

  // addSet(newSet: NewSet, newCards: NewCard[]) {
  //   const setId = new Date().getTime().toString();

  //   this.sets.update((oldsets) => [...oldsets, { ...newSet, setId: setId }]);

  //   const cards: Card[] = newCards.map((newCards) => ({
  //     ...newCards,
  //     setId: setId,
  //   }));

  //   this.cards.update((oldCards) => [...oldCards, ...cards]);
  // }

  editSet(editedSet: CardSet, editedCards: Card[]) {
    this.sets.update((oldSets) =>
      oldSets.map((set) => (set.setId === editedSet.setId ? editedSet : set))
    );
    this.cards.update((oldCards) =>
      oldCards.filter((card) => card.setId !== editedSet.setId)
    );

    this.cards.update((oldCards) => [...oldCards, ...editedCards]);

    this.saveSets();
    this.saveCards();
  }

  getSet(setId: number) {
    return this.sets().find((set) => set.setId === setId);
  }

  getCards(setId: number) {
    return this.cards().filter((card) => card.setId === setId);
  }

  deleteSet(setId: number) {
    return this.httpClient
      .delete<{ sets: Sets }>(`http://localhost:3000/sets/${setId}`)
      .pipe(
        tap((res) => {
          console.log(res);
          this.sets.set(res.sets);
        })
      );

    this.sets.update((oldSets) => oldSets.filter((set) => set.setId !== setId));
    this.deleteCards(setId);
    this.saveSets();
    this.saveCards();
  }

  deleteCards(setId: number) {
    this.cards.update((oldcards) =>
      oldcards.filter((card) => card.setId !== setId)
    );
  }

  getCard(cardId: number) {
    return this.allCards().find((card) => card.id === cardId);
  }

  replaceCard(updatedCard: Card) {
    this.cards.update((oldCards) =>
      oldCards.map((card) => (card.id === updatedCard.id ? updatedCard : card))
    );
    this.saveCards();
  }

  swapCards(setId: number) {
    this.cards.update((oldCards) =>
      oldCards.map((card) =>
        card.setId === setId
          ? { ...card, term: card.definition, definition: card.term }
          : card
      )
    );

    this.saveCards();
  }

  private saveSets() {
    localStorage.setItem('sets', JSON.stringify(this.sets()));
  }

  private saveCards() {
    localStorage.setItem('cards', JSON.stringify(this.cards()));
  }

  shuffle(cards: Card[]) {
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
  }

  shuffleCards(setId: number) {
    const indices = this.cards().reduce<number[]>((acc, val, i) => {
      return val.setId === setId ? [...acc, i] : acc;
    }, []);

    const setCards = this.cards().filter((card, i) => card.setId === setId);

    const shuffledSetCards = this.shuffle([...setCards]);

    const cards = [...this.cards()];

    indices.forEach((val, i) => {
      cards[val] = shuffledSetCards[i];
    });

    this.cards.set(cards);

    this.saveCards();
  }
}
