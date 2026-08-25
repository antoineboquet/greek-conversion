import { assertEquals } from "@std/assert";

export function assertNfcEquals(actual: string, expected: string): void {
  assertEquals(actual, actual.normalize("NFC"), "Output must be NFC");
  assertEquals(actual, expected.normalize("NFC"));
}
