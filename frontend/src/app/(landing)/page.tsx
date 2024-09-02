import { Header } from "./Header";
import { Body } from "./Body";

export default function Home() {
  return (
    <main className="flex flex-col">
      <Header />
      <Body />
    </main>
  );
}
