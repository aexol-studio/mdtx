import React from 'react';

interface SelectInterface {
  selectedValue: string;
  setSelectedValue: React.Dispatch<React.SetStateAction<string>>;
}

export const Select: React.FC = () => {
  return <div>Select</div>;
};
