import { expect, test } from 'bun:test';
import { toGreek } from '../src/toGreek';
import { KeyType } from '../src/enums';

const basicConversion = [
  {
    str: 'a)/nqrwpos',
    expected: 'ἄνθρωπος'
  },
  {
    str: 'kalo\\s ka)gaqo/s',
    expected: 'καλὸς κἀγαθός'
  },
  {
    str: 'au)to/nomos',
    expected: 'αὐτόνομος'
  },
  {
    str: 'poih|=',
    expected: 'ποιῇ'
  },
  {
    str: 'A)/i+da',
    expected: 'Ἄϊδα'
  },
  {
    str: 'ba/rbaros',
    expected: 'βάρβαρος'
  },
  {
    str: 'O(pli/ths',
    expected: 'Ὁπλίτης'
  },
  {
    str: 'voi=',
    expected: 'vοῖ'
  },
  {
    str: 'a(/gios3',
    expected: 'ἅγιοσ3'
  },
  {
    str: 'a)%27a%26ehi%27i%26owu%27u%26',
    expected: 'ἀ̆ᾱεηῐῑοωῠῡ'
  }
];

test.each(basicConversion)('Basic conversion', ({ str, expected }) => {
  expect(toGreek(str, KeyType.SIMPLE_BETA_CODE)).toBe(expected);
});
