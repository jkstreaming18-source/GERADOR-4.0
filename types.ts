
export enum AppMode {
  CREATE = 'create',
  EDIT = 'edit'
}

export type CreateFunction = 'free' | 'sticker' | 'text' | 'comic';
export type EditFunction = 'add-remove' | 'retouch' | 'style' | 'compose';
export type AspectRatio = '1:1' | '4:3' | '3:4' | '16:9' | '9:16';

export interface AppState {
  mode: AppMode;
  activeFunction: CreateFunction | EditFunction;
  aspectRatio: AspectRatio;
  prompt: string;
  image1: string | null;
  image2: string | null;
  isGenerating: boolean;
  resultImage: string | null;
  showDualUpload: boolean;
}
