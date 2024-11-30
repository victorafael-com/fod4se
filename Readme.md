# Flexible Obfuscation Dictionary For Sanitization Enforcement (FOD4SE)

A powerful text sanitization library with support for multiple languages, symbol normalization, and flexible configuration options.

## Features

- Built-in dictionaries for multiple languages
- Symbol normalization (e.g., `@` → a, `$` → `s`)
- Partial or full word replacement
- Left-to-right or right-to-left replacement direction
- Customizable replacement characters
- Ignore list support
- Full or partial word matching

## Installation

```sh
npm install fod4se
```

## Quick Start

```typescript
import { LanguageFilter } from "fod4se";

// Create a filter with English dictionary
const filter = new LanguageFilter({ baseLanguage: "en" });

// Clean text
const cleaned = filter.getSafe("Your text here");
```

## Alternative Usages

You can also use the `getSafeText` and `analyzeText` functions directly without creating a `LanguageFilter` instance.

### Using getSafeText

```typescript
import { getSafeText } from "fod4se";

const cleaned = getSafeText("Your text here", { baseLanguage: "en" });
console.log(cleaned); // Returns sanitized text
```

### Using analyzeText

```typescript
import { analyzeText } from "fod4se";

const result = analyzeText("Text to analyze", { baseLanguage: "en" });
console.log(result.cleaned); // Sanitized text
console.log(result.profanity); // true if anything was found
console.log(result.matches); // Array of matches with details
```

## Detailed Usage

### Basic Usage with Built-in Dictionary

```typescript
import { LanguageFilter } from "fod4se";

const filter = new LanguageFilter({
  baseLanguage: "en", // Use built-in English dictionary
});

filter.getSafe("Text to clean"); // Returns sanitized text
```

    The base dictionaries are at an early stage of development and are very incomplete. If you miss something, refer to the contributing section.

### Custom Dictionary

```typescript
import { LanguageFilter } from "fod4se";

const filter = new LanguageFilter({
  baseLanguage: "none",
  config: {
    profanity: ["word1", "word2"],
    ignore: ["goodword1", "goodword2"],
  },
});
```

### Advanced Analysis

```typescript
import { LanguageFilter } from "fod4se";

const filter = new LanguageFilter({ baseLanguage: "en" });
const result = filter.analyze("Text to analyze");

console.log(result.cleaned); // Sanitized text
console.log(result.profanity); // true if anything was found
console.log(result.matches); // Array of matches with details
```

### Custom Configuration

```typescript
import { LanguageFilter, regexTemplate } from "fod4se";

const filter = new LanguageFilter({
  baseLanguage: "en",
  config: {
    replaceString: "#@", // Pattern used in replacement (What is this #@#@#)
    replaceRatio: 0.5, // Replace 50% of matched words
    replaceDirection: "LTR", // Replace from left to right
    matchTemplate: regexTemplate.partialMatch, // Match partial words
    ignoreSymbols: true, // Don't normalize symbols
  },
});
```

## Configuration Options

### LanguageFilter Options

| Option       | Type                      | Default | Description                |
| ------------ | ------------------------- | ------- | -------------------------- |
| baseLanguage | "none" \| "en" \| "pt-br" | -       | Built-in dictionary to use |
| config       | FSConfig                  | -       | Configuration object       |

### FSConfig Options

| Option           | Type           | Default                | Description                         |
| ---------------- | -------------- | ---------------------- | ----------------------------------- |
| profanity        | string[]       | []                     | Custom list of words to filter      |
| ignore           | string[]       | []                     | Words to exclude from filtering     |
| replaceString    | string         | "\*"                   | Character(s) used for replacement   |
| replaceRatio     | number         | 1                      | Portion of word to replace (0 to 1) |
| replaceDirection | "LTR" \| "RTL" | "RTL"                  | Direction of partial replacement    |
| matchTemplate    | string         | regexTemplate.fullWord | Word matching pattern               |
| ignoreSymbols    | boolean        | false                  | Disable symbol normalization        |

### Match Templates

```typescript
import { getSafeText, regexTemplate } from "fod4se";

const text = "cat category [cat]";
const profanity = ["cat"];

const templates = [
  //regexTemplate.fullWord matches "cat" but not "category":
  regexTemplate.fullWord,
  //regexTemplate.partialMatch matches both "cat" and "category"
  regexTemplate.partialMatch,
  //custom template to match only [cat]
  "\\[{0}\\]",
];

templates
  .map((matchTemplate) => getSafeText(text, profanity, { matchTemplate }))
  .forEach((result) => console.log(result));
/*
Outputs:
*** category [***] //full
*** ***egory [***] //partial
cat category ***** //custom
*/
```

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
