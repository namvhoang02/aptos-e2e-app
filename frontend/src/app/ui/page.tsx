import { ChevronRight } from "lucide-react";

import { NesButton } from "@/components/ui/nes-button"

export default function Page() {
  return (
    <main className="flex flex-col p-4">
      <div>
        <h1>UI</h1>
        <br />
        <br />
        <div className="grid grid-cols-4 gap-4">
          <NesButton>Button</NesButton>
          <NesButton variant="secondary">Secondary</NesButton>
          <NesButton variant="outline">Outline</NesButton>
          <NesButton variant="ghost">Ghost</NesButton>
          <NesButton variant="link">Link</NesButton>
        </div>
        <br />
        <br />

        <div className="grid grid-cols-4 gap-4">
          <NesButton type="button">Normal</NesButton>
          <NesButton type="button" colors="primary">Primary</NesButton>
          <NesButton type="button" colors="success">Success</NesButton>
          <NesButton type="button" colors="warning">Warning</NesButton>
          <NesButton type="button" colors="error">Error</NesButton>
          <NesButton type="button" disabled>Disabled</NesButton>
        </div>

        <br />
        <br />

        <div className="grid grid-cols-4 gap-4">
          <NesButton type="button" size="sm">Small</NesButton>
          <NesButton type="button" size="lg">Large</NesButton>
          <NesButton type="button" size="icon">
            <ChevronRight className="h-4 w-4" />
          </NesButton>
        </div>
        <br />
        <br />

        <div className="grid grid-cols-4 gap-4">
          <button type="button" className="nes-btn is-primary">Primary</button>
          <button type="button" className="nes-btn is-success">Success</button>
          <button type="button" className="nes-btn is-warning">Warning</button>
          <button type="button" className="nes-btn is-error">Error</button>
          <button type="button" className="nes-btn is-disabled">Disabled</button>
        </div>

        <br />
        <br />

        <div className="grid grid-cols-4 gap-4">
          <label className="nes-btn">
            <span>Select your file</span>
            <input type="file" />
          </label>
        </div>

        <br />
        <br />

        <div className="grid grid-cols-4 gap-4">
          <NesButton type="button" variant="outline">Heads</NesButton>
          <NesButton type="button" variant="outline" colors="primary">Heads</NesButton>
          <NesButton type="button" variant="outline" colors="warning">Heads</NesButton>
          <NesButton type="button" variant="outline" colors="success">Tails</NesButton>
          <NesButton type="button" variant="outline" colors="error">1 APT</NesButton>
        </div>

        <br />
        <br />

        {/* <ShuffleButton handleShuffle={() => { }} /> */}
      </div>
    </main>
  );
}
