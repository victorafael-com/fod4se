import { analyzeText, getSafeText } from "../src";
import { getTextBlocks } from "../src/Logic";

describe("analyzeText", () => {
  test("should analyze and replace text", () => {
    const result = analyzeText("test bad word", ["bad"], {
      replaceString: "*",
      replaceRatio: 1,
    });
    expect(result.cleaned).toBe("test *** word");
    expect(result.profanity).toBe(true);
    expect(result.matches.length).toBe(1);
  });

  test("should return the correct positions", () => {
    const result = analyzeText(
      "test bad word. this is another b4d one. this is a worst one!",
      ["bad", "worst"]
    );
    expect(result.matches.length).toBe(3);
    expect(result.matches[0].start).toBe(5);
    expect(result.matches[0].end).toBe(8);
    expect(result.matches[1].start).toBe(31);
    expect(result.matches[1].end).toBe(34);
    expect(result.matches[2].start).toBe(50);
    expect(result.matches[2].end).toBe(55);
  });
  test("should report properly the found profanity", () => {
    const result = analyzeText("test a bad b4d b@d word", ["bad"]);
    expect(result.matches.length).toBe(3);
    expect(result.matches[0].profanity).toBe("bad");
    expect(result.matches[1].profanity).toBe("bad");
    expect(result.matches[2].profanity).toBe("bad");
  });
});

describe("getSafeText", () => {
  test("should return cleaned text", () => {
    const result = getSafeText("test bad word", ["bad"]);
    expect(result).toBe("test *** word");
  });

  test("should return original if no matches", () => {
    const result = getSafeText("test good word", ["bad"]);
    expect(result).toBe("test good word");
  });

  test("should trigger a warning if no profanity list is provided", () => {
    const warn = jest.spyOn(console, "warn").mockImplementation();
    const result = getSafeText("test bad word", []);
    expect(result).toBe("test bad word");
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  test("should not trigger a warning if no profanity list is provided but dictionary is", () => {
    const warn = jest.spyOn(console, "warn").mockImplementation();
    const result = getSafeText("test bad word", [], {
      appendDictionary: "en",
    });
    expect(result).toBe("test bad word");
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  test("should validate words from appended dictionary", () => {
    const result = getSafeText("what the fuck", [], {
      appendDictionary: "en",
    });
    expect(result).toBe("what the ****");
  });

  test("should make partial RTL replacement", () => {
    const result = getSafeText("test bad word", ["bad"], {
      replaceString: "*",
      replaceRatio: 0.5,
      replaceDirection: "RTL",
    });
    expect(result).toBe("test b** word");
  });

  test("should make partial LTR replacement", () => {
    const result = getSafeText("test bad word", ["bad"], {
      replaceString: "-",
      replaceRatio: 0.5,
      replaceDirection: "LTR",
    });
    expect(result).toBe("test --d word");
  });

  test("should repeat replaceString properly", () => {
    const result = getSafeText(
      "Now we are censoring the Apothecary",
      ["apothecary"],
      {
        replaceString: "$@#!",
      }
    );
    expect(result).toBe("Now we are censoring the $@#!$@#!$@");
  });

  test("should repeat replaceString properly with ratio in LTR", () => {
    const result = getSafeText(
      "Now we are censoring the Apothecary",
      ["apothecary"],
      {
        replaceString: "$@#!",
        replaceRatio: 0.5,
        replaceDirection: "LTR",
      }
    );
    expect(result).toBe("Now we are censoring the $@#!$ecary");
  });

  test("should repeat replaceString properly with ratio in RTL (default)", () => {
    const result = getSafeText(
      "Now we are censoring the Apothecary",
      ["apothecary"],
      {
        replaceString: "$@#!",
        replaceRatio: 0.5,
      }
    );
    expect(result).toBe("Now we are censoring the Apoth$@#!$");
  });

  test("should replace symbol encoded words", () => {
    const result = getSafeText("this is a bad B@d b4D example", ["bad"]);
    expect(result).toBe("this is a *** *** *** example");
  });

  test("should recognize and replace multiple complex symbols", () => {
    const result = getSafeText("we need to match $Уmβ0|§", ["symbols"]);
    expect(result).toBe("we need to match *******");
  });

  test("should be able to not normalize symbols", () => {
    const result = getSafeText("we don't need to match $Уmβ0|§", ["symbols"], {
      ignoreSymbols: true,
    });
    expect(result).toBe("we don't need to match $Уmβ0|§");
  });

  test("should work with custom templates", () => {
    const result = getSafeText("cat [cat]", ["cat"], {
      matchTemplate: "\\[{0}\\]",
    });
    expect(result).toBe("cat *****");
  });

  test("test full word between brackets", () => {
    const result = getSafeText("this is a [bad] word", ["bad"]);
    expect(result).toBe("this is a [***] word");
  });

  test("Removing symbols shouldn't affect the result with punctuatiions", () => {
    const result = getSafeText("this is a b@d word", ["bad"]);
    expect(result).toBe("this is a *** word");

    const result2 = getSafeText("this word is bad!", ["bad"]);
    expect(result2).toBe("this word is ***!");
  });

  test("should match l and i as the same character", () => {
    const result = getSafeText("this is a flne word", ["fine"]);
    expect(result).toBe("this is a **** word");
  });
});

describe("block info", () => {
  test("should return block info", () => {
    const result = getTextBlocks("this is a bad word", ["bad"]);

    expect(result.length).toBe(3);
    expect(result[0].text).toBe("this is a ");
    expect(result[0].original).toBe("this is a ");
    expect(result[0].profanity).toBe(false);

    expect(result[1].text).toBe("***");
    expect(result[1].original).toBe("bad");
    expect(result[1].profanity).toBe(true);

    expect(result[2].text).toBe(" word");
    expect(result[2].original).toBe(" word");
    expect(result[2].profanity).toBe(false);
  });

  test("should handle profanities in both start and end", () => {
    const result = getTextBlocks("bad word are bad", ["bad"]);

    expect(result.length).toBe(3);
    expect(result[0].profanity).toBe(true);
    expect(result[1].profanity).toBe(false);
    expect(result[2].profanity).toBe(true);
  });
});
