export interface QRCodeOptions {
  value: string;
  size: number;
  level: 'L' | 'M' | 'Q' | 'H';
  bgColor: string;
  fgColor: string;
  includeMargin: boolean;
  imageSettings?: {
    src: string;
    x?: number;
    y?: number;
    height?: number;
    width?: number;
    excavate?: boolean;
  };
  style?: React.CSSProperties;
  dots?: DotsOptions;
  cornersSquareOptions?: CornersSquareOptions;
  cornersDotOptions?: CornersDotOptions;
}

export interface DotsOptions {
  type?: 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'square' | 'extra-rounded';
  color?: string;
}

export interface CornersSquareOptions {
  type?: 'default' | 'dot' | 'square' | 'extra-rounded';
  color?: string;
}

export interface CornersDotOptions {
  type?: 'default' | 'dot' | 'square';
  color?: string;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface QRCode {
  id: string;
  user_id: string;
  title: string;
  value: string;
  options: QRCodeOptions;
  scan_count: number;
  created_at: string;
  updated_at: string;
}