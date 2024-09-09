'use client';

import dynamic from 'next/dynamic';
import React, { type FC } from 'react';
import { jsNumberForAddress } from 'react-jazzicon';

interface JazzIconProps {
  diameter: number;
  address: string;
  paperStyles?: React.CSSProperties;
  seed?: number;
  svgStyles?: React.CSSProperties;
}

const Jazzicon = dynamic(() => import('react-jazzicon'));

export const JazzIcon: FC<JazzIconProps> = ({
  diameter,
  address,
  ...props
}) => {
  return (
    <Jazzicon
      diameter={diameter}
      seed={jsNumberForAddress(address)}
      {...props}
    />
  );
};
