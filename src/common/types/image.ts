export type SearchImage = ImageUrl | ImageFile;

export interface ImageUrl {
  imgUrl: string;
}

export interface ImageFile {
  files: File[];
  // actually it's DataURL
  file: string;
}
