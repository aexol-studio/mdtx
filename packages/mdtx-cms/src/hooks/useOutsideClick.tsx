import { useEffect } from 'react';

export const useOutsideClick = (
  ref: React.RefObject<HTMLDivElement>,
  state: () => void,
) => {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        state();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [ref]);
};
