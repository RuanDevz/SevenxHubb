export interface Video {
  file_code: string;
  title: string;
  length: string;
  splash_img: string;
  single_img: string;
  created?: string;
  uploaded?: string;
  size?: string;
  views: string | number;
  canplay?: number;
  download_url?: string;
  fld_id?: string;
  public?: string;
}

export interface DoodStreamResponse {
  result: number;
  msg: string;
  total_count: number;
  data: Video[];
}

export interface ApiResponse {
  status: number;
  msg: string;
  total_count: number;
  result: any;
  server_time?: string;
}

export interface VideoFile {
  file_code: string;
  title: string;
  length: string;
  splash_img: string;
  single_img: string;
  uploaded: string;
  views: string | number;
  canplay: number;
  download_url: string;
  fld_id: string;
  public: string;
  [key: string]: any;
}