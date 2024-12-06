export const symbolRegexList = [
  {
    target: "a",
    regex: /[a@4∆^λΔàáâãäåāăǎǟǡǻȁȃạảấầẩẫậắằẳẵặ]/gi,
  },
  {
    target: "b",
    regex: /[b8ƀɓбБвЪЬβ]/gi,
  },
  {
    target: "e",
    regex: /[e3εèéêëēĕėęěɛέеЕёξ]/gi,
  },
  {
    //since i and l are close to each other. both will be converted to i
    target: "i",
    regex: /[i1!|lІї]/gi,
  },
  {
    target: "o",
    regex: /[o0όοσօοФωоОӦӧ]/gi,
  },
  {
    target: "s",
    regex: /[s5$śŝşšș§]/gi,
  },
  {
    target: "t",
    regex: /[t7+τţťțŧтТ]/gi,
  },
  {
    target: "u",
    regex: /[uυμùúûüũūŭůűųưǔǖǘǚǜȕȗưứừửữự]/gi,
  },
  {
    target: "x",
    regex: /[x×хХ]/gi,
  },
  {
    target: "y",
    regex: /[y¥ýÿŷƴȳẏẙỳỵỷỹγУу]/gi,
  },
  {
    target: "z",
    regex: /[z2ƶȥźżžżẑẓẕ]/gi,
  },
];

export function normalizeSymbols(text: string) {
  return symbolRegexList.reduce((currentText, symbol) => {
    return currentText.replace(symbol.regex, symbol.target);
  }, text);
}
