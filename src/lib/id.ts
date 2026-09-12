import { customAlphabet } from "nanoid";

const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
const generate = customAlphabet(alphabet, 6);

/** URLキー用の短いユニークIDを生成 */
export function createRoomId(): string {
  return generate();
}

export function createEntityId(): string {
  return customAlphabet(alphabet, 10)();
}
