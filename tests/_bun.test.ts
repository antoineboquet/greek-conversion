//import { expect, test } from 'bun:test';
import { toGreek } from '../src/toGreek';
import { KeyType } from '../src/enums';

const simpleBetaCodeToGreek = {
  'basic-conversion': [
    {
      i: 'ABGDEZHQIKLMNCOPRSTUFXYW',
      o: 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ'
    },
    {
      i: 'abgdezhqiklmncoprstufxyw',
      o: 'αβγδεζηθικλμνξοπρστυφχψω'
    },
    {
      i: 'a)/a(/a%27a%26h|=i+',
      o: 'ἄἅᾰᾱῇϊ'
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
    }
    /*{
      i: 'voi=',
      o: 'vοῖ'
    },
    {
      i: 'a(/gios3',
      o: 'ἅγιοσ3'
    },
    {
      str: 'a)%27a%26ehi%27i%26owu%27u%26',
      expected: 'ἀ̆ᾱεηῐῑοωῠῡ'
    }*/
  ]
};

for (const key of Object.keys(simpleBetaCodeToGreek)) {
  test.each(simpleBetaCodeToGreek[key])(key, ({ i, o }) => {
    expect(toGreek(i, KeyType.SIMPLE_BETA_CODE)).toBe(o);
  });
}

const transliterationToGreek = {
  'basic-conversion': [
    {
      i: 'ABGDEZĒThIKLMNXOPRSTUPhChPsŌ',
      o: 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ'
    },
    {
      i: 'abgdezēthiklmnxoprstuphchpsō',
      o: 'αβγδεζηθικλμνξοπρστυφχψω'
    },
    {
      i: 'ē',
      o: 'η'
    }
  ]
};

for (const key of Object.keys(transliterationToGreek)) {
  test.each(transliterationToGreek[key])(key, ({ i, o }) => {
    expect(toGreek(i, KeyType.TRANSLITERATION)).toBe(o);
  });
}
