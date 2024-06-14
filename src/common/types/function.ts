import type { ProductSearchResponse } from 'visearch-javascript-sdk';

export type SuccessHandler = (res: ProductSearchResponse) => void;
export type ErrorHandler = (err: any) => void;
