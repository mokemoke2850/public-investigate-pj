export interface Position {
  x: number;
  y: number;
}

export interface AddingText {
  id: number;
  text: string;
  x: number;
  y: number;
  scaleX?: number;
  scaleY?: number;
}

export interface SelectedIdState {
  type: 'text' | 'image' | 'none';
  id: number;
}

export interface AddingImage {
  id: number;
  image: string;
  x: number;
  y: number;
}
