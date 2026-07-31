export type Chapter = {
  path: string;
  number: string;
  label: string;
  kicker: string;
};

export const CHAPTERS: Chapter[] = [
  { path: '/', number: '00', label: 'Arrival', kicker: 'The assumption' },
  { path: '/expectation', number: '01', label: 'Expectation', kicker: 'What changed' },
  { path: '/trajectory', number: '02', label: 'Trajectory', kicker: 'Where I am going' },
  { path: '/ship', number: '03', label: 'Ship', kicker: 'UniMarket' },
  { path: '/lessons', number: '04', label: 'Re-learning', kicker: 'What building requires' },
  { path: '/traits', number: '05', label: 'The player', kicker: 'What pressure reveals' },
  { path: '/ideas', number: '06', label: '25 / 75', kicker: 'Ideas and execution' },
  { path: '/people', number: '07', label: 'Signals', kicker: 'Rob and Roger' },
  { path: '/continue', number: '∞', label: 'Continue', kicker: 'Not the end' },
];

export function chapterIndex(pathname: string): number {
  const index = CHAPTERS.findIndex((chapter) => chapter.path === pathname);
  return index < 0 ? 0 : index;
}
