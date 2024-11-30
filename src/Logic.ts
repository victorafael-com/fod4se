import normalizeText from "normalize-text";
import { AnalyzeConfig, FSResult, ReplaceDirection } from "./types";
import { regexTemplate } from "./regexTemplates";
import { symbolRegexList } from "./symbolsRegex";

function fixReplaceRatio(number?: number) {
  if (typeof number === "number") {
    return Math.max(0, Math.min(1, number));
  } else {
    return 1;
  }
}

function repeat(str: string, length: number): string {
  if (str.length === 1) {
    return str.repeat(length);
  } else if (str.length === 0) {
    return "";
  } else {
    return str.repeat(Math.ceil(length / str.length)).substring(0, length);
  }
}

function replace(
  text: string,
  start: number,
  end: number,
  replaceString: string,
  replaceRatio: number,
  replaceDirection: ReplaceDirection
) {
  const length = end - start;

  if (replaceRatio === 1) {
    return (
      text.substring(0, start) +
      repeat(replaceString, length) +
      text.substring(end)
    );
  }

  const replacementLength = Math.ceil(length * replaceRatio);
  const keepLength = length - replacementLength;
  const replacement = repeat(replaceString, replacementLength);
  if (replaceDirection === "RTL") {
    return (
      text.substring(0, start + keepLength) + replacement + text.substring(end)
    );
  } else {
    return (
      text.substring(0, start) + replacement + text.substring(end - keepLength)
    );
  }
}

function regExp(template: string, word: string) {
  return new RegExp(template.replace(/\{0\}/g, word), "gi");
}

function normalizeSymbols(text: string) {
  return symbolRegexList.reduce((currentText, symbol) => {
    return currentText.replace(symbol.regex, symbol.target);
  }, text);
}

export function analyzeText(
  text: string,
  profanity: string[],
  config?: AnalyzeConfig
): FSResult {
  if (profanity.length === 0) {
    console.warn(
      "Fod4se: No profanity list provided. No filtering will be done."
    );
    return {
      original: text,
      cleaned: text,
      profanity: false,
      matches: [],
    };
  }

  const ignore = config?.ignore || [];
  const replaceString = config?.replaceString || "*";
  const replaceRatio = fixReplaceRatio(config?.replaceRatio);
  const replaceDirection = config?.replaceDirection || "RTL";
  const matchTemplate = config?.matchTemplate || regexTemplate.fullWord;
  const ignoreSymbols = !!config?.ignoreSymbols;

  const normalized = ignoreSymbols
    ? normalizeText(text)
    : normalizeSymbols(normalizeText(text));

  const matches = profanity
    .map((word) => {
      let regex = regExp(matchTemplate, word);
      //checks for matches in the normalized text
      const matches = normalized.matchAll(regex);
      if (matches) {
        return Array.from(matches).map((match) => {
          const start = match.index!;
          const length = match[0].length;

          return {
            profanity: word,
            start,
            end: start + length,
          };
        });
      }
    })
    //returns only the valid lines [{}], [{},{}]
    .filter((match) => match)
    //flattens the array to a single list [{}, {}, {}]
    .flat()
    //filters the false positives (remove ignored entries)
    .filter((match) => {
      //find ignored entries that includes found profanity
      const filteredIgnore = ignore.filter((i) => i.includes(match!.profanity));

      if (filteredIgnore.length === 0) {
        return true;
      }

      const matchesIgnored = filteredIgnore.some((ignored) => {
        const result = text.matchAll(regExp(regexTemplate.fullWord, ignored));
        if (result) {
          return Array.from(result).some((r) => {
            const start = r.index!;
            const length = r[0].length;
            return match!.start >= start && match!.end <= start + length;
          });
        }
      });
      return !matchesIgnored;
    })
    //orders the matches by start index
    .sort((a, b) => a!.start - b!.start);

  const cleaned = matches.reduce((acc, match) => {
    return replace(
      acc,
      match!.start,
      match!.end,
      replaceString,
      replaceRatio,
      replaceDirection
    );
  }, text);

  return {
    original: text,
    cleaned,
    profanity: matches.length > 0,
    matches: matches.map((match) => ({
      ...match!,
      replacement: cleaned.substring(match!.start, match!.end),
    })),
  };
}

export function getSafeText(
  text: string,
  profanity: string[],
  config?: AnalyzeConfig
): string {
  return analyzeText(text, profanity, config).cleaned;
}
