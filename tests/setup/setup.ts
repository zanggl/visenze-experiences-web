import { TextDecoder, TextEncoder } from 'util';
import '../../src/global.d.ts';

Object.assign(global, { TextDecoder, TextEncoder });
