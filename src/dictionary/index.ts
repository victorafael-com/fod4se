import en from "./en.json";
import ptBr from "./pt-br.json";

type Dictionary = { [key: string]: { profanity: string[]; ignore: string[] } };

const dictionary = { en, "pt-br": ptBr };
export default dictionary;
