import { ExcelData } from './excel';

export type ChangeType = 'ADIÇÃO' | 'EDIÇÃO' | 'REMOÇÃO' | 'IMPORTAÇÃO';

export interface HistoryEntry {
  id: string;
  timestamp: string;
  type: ChangeType;
  description: string;
  details: {
    before?: ExcelData | ExcelData[] | undefined;
    after?: ExcelData | ExcelData[] | string | undefined;
    field?: string;
    rowIndex?: number;
  };
  user?: string;
} 