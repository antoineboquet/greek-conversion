import { assertEquals } from "@std/assert";
import { KeyType, toGreek } from "./index.ts";

Deno.test(function addTest() {
  assertEquals(toGreek("a)/nqrwpos", KeyType.BETA_CODE), "lala");
});
