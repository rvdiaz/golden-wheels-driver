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

// Country data with phone codes and formats
export interface CountryData {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
  format?: string; // e.g., "(XXX) XXX-XXXX" for US
  maxLength?: number;
}
