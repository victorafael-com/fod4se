import { FSConfig, FSResult, ReplaceDirection } from "./types";
import dictionary from "./dictionary";
import { normalizeText } from "normalize-text";
import { analyzeText } from "./Logic";
import { regexTemplate } from "./regexTemplates";

const defaultConfig: FSConfig = {
  replaceDirection: "RTL",
  replaceRatio: 1,
  replaceString: "*",
  matchTemplate: regexTemplate.fullWord,
  ignoreSymbols: false,
};

interface LanguageFilterConfig {
  baseLanguage: "none" | keyof typeof dictionary;
  config: FSConfig;
}

export class LanguageFilter {
  profanity: string[];
  ignore: string[];
  replaceRatio: number;
  replaceString: string;
  replaceDirection: ReplaceDirection;
  matchTemplate: string;
  ignoreSymbols: boolean;

  constructor({ baseLanguage, config }: LanguageFilterConfig) {
    this.replaceDirection =
      config.replaceDirection || defaultConfig.replaceDirection!;
    this.replaceRatio = config.replaceRatio || defaultConfig.replaceRatio!;
    this.replaceString = config.replaceString || defaultConfig.replaceString!;
    this.matchTemplate = config.matchTemplate || defaultConfig.matchTemplate!;
    this.ignoreSymbols = config.ignoreSymbols || defaultConfig.ignoreSymbols!;
    if (baseLanguage === "none") {
      if (!config.profanity) {
        console.warn(
          "Fod4se: No profanity list provided and no base language selected. No filtering will be done."
        );
      }
      this.profanity = config.profanity || [];
      this.ignore = config.ignore || [];
    } else {
      this.profanity = [
        ...dictionary[baseLanguage].profanity,
        ...(config.profanity || []),
      ];
      this.ignore = [
        ...dictionary[baseLanguage].ignore,
        ...(config.ignore || []),
      ];
    }
  }

  analyze(text: string): FSResult {
    return analyzeText(text, this.profanity, {
      ignore: this.ignore,
      replaceDirection: this.replaceDirection,
      replaceRatio: this.replaceRatio,
      replaceString: this.replaceString,
      matchTemplate: this.matchTemplate,
      ignoreSymbols: this.ignoreSymbols,
    });
  }

  getSafe(text: string): string {
    return this.analyze(text).cleaned;
  }
}
