// https://github.com/sushiswap/sushiswap/blob/c51fbfc7f5c169aef04e7b6aef2ab4efb596be75/apps/web/src/lib/wagmi/components/user-profile/index.tsx
import React from 'react';

import { UserProfileButton } from './UserProfileButton';
import { UserProfileWrapper } from './UserProfileWrapper';

export function UserProfile(): JSX.Element {
  return (
    <UserProfileWrapper>
      <UserProfileButton />
    </UserProfileWrapper>
  );
}
