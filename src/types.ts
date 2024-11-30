export interface FSMatch {
  profanity: string;
  replacement: string;
  start: number;
  end: number;
}

export interface FSResult {
  original: string;
  cleaned: string;
  profanity: boolean;
  matches: FSMatch[];
}

/**
 * Configuration for the filter
 */
export interface FSConfig {
  /**
   * List of profanity words
   */
  profanity?: string[];
  /**
   * List of words to ignore
   */
  ignore?: string[];
  /**
   * String to replace profanity with
   */
  replaceString?: string;
  /**
   * Ratio of replacement
   * 1=full replacement, 0=no replacement
   * @default 1
   */
  replaceRatio?: number;
  /**
   * Template for matching
   * @default matchTemplate.fullWord
   */
  matchTemplate?: string;
  /**
   * Direction of replacement
   * @default RTL
   */
  replaceDirection?: ReplaceDirection;

  /**
   * Should ignore symbols during test?
   * default behaviour: b4$$ -> bass
   * @default false
   */
  ignoreSymbols?: boolean;
}

export type AnalyzeConfig = Omit<FSConfig, "profanity">;

export type ReplaceDirection = "LTR" | "RTL";
