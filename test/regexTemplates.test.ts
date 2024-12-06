import { regexTemplate } from "../src";

describe("regexTemplate.fullWord", () => {
  const word = "bad";
  const pattern = new RegExp(regexTemplate.fullWord.replace("{0}", word), "gi");

  test("matches standalone word", () => {
    expect("bad".match(pattern)).toEqual(["bad"]);
  });

  test("matches word with punctuation", () => {
    expect("bad!".match(pattern)).toEqual(["bad"]);
    expect("[bad]".match(pattern)).toEqual(["bad"]);
    expect("bad.".match(pattern)).toEqual(["bad"]);
    expect('"bad"'.match(pattern)).toEqual(["bad"]);
  });

  test("should match in phrases", () => {
    expect("this is bad".match(pattern)).toEqual(["bad"]);
    expect("this is a bad word".match(pattern)).toEqual(["bad"]);
    expect("this is a bad, bad word. bad!".match(pattern)).toEqual([
      "bad",
      "bad",
      "bad",
    ]);
  });

  test("does not match partial words", () => {
    expect("badger".match(pattern)).toBeNull();
    expect("embad".match(pattern)).toBeNull();
    expect("badass".match(pattern)).toBeNull();
  });
});
