import { LanguageFilter, regexTemplate } from "../src";

describe("LanguageFilter - Default configs", () => {
  const filter = new LanguageFilter({
    baseLanguage: "none",
    config: {
      profanity: ["bad", "worse"],
    },
  });

  test("should have default configs", () => {
    expect(filter.replaceDirection).toBe("RTL");
    expect(filter.replaceRatio).toBe(1);
    expect(filter.replaceString).toBe("*");
    expect(filter.matchTemplate).toBe(regexTemplate.fullWord);
  });

  test("should filter profanity", () => {
    const result = filter.analyze("this is bad");
    expect(result.cleaned).toBe("this is ***");
    expect(result.profanity).toBe(true);
  });

  test("should not filter partial results in default config", () => {
    const result = filter.analyze("check out my badge");
    expect(result.cleaned).toBe("check out my badge");
    expect(result.profanity).toBe(false);
  });
});
describe("LanguageFilter - Custom configs", () => {
  const filter = new LanguageFilter({
    baseLanguage: "none",
    config: {
      profanity: ["bad", "worse"],
      ignore: ["badge"],
      replaceDirection: "RTL",
      replaceRatio: 1,
      replaceString: "*",
      matchTemplate: regexTemplate.partialMatch,
      ignoreSymbols: true,
    },
  });

  test("should filter profanity", () => {
    const result = filter.analyze("this is bad");
    expect(result.cleaned).toBe("this is ***");
    expect(result.profanity).toBe(true);
  });

  test("should work on partial matches", () => {
    const result = filter.analyze("I like to play badminton");
    expect(result.cleaned).toBe("I like to play ***minton");
    expect(result.profanity).toBe(true);
  });

  test("should allow ignored words", () => {
    const result = filter.analyze("check out my badge");
    expect(result.cleaned).toBe("check out my badge");
    expect(result.profanity).toBe(false);
  });

  test("ignored words and matched words should work together", () => {
    const result = filter.analyze("I won a badminton badge");
    expect(result.cleaned).toBe("I won a ***minton badge");
    expect(result.profanity).toBe(true);
  });

  test("should ignore matching symbols if instructed to", () => {
    const result = filter.analyze("b4d");
    expect(result.cleaned).toBe("b4d");
    expect(result.profanity).toBe(false);
  });

  test("should be able to change config on the fly", () => {
    const filter = new LanguageFilter({
      baseLanguage: "none",
      config: {
        profanity: ["anything"],
        matchTemplate: regexTemplate.partialMatch,
      },
    });
    expect(filter.getSafe("do you need anything?")).toBe(
      "do you need ********?"
    );
    filter.profanity = ["nothing"];
    expect(filter.getSafe("do you need anything?")).toBe(
      "do you need anything?"
    );
    expect(filter.getSafe("I need nothing")).toBe("I need *******");
    expect(filter.getSafe("what is this nothingness")).toBe(
      "what is this *******ness"
    );
    filter.matchTemplate = regexTemplate.fullWord;
    expect(filter.getSafe("what is this nothingness")).toBe(
      "what is this nothingness"
    );
    filter.replaceRatio = 0.5;
    expect(filter.getSafe("This is nothing")).toBe("This is not****");
    filter.replaceString = "-";
    expect(filter.getSafe("This is nothing")).toBe("This is not----");
    filter.replaceDirection = "LTR";
    expect(filter.getSafe("This is n0thing")).toBe("This is ----ing");
    filter.ignoreSymbols = true;
    expect(filter.getSafe("This is n0thing")).toBe("This is n0thing");
    filter.matchTemplate = regexTemplate.partialMatch;
    filter.ignore = ["nothingness"];
    expect(filter.getSafe("This is nothingness")).toBe("This is nothingness");
  });
});
