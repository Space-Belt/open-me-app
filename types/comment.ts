import { Timestamp } from "firebase/firestore";

export interface ICreateCommentInput {
  postId: string;
  content: string;
  authorUid: string;
  authorNickname: string;
  authorPhotoURL: string | null;
  parentId?: string; // 대댓글이면 부모 commentId, 아니면 undefined
}

export interface IGetCommentData {
  id: string;
  postId?: string; // 필요시 게시글 ID 포함 가능
  createdAt: Timestamp;
  updatedAt: Timestamp;
  authorPhotoURL: string;
  content: string;
  likeCount: number;
  isDeleted: boolean;
  authorNickname: string;
  authorUid: string;
  parentId: string | null; // 부모 댓글 ID, null이면 댓글
}
