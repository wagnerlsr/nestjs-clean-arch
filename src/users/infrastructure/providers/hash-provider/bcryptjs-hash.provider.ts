import { compare, hash } from 'bcryptjs';

import { HashProdider } from '@/shared/application/providers/hash-prodider';

export class BcryptjsHashProvider implements HashProdider {
  async compareHash(payload: string, hash: string): Promise<boolean> {
    return compare(payload, hash);
  }

  async generateHash(payload: string): Promise<string> {
    return hash(payload, 6);
  }
}
