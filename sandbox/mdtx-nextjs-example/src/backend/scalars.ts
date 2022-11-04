import { ZeusScalars } from '../zeus';

export const scalars = ZeusScalars({
  URI: {
    decode: (e: unknown) => e as string,
    encode: (e: unknown) => (e as URL).toString(),
  }
});
