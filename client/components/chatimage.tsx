import React, { useEffect, useState } from 'react';
import { decryptImage } from '../helper';
import { Loader } from 'tobui';
import { ChatImageStyle } from './chatimage.style';

type ChatImageProps = {
  url: string;
  decryptKey: string;
  doneLoading?: () => void;
};

export const ChatImage = ({ url, decryptKey, doneLoading }: ChatImageProps) => {
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState('');

  useEffect(() => {
    setTimeout(() => {
      getImage();
    }, 300);
  }, [url, decryptKey]);

  useEffect(() => {
    if (!loading) {
      doneLoading && doneLoading();
    }
  }, [loading]);

  const getImage = async () => {
    try {
      const result = await decryptImage(url, decryptKey);
      setImage(result);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  if (loading) {
    return <Loader size="small" />;
  }

  return <ChatImageStyle src={image} />;
};
