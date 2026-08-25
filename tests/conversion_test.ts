import{betaCodeToGreek,betaCodeToTransliteration,greekToBetaCode,greekToTransliteration,transliterationToBetaCode,transliterationToGreek}from'../src/mod.ts';
const eq=(actual:unknown,expected:unknown)=>{if(actual!==expected)throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`)};
Deno.test('Greek and Beta Code',()=>{eq(greekToBetaCode('ἄνθρωπος'),'a)/nqrwpos');eq(betaCodeToGreek('a)/nqrwpos'),'ἄνθρωπος');eq(greekToBetaCode('Ἄϊδα'),'A)/i+da')});
Deno.test('Greek and transliteration',()=>{eq(greekToTransliteration('ἄνθρωπος'),'ánthrōpos'.normalize('NFC'));eq(transliterationToGreek('ánthrōpos'.normalize('NFC')),'ἄνθρωπος');eq(greekToTransliteration('Ῥόδος'),'Rhódos')});
Deno.test('Beta Code and transliteration',()=>{eq(betaCodeToTransliteration('a)/nqrwpos'),'ánthrōpos'.normalize('NFC'));eq(transliterationToBetaCode('ánthrōpos'.normalize('NFC')),'a)/nqrwpos')});
Deno.test('preserves literals',()=>eq(transliterationToGreek('logos 🙂 123'),'λογος 🙂 123'));
