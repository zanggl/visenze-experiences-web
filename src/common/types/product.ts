import type { CroppedBox } from './box';

export interface ProcessedProduct extends Record<string, any> {
  im_url: string;
  product_id: string;
}

export interface BoxData {
  box: CroppedBox;
  index: number;
}
