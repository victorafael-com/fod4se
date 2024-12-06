import dictionary from "./dictionary";
import { analyzeText, getTextBlocks } from "./Logic";
import { regexTemplate } from "./regexTemplates";
import { FSConfig, FSResult, FSTextBlockInfo, ReplaceDirection } from "./types";

const defaultConfig: FSConfig = {
  replaceDirection: "RTL",
  replaceRatio: 1,
  replaceString: "*",
  matchTemplate: regexTemplate.fullWord,
  ignoreSymbols: false,
};

interface LanguageFilterConfig {
  baseLanguage: "none" | keyof typeof dictionary;
  config?: FSConfig;
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
    if (!config) {
      config = {};
    }
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

  private getLogicConfig(): FSConfig {
    return {
      ignore: this.ignore,
      replaceDirection: this.replaceDirection,
      replaceRatio: this.replaceRatio,
      replaceString: this.replaceString,
      matchTemplate: this.matchTemplate,
      ignoreSymbols: this.ignoreSymbols,
    };
  }

  analyze(text: string): FSResult {
    return analyzeText(text, this.profanity, this.getLogicConfig());
  }

  getSafe(text: string): string {
    return this.analyze(text).cleaned;
  }

  getBlocks(text: string): FSTextBlockInfo[] {
    return getTextBlocks(text, this.profanity, this.getLogicConfig());
  }
}
