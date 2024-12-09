import { Coach } from "./Coach";
import { Player } from "./Player";

export interface Team {
    _id: string;
    name: string;
    city: string;
    conference: 'Eastern' | 'Western';
    coach?: {
      firstName: string;
      lastName: string;
    };
    players?: any[];
  }