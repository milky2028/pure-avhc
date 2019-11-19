import { Site } from './Site';

export default interface TestResult {
  title: string;
  url: string;
  date: Date;
  id: string;
  site: Site[];
}
