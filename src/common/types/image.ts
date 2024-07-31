export type SearchImage = ImageUrl | ImageFile;

export interface ImageUrl {
  imgUrl: string;
}

export interface ImageFile {
  files: File[];
  // actually it's DataURL
  file: string;
}

export const isImageUrl = (image: SearchImage): image is ImageUrl => {
  return (image as ImageUrl).imgUrl !== undefined;
};

export const isImageFile = (image: SearchImage): image is ImageFile => {
  return (image as ImageFile).files !== undefined || (image as ImageFile).file !== undefined;
};