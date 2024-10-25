import { KeyType, Preset } from '../src/enums';
import { toGreek } from '../src/toGreek';
import { toTransliteration } from '../src/toTransliteration';

// Applying upsilon_y

/*
  ${'ΑYΤΌΜΑΤΟΣ'} | ${'AUTÓMATOS'}
  ${'ἄϋλος'}     | ${'áÿlos'}
  ${'ὑΐδιον'}    | ${'hyḯdion'}
  ${'ὕδωρ'}      | ${'hýdōr'}
  ${'Ὕϐλα'}      | ${'Hýbla'}
  ${'ὔ ὗ'}       | ${'ý hỹ'}
*/

test.each`
  str            | expected
  ${'ὑϐρίς'}     | ${'hybrís'}
  ${'αὐτόματος'} | ${'autómatos'}
`('Applying upsilon_y', ({ str, expected }) =>
  expect(
    toTransliteration(str, KeyType.GREEK, {
      transliterationStyle: { upsilon_y: true }
    })
  ).toBe(expected)
);

// Applying upsilon_y, only preserving diphthongs au, eu, ou

/*test.each`
  str           | expected
  ${'ΣΟΥΙΔΑΣ'}  | ${'SOUIDAS'}
  ${'μαυλίς'}   | ${'maulís'}
  ${'πνεῦμα'}   | ${'pneũma'}
  ${'ηὔδων'}    | ${'ēýdōn'}
  ${'ποῦ'}      | ${'poũ'}
  ${'μυίαγρος'} | ${'myíagros'}
  ${'ωὐτός'}    | ${'ōytós'}
`(
  'Applying upsilon_y, only preserving diphthongs au, eu, ou',
  ({ str, expected }) =>
    expect(
      toTransliteration(str, KeyType.GREEK, {
        transliterationStyle: { upsilon_y: Preset.ISO }
      })
    ).toBe(expected)
);*/
