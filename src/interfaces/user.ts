export interface user {
  idUser: number;
  account: string;
  nickname: string;
  // token: string;
  avatarUrl: string;
  refreshToken: string;
  scope: Set<string>;
}
export default user;
