export interface IImageCatalogItem {
  image: IImage;
  principal?: boolean;
  uploading?: boolean;
}

export interface IImage {
  url: string;
  alt: string;
  s3Key?: string;
}
