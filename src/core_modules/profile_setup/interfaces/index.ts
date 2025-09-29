export interface IProfileSubitem {
  id: string;
  title: string;
}

export interface IProfileTask {
  id: string;
  title: string;
  description: string;
  fullDescriptionHtml: string;
  recommendations: string; // HTML string
  subitems: IProfileSubitem[];
}

export interface IProfileCategory {
  id: string;
  title: string;
  tasks: IProfileTask[];
}
