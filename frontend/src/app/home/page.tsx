import { Body } from './Body';
import { Header } from './Header';

export default function Home() {
  return (
    <main className='flex flex-col'>
      <Header />
      <Body />
    </main>
  );
}
