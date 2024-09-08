// https://github.com/sushiswap/sushiswap/blob/1721e93e061c3e81535058b84d8460c73e9f37b7/packages/ui/src/components/link.tsx#L8
'use client';

import Link from 'next/link';
import { AnchorHTMLAttributes, FC } from 'react';

const LinkInternal = Link;
const LinkExternal: FC<AnchorHTMLAttributes<HTMLAnchorElement>> = ({
  target = '_blank',
  rel = 'noopener noreferrer',
  ...props
}) => {
  return (
    <a
      {...props}
      target={target}
      rel={rel}
      className='cursor-pointer text-blue hover:underline'
    />
  );
};

export { LinkExternal, LinkInternal };
