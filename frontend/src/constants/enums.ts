export enum Conference {
  Eastern = 'Eastern',
  Western = 'Western'
}

export interface NBATeamInfo {
  name: string;
  city: string;
  conference: Conference;
}

export const NBA_TEAMS: NBATeamInfo[] = [
  { name: 'Hawks', city: 'Atlanta', conference: Conference.Eastern },
  { name: 'Celtics', city: 'Boston', conference: Conference.Eastern },
  { name: 'Nets', city: 'Brooklyn', conference: Conference.Eastern },
  { name: 'Hornets', city: 'Charlotte', conference: Conference.Eastern },
  { name: 'Bulls', city: 'Chicago', conference: Conference.Eastern },
  { name: 'Cavaliers', city: 'Cleveland', conference: Conference.Eastern },
  { name: 'Mavericks', city: 'Dallas', conference: Conference.Western },
  { name: 'Nuggets', city: 'Denver', conference: Conference.Western },
  { name: 'Pistons', city: 'Detroit', conference: Conference.Eastern },
  { name: 'Warriors', city: 'Golden State', conference: Conference.Western },
  { name: 'Rockets', city: 'Houston', conference: Conference.Western },
  { name: 'Pacers', city: 'Indiana', conference: Conference.Eastern },
  { name: 'Clippers', city: 'Los Angeles', conference: Conference.Western },
  { name: 'Lakers', city: 'Los Angeles', conference: Conference.Western },
  { name: 'Grizzlies', city: 'Memphis', conference: Conference.Western },
  { name: 'Heat', city: 'Miami', conference: Conference.Eastern },
  { name: 'Bucks', city: 'Milwaukee', conference: Conference.Eastern },
  { name: 'Timberwolves', city: 'Minnesota', conference: Conference.Western },
  { name: 'Pelicans', city: 'New Orleans', conference: Conference.Western },
  { name: 'Knicks', city: 'New York', conference: Conference.Eastern },
  { name: 'Thunder', city: 'Oklahoma City', conference: Conference.Western },
  { name: 'Magic', city: 'Orlando', conference: Conference.Eastern },
  { name: '76ers', city: 'Philadelphia', conference: Conference.Eastern },
  { name: 'Suns', city: 'Phoenix', conference: Conference.Western },
  { name: 'Trail Blazers', city: 'Portland', conference: Conference.Western },
  { name: 'Kings', city: 'Sacramento', conference: Conference.Western },
  { name: 'Spurs', city: 'San Antonio', conference: Conference.Western },
  { name: 'Raptors', city: 'Toronto', conference: Conference.Eastern },
  { name: 'Jazz', city: 'Utah', conference: Conference.Western },
  { name: 'Wizards', city: 'Washington', conference: Conference.Eastern }
];

export const NBA_CITIES = Array.from(new Set(NBA_TEAMS.map(team => team.city)));
export const NBA_TEAM_NAMES = NBA_TEAMS.map(team => team.name);

export const CONFERENCE_MAPPING: { [key: string]: Conference } = NBA_TEAMS.reduce((acc, team) => ({
  ...acc,
  [team.city]: team.conference
}), {});

export const VALID_TEAM_NAMES_FOR_CITY: { [key: string]: string[] } = NBA_TEAMS.reduce((acc, team) => ({
  ...acc,
  [team.city]: [...(acc[team.city] || []), team.name]
}), {} as { [key: string]: string[] }); 