import React, { createContext, useContext, useState } from 'react';

export interface FormNodeState {
  selectedForm?: any;
  nodeData?: any;
  setSelectedForm: (form: any) => void;
  setNodeData: (data: any) => void;
}

const FormNodeContext = createContext<FormNodeState | undefined>(undefined);

export const useFormNode = () => {
  const ctx = useContext(FormNodeContext);
  if (!ctx) throw new Error('useFormNode debe usarse dentro de FormNodeProvider');
  return ctx;
};

export const FormNodeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [selectedForm, setSelectedForm] = useState<any>();
  const [nodeData, setNodeData] = useState<any>();

  return (
    <FormNodeContext.Provider value={{ selectedForm, setSelectedForm, nodeData, setNodeData }}>
      {children}
    </FormNodeContext.Provider>
  );
}; 