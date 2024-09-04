import dynamic from "next/dynamic";
import { type FC } from 'react';

const WalletButtons = dynamic(
  async () => {
    const { WalletButtons } = await import("@/components/WalletButtons");
    return { default: WalletButtons };
  },
  {
    loading: () => (
      <div className="nes-btn is-primary opacity-50 cursor-not-allowed">
        Loading...
      </div>
    ),
    ssr: false,
  }
);

export const Header: FC = () => {
  return (
    <>
      <header className="flex flex-wrap md:justify-start md:flex-nowrap z-50 w-full bg-gradient-to-r from-orange-300 via-orange-400 to-red-400 shadow-md py-7">
        <nav className="relative max-w-7xl w-full flex flex-wrap md:grid md:grid-cols-12 basis-full items-center px-4 md:px-6 md:px-8 mx-auto">
          <div className="md:col-span-3">

            <a className="flex-none rounded-xl text-xl inline-block font-semibold focus:outline-none focus:opacity-80" href="../templates/creative-agency/index.html" aria-label="Preline">
              zzz
            </a>

          </div>


          <div className="flex items-center gap-x-1 md:gap-x-2 ms-auto py-1 md:ps-6 md:order-3 md:col-span-3">
            <WalletButtons />
          </div>

          <div id="hs-navbar-hcail" className="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow md:block md:w-auto md:basis-auto md:order-2 md:col-span-6" aria-labelledby="hs-navbar-hcail-collapse"></div>

        </nav>
      </header>
    </>
  );
};
