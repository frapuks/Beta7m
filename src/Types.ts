export type Player = {
  id?: number;
  first_name: string;
  last_name: string;
  is_goalkeeper: boolean;
  matchList?: Match[];
  shooterList?: Shoot[];
  goalkeeperList?: Shoot[];
};

export type Match = {
  id?: number;
  players_victory: boolean;
  goalkeepers?: Player[];
  shooters?: Player[];
};

export type Shoot = {
  id?: number;
  is_Goal: boolean;
  shooter_id: number;
  goalkeeper_id: number;
  match_id?: number;
  created_at?: string;
  goalkeeper?: Player;
  shooter?: Player;
};

export type User = {
  id?: number;
  username: string;
  email: string;
  password?: string;
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
};
