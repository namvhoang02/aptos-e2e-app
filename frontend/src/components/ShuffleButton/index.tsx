import { PiShuffleAngularFill } from 'react-icons/pi';

// export interface ShuffleButtonProps {}

export function ShuffleButton() {
  return (
    <button
      type='button'
      className='nes-btn flex flex-row justify-center items-center'
    >
      <h2>Shuffle</h2>
      <PiShuffleAngularFill className='h-8 w-12 drop-shadow-sm' />
    </button>
  );
}
