export interface Match {
  id:           number;
  team_home:    string;
  team_away:    string;
  goals_home:   number;
  goals_away:   number;
  match_status: 'Pendiente' | 'En Curso' | 'Finalizado';
  match_date:   string;
  updated_at?:  string;
  result?:      string | null;
}

export interface ApiResponse<T> {
  success:  boolean;
  count?:   number;
  message?: string;
  data:     T;
}
