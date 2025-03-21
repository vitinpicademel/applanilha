'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DataContextType {
  excelData: any[];
  setExcelData: (data: any[]) => void;
  selectedRow: any;
  setSelectedRow: (row: any) => void;
  editModalOpen: boolean;
  setEditModalOpen: (open: boolean) => void;
  clearAllData: () => void;
  history: any[];
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
  setHistory: (history: any[]) => void;
  addNewRow: (row: any) => void;
  addDataFromXLSX: (data: any[]) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [excelData, setExcelData] = useState<any[]>([]);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const clearAllData = () => {
    setExcelData([]);
    setSelectedRow(null);
    setEditModalOpen(false);
    setHistory([]);
    setShowHistory(false);
  };

  const addNewRow = (row: any) => {
    setExcelData(prev => [...prev, row]);
    setHistory(prev => [...prev, { type: 'add', data: row, timestamp: new Date() }]);
  };

  const addDataFromXLSX = (data: any[]) => {
    setExcelData(prev => [...prev, ...data]);
    setHistory(prev => [...prev, { type: 'import', data: data, timestamp: new Date() }]);
  };

  return (
    <DataContext.Provider value={{ 
      excelData, 
      setExcelData,
      selectedRow,
      setSelectedRow,
      editModalOpen,
      setEditModalOpen,
      clearAllData,
      history,
      showHistory,
      setShowHistory,
      setHistory,
      addNewRow,
      addDataFromXLSX
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
} 