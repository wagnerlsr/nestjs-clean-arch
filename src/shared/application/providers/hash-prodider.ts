export interface HashProdider {
  generateHash(payload: string): Promise<string>;
  compareHash(payload: string, hash: string): Promise<boolean>;
}
