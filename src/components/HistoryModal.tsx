import React from 'react';
import { HistoryEntry, ChangeType } from '@/types/history';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryEntry[];
}

const getChangeTypeColor = (type: ChangeType): string => {
  return '#938667';
};

const getChangeTypeIcon = (type: ChangeType): React.ReactElement => {
  switch (type) {
    case 'ADIÇÃO':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      );
    case 'EDIÇÃO':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      );
    case 'REMOÇÃO':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      );
    case 'IMPORTAÇÃO':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      );
    default:
      return <></>;
  }
};

export default function HistoryModal({ isOpen, onClose, history }: HistoryModalProps) {
  if (!isOpen) return null;

  // Agrupa o histórico por data
  const groupedHistory = history.reduce((groups, entry) => {
    const date = entry.timestamp.split('T')[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(entry);
    return groups;
  }, {} as Record<string, HistoryEntry[]>);

  return (
    <div className="fixed inset-0 bg-[#373737]/75 flex items-center justify-center z-50 p-4">
      <div className="bg-[#373737] rounded-lg p-4 md:p-6 w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4 md:mb-6 px-2">
          <h2 className="text-lg md:text-xl font-semibold text-white">Histórico de Alterações</h2>
          <button
            onClick={onClose}
            className="text-[#938667] hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-2">
          {Object.entries(groupedHistory)
            .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
            .map(([date, entries]) => (
              <div key={date} className="mb-4 md:mb-6">
                <h3 className="text-[#938667] font-medium mb-2 md:mb-3 text-sm md:text-base">
                  {format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </h3>
                <div className="space-y-3 md:space-y-4">
                  {entries
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .map((entry) => (
                      <div
                        key={entry.id}
                        className="bg-[#2A2A2A] rounded-lg p-3 md:p-4 border border-[#938667]/20"
                      >
                        <div className="flex items-start gap-3 md:gap-4">
                          <div className={`flex-shrink-0 ${getChangeTypeColor(entry.type)} p-2 rounded-lg text-white`}>
                            {getChangeTypeIcon(entry.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <span className="text-white font-medium text-sm md:text-base">
                                {entry.type}
                              </span>
                              <span className="text-xs md:text-sm text-[#938667]">
                                {format(new Date(entry.timestamp), 'HH:mm')}
                              </span>
                            </div>
                            <p className="text-[#938667] mt-1 text-sm md:text-base break-words">{entry.description}</p>
                            {entry.details.field && (
                              <div className="mt-2 text-xs md:text-sm">
                                <span className="text-[#938667]">Campo alterado: </span>
                                <span className="text-white break-words">{entry.details.field}</span>
                              </div>
                            )}
                            {(entry.details.before || entry.details.after) && (
                              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 text-xs md:text-sm">
                                {entry.details.before && (
                                  <div className="bg-[#373737] p-2 rounded">
                                    <span className="text-[#938667]">Antes: </span>
                                    <span className="text-white break-words overflow-hidden">
                                      {typeof entry.details.before === 'object' 
                                        ? JSON.stringify(entry.details.before, null, 2)
                                        : String(entry.details.before)}
                                    </span>
                                  </div>
                                )}
                                {entry.details.after && (
                                  <div className="bg-[#373737] p-2 rounded">
                                    <span className="text-[#938667]">Depois: </span>
                                    <span className="text-white break-words overflow-hidden">
                                      {typeof entry.details.after === 'object' 
                                        ? JSON.stringify(entry.details.after, null, 2)
                                        : String(entry.details.after)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
} 