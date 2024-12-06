const regexTemplate = {
  /**
   * Matches the word anywhere in the text
   * Example: `bad` will match `bad`, `badass`, `badger`, `badminton`
   */
  partialMatch: "{0}",
  /**
   * Matches the word only if it is a full word
   * Example: `bad` will match `bad` but not `badass`, `badger`, `badminton`
   */
  fullWord: "(?<=^|\\s|[\\[({\"']){0}(?=$|\\s|[\\])}!?.,;:\"'])",
};

export { regexTemplate };
