import type { FC, ReactNode } from 'react';
import { useState } from 'react';
import { CroppingContext } from './contexts';
import type { BoxData } from './product';

interface CroppingProviderProps {
  children: ReactNode,
  boxData?: BoxData;
  setBoxData?: (data: BoxData) => void;
}

const CroppingProvider: FC<CroppingProviderProps> = ({ children, boxData, setBoxData }) => {
  const [selectedHotspot, setSelectedHotspot] = useState(-1);

  return (
    <CroppingContext.Provider value={{ selectedHotspot, setSelectedHotspot, boxData, setBoxData }}>
      {children}
    </CroppingContext.Provider>
  );
};

// eslint-disable-next-line import/prefer-default-export
export { CroppingProvider };
