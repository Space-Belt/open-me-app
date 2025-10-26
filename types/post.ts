export interface IPost {
  id?: string; // Firestore 문서ID
  userId: string; // 작성자 uid
  title: string;
  content: string;
  imageUrls: string[]; // 이미지 최대 3장
  createdAt: Date;
}

export interface IComment {
  id?: string;
  postId: string;
  userId: string;
  content: string;
  parentId?: string; // 대댓글이면 부모 댓글ID, 아니면 undefined 또는 null
  createdAt: Date;
}
