import { useState } from 'react';

export const useClipboard = () => {
  const [text, setText] = useState('');

  return {
    text,
    setText,
  };
};
