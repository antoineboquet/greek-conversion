import { expect, test } from 'bun:test';
import { toGreek } from '../src/toGreek';
import { KeyType } from '../src/enums';

const tests = {
  'basic-conversion': [
    {
      i: 'ABGDEZHQIKLMNCOPRSTYFXYW',
      o: 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΥΩ'
    },
    {
      i: 'abgdezhqiklmncoprstyfxyw',
      o: 'αβγδεζηθικλμνξοπρστυφχψω'
    },
    {
      i: 'a)/nqrwpos',
      o: 'ἄνθρωπος'
    },
    {
      i: 'kalo\\s ka)gaqo/s',
      o: 'καλὸς κἀγαθός'
    },
    {
      i: 'au)to/nomos',
      o: 'αὐτόνομος'
    },
    {
      i: 'poih|=',
      o: 'ποιῇ'
    },
    {
      i: 'A)/i+da',
      o: 'Ἄϊδα'
    },
    {
      i: 'ba/rbaros',
      o: 'βάρβαρος'
    },
    {
      i: 'O(pli/ths',
      o: 'Ὁπλίτης'
    },
    {
      i: 'voi=',
      o: 'vοῖ'
    },
    {
      i: 'a(/gios3',
      o: 'ἅγιοσ3'
    }
    /*{
      str: 'a)%27a%26ehi%27i%26owu%27u%26',
      expected: 'ἀ̆ᾱεηῐῑοωῠῡ'
    }*/
  ]
};

for (const key of Object.keys(tests)) {
  test.each(tests[key])(key.replaceAll('-', ' '), ({ i, o }) => {
    expect(toGreek(i, KeyType.SIMPLE_BETA_CODE)).toBe(o);
  });
}
