import { generateMany } from './factory';
import { generateId } from './uid';

export const dummySubjects = generateMany(10, (index) => ({
  _id: generateId(),
  name: `Subject Name ${index}`,
  description: `Description of this subject is this. ${index}`,
  createdAt: new Date().toISOString(),
}));

export const dummySystems = generateMany(10, (index) => ({
  _id: generateId(),
  name: `System Name ${index}`,
  description: `Description of this subject is this. ${index}`,
  createdAt: new Date().toISOString(),
}));
