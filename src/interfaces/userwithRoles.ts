export interface userwithRoles {
  idUser: number;
  account: string;
  nickname: string;
  avatarUrl: string;
  refreshToken: string;
  scope: Array<number>;
}

export default userwithRoles;
