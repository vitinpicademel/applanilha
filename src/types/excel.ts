export interface ExcelData {
  ITEM: string;
  DATA: string;
  CLIENTE: string;
  CPF: string;
  'CORRETOR(A)': string;
  'PARCERIA CORRETORES': string;
  'PARCERIA GESTORES': string;
  'ORIGEM DO LEAD': string;
  INCORPORADORA: string;
  'TIPO DO IMÓVEL': string;
  'INFORMAÇÃO DO IMÓVEL': string;
  'VGV R$': number | string;
  'FORMA DE PAGAMENTO': string;
  APROVAÇÃO: string;
  OBS: string;
  SITUAÇÃO: string;
  '% COMISSÃO PREVISTA': number | string;
  'VGC PREVISTA': number | string;
  'VGC REAL': number | string;
  'CAPTADOR?': string;
  'NOME DO CAPTADOR': string;
  '% COMISSÃO REAL': number | string;
  '% COMISSÃO GESTOR': number | string;
  [key: string]: string | number; // Permite indexação por string
}

export type ExcelDataKey = keyof ExcelData; 