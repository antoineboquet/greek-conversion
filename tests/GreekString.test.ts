import {
  GreekString,
  KeyType,
  Preset
} from '../src/index';
import { IConversionOptions } from '../src/interfaces';


describe('Testing the GreekString object', () => {

  test('Testing KeyType.BETA_CODE', () => {
    const str = '*BA/RBAROS';
    const gs = new GreekString(str, KeyType.BETA_CODE);
    expect(gs.source).toBe(str);
    expect(gs.betaCode).toBe(str);
    expect(gs.greek).toBe('Βάρβαρος');
    expect(gs.transliteration).toBe('Bárbaros');
  });

  test('Testing KeyType.GREEK', () => {
    const str = 'Βάρβαρος';
    const gs = new GreekString(str, KeyType.GREEK);
    expect(gs.source).toBe(str);
    expect(gs.betaCode).toBe('*BA/RBAROS');
    expect(gs.greek).toBe(str);
    expect(gs.transliteration).toBe('Bárbaros');
  });

  test('Testing KeyType.TRANSLITERATION', () => {
    const str = 'Bárbaros';
    const gs = new GreekString(str, KeyType.TRANSLITERATION);
    expect(gs.source).toBe(str);
    expect(gs.betaCode).toBe('*BA/RBAROS');
    expect(gs.greek).toBe('Βάρβαρος');
    expect(gs.transliteration).toBe(str);
  });

  test('Testing KeyType.SIMPLE_BETA_CODE', () => {
    const str = 'Ba/rbaros';
    const gs = new GreekString(str, KeyType.SIMPLE_BETA_CODE);
    // @fixme: the source is converted to TLG beta code; keep the simple beta code input?
    expect(gs.source).toBe('*BA/RBAROS');
    expect(gs.betaCode).toBe('*BA/RBAROS');
    expect(gs.greek).toBe('Βάρβαρος');
    expect(gs.transliteration).toBe('Bárbaros');
  });

});

describe('Testing the GreekString object /w presets', () => {

  test('Testing Preset.ALA_LC', () => {
    const str = 'τί τοῦδ’ ἂν εὕρημ’ ηὗρον εὐτυχέστερον;';
    const gs = new GreekString(str, KeyType.GREEK, Preset.ALA_LC);
    expect(gs.source).toBe(str);
    expect(gs.betaCode).toBe('TI TOUD AN EURHM HURON EUTUXESTERON;');
    expect(gs.greek).toBe('τι τουδ’ αν ευρημ’ ηυρον ευτυχεστερον;');
    // @fixme: converting from the converted source looses rough breathings.
    expect(gs.transliteration).toBe('ti toud’ an heurēm’ hēuron eutychesteron?');
  });

  // Preset.ALA_LC_MODERN

  // Preset.BNF_ADPATED

  // Preset.ISO

  // Preset.SBL

});

describe('Testing the GreekString object w/ global options', () => {

  // Removing diacritics

  test('Testing whitespace behavior', () => {
    const str = 'αἴξ   κριός';

    const gs1 = new GreekString('αἴξ   κριός', KeyType.GREEK)

    expect(gs1.source).toBe(str)
    expect(gs1.betaCode).toBe('AI)/C   KRIO/S')
    expect(gs1.greek).toBe(str)
    expect(gs1.transliteration).toBe('aíx   kriós')

    const options: IConversionOptions = { removeExtraWhitespace: true };
    const gs2 = new GreekString(str, KeyType.GREEK, options);

    expect(gs2.source).toBe(str);
    expect(gs2.betaCode).toBe('AI)/C KRIO/S');
    expect(gs2.greek).toBe('αἴξ κριός');
    expect(gs2.transliteration).toBe('aíx kriós');
  });

  // Using additional chars

});

describe('Testing the GreekString object w/ beta code options', () => {

  // ...

  test('...', () => { });

});

describe('Testing the GreekString object w/ greek options', () => {

  // ...

  test('...', () => { });

});

describe('Testing the GreekString object w/ transliteration options', () => {

  // ...

  test('...', () => { });

});
