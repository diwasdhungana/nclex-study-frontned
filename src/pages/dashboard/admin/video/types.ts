import { object, string } from 'prop-types';

// types.ts
export interface Video {
  _id: string;
  title: string;
  subject: string | { name: string; _id: string }; // Added subject property
  system: string; // Added system property
  link: string;
  createdAt: string;
  description: string;
  duration?: string;
}
