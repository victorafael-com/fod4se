import normalizeText from "normalize-text";
import { normalizeSymbols } from "../src/symbolsRegex";

describe("Text Normalization", () => {
  test("Should remove accentuation and UPPERCASE", () => {
    const result = normalizeText("THis is á tést!");
    expect(result).toBe("this is a test!");
  });

  test("Should normalize all symbols, also l to i ", () => {
    const result = normalizeSymbols("this is a b@d t3st! c0ll");
    expect(result).toBe("this is a bad testi coii");
  });
});
