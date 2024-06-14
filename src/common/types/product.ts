import type { CroppedBox } from './box';

export interface ProcessedProduct extends Record<string, any> {
  im_url: string;
  product_id: string;
}

export interface BoxData {
  box: CroppedBox;
  index?: number;
  wasFromCrop?: boolean;
}

// export interface ProductMetadata {
//   pos: number;
//   pid: string;
//   currency_unit: any;
//   category: string;
//   stock_quantity: string;
//   product_name: string;
//   brand: string;
//   currency_code: string;
// }
