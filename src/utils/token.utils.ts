import { encode } from 'gpt-3-encoder';

export function countTokens(text: string): number {
  return encode(text).length;
}
