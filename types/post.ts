import { Timestamp } from "firebase/firestore";

export interface IPostData {
  title: string;
  content: string;
  images: string[]; // storage에 업로드한 url 배열
  uid: string;
  displayName: string;
  photoURL?: string;
}

export interface IPostedData {
  id: string;
  displayName: string;
  imageUrls?: string[];
  uid: string;
  title: string;
  content: string;
  photoURL: string;
  likeCount: number;
  commentCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface IGetPostedData {
  displayName: string;
  imageUrls?: string[];
  uid: string;
  title: string;
  content: string;
  photoURL: string;
  likeCount: number;
  commentCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
