"use client";

import React, { useState } from "react";

// import { useTypingEffect } from "@/lib/useTypingEffect";
import { NesButton } from "@/components/ui/nes-button";
// import { Pet } from "./Pet";
// import { PetImage, bodies, ears, faces } from "./Pet/Image";
// import { ShuffleButton } from "@/components/ShuffleButton";
// import {
//   NEXT_PUBLIC_BODY_OPTIONS,
//   NEXT_PUBLIC_EAR_OPTIONS,
//   NEXT_PUBLIC_FACE_OPTIONS,
// } from "@/lib/env";

// const defaultPet: Pet = {
//   name: "Unknown",
//   energy_points: 0,
//   parts: [],
// };

export function NotConnected() {
  // const [activePet, setActivePet] = useState<number[]>([0, 0, 0]);
  // const [selectedAction, setSelectedAction] = useState<"feed" | "play">("feed");

  // const text = useTypingEffect(
  //   `Welcome to Aptos Boilerplate COde! Make sure you have a wallet extension installed. Once you connect your wallet, you'll be able to interact with your custom contract.`
  // );

  // const handleShuffle = () => {
  //   const randomPet = [
  //     Math.floor(Math.random() * Number(NEXT_PUBLIC_BODY_OPTIONS)),
  //     Math.floor(Math.random() * Number(NEXT_PUBLIC_EAR_OPTIONS)),
  //     Math.floor(Math.random() * Number(NEXT_PUBLIC_FACE_OPTIONS)),
  //   ];
  //   setActivePet(randomPet);

  //   const actions = ["feed", "play"];
  //   const randomAction = actions[Math.floor(Math.random() * actions.length)] as
  //     | "feed"
  //     | "play";
  //   setSelectedAction(randomAction);
  // };

  return (
    <>
      <div className="flex flex-col gap-6 p-6">
        {/* <div className="flex flex-col gap-6 self-center">
        <PetImage
          pet={defaultPet}
          selectedAction={selectedAction}
          petParts={{
            body: bodies[activePet[0]],
            ears: ears[activePet[1]],
            face: faces[activePet[2]],
          }}
        />
        <ShuffleButton handleShuffle={handleShuffle} />
      </div> */}
        {/* <div className="nes-container is-dark with-title">
        <p className="title">Welcome</p>
        <p>{text}</p>
      </div>
      <Button>Click me</Button>
       */}

      </div>
      <FormSignIn />
    </>
  );
}

function FormSignIn() {
  const [data, setData] = useState<{
    type: "heads" | "tails"; // Ensure type is restricted to "heads" or "tails"
    sol: number;
  }>({
    type: "heads", // Default value
    sol: 0.05,
  });


  const handleTypeClick = (type: "heads" | "tails") => {
    setData({
      ...data,
      type,
    });
  };

  const handleSolClick = (sol: number) => {
    setData({
      ...data,
      sol,
    });
  };

  return (
    <div className="form-signin max-w-[420px] w-full m-auto text-center">
      {/* <img
        className="mb-3 logo h-[200px] w-[200px]"
        src="https://i.imgur.com/FjUZXhp.png"
        alt="coin"
        width="128"
        height="128"
      /> */}
      {/* <InsuranceButton /> */}
      <LikeForSection handleTypeClick={handleTypeClick} type={data.type} className="sm:mt-6 my-2" />
      <SolOptions handleSolClick={handleSolClick} sol={data.sol} className="sm:mt-6 my-2" />
      {/* <Warnings /> */}
      {/* <ActionLinks /> */}
      <NesButton type="button" colors="warning" className="sm:mt-6 my-2">Double or nothing</NesButton>
    </div>
  );
}

// function Warnings() {
//   return (
//     <>
//       <p className="text-danger p-1 mb-1">
//         123
//       </p>
//       <img
//         className="cursor-pointer double-or-nothing-button mb-1"
//         src="https://i.imgur.com/gMlDK1J.png"
//         alt="double or nothing"
//         width="100%"
//         height="100%"
//       />
//     </>
//   );
// }

// function ActionLinks() {
//   return (
//     <>
//       <h6 className="mt-3 text-secondary">
//         <a href="#!" className="no-decoration">PRIORITY: MARKET</a>
//       </h6>
//       <h6 className="text-secondary">
//         <a href="#!" className="no-decoration">WHALE MODE</a>&nbsp;·
//         <a className="ms-sm-2 ms-1 no-decoration" href="/try">TRY FREE</a>
//       </h6>
//     </>
//   );
// }

function SolOptions({ handleSolClick, sol, className, ...props }: { handleSolClick: (sol: number) => void; sol: number; className?: string }) {
  return (
    <div className={className} {...props}>
      <h3 className="mb-2">FOR</h3>
      <div className="row mb-1 grid grid-cols-3 gap-4">
        <Button selected={sol === 0.05} onClick={() => handleSolClick(0.05)}>0.05 APT</Button>
        <Button selected={sol === 0.1} onClick={() => handleSolClick(0.1)}>0.1 APT</Button>
        <Button selected={sol === 0.25} onClick={() => handleSolClick(0.25)}>0.25 APT</Button>
      </div>
    </div>
  );
}

// function InsuranceButton() {
//   return (
//     <div className="justify-center flex">
//       <a href="#" className="no-decoration btn btn-sm btn-outline-dark">
//         <span className="fa-stack fa-2xs me-1">
//           <i className="fa-solid fa-circle fa-stack-2x" aria-hidden="true"></i>
//           <i
//             className="fas fa-shield-alt fa-stack-1x fa-inverse fa-inverse-light"
//             aria-hidden="true"
//           ></i>
//         </span>
//         <u>ADD INSURANCE</u>
//       </a>
//     </div>
//   );
// }

function Button({ children, selected, onClick }: { children: React.ReactNode, selected: boolean, onClick: () => void }) {
  return (
    <NesButton type="button" variant={selected ? undefined : "outline"} colors="warning" onClick={onClick}>
      {children}
    </NesButton>
  );
}

function LikeForSection({ handleTypeClick, type, className, ...props }: { handleTypeClick: (type: "heads" | "tails") => void; type: "heads" | "tails"; className?: string }) {
  return (
    <div className={className} {...props}>
      <h3 className="mb-2">I LIKE</h3>
      <div className="row mb-1 grid grid-cols-2 gap-4">
        <Button selected={type === "heads"} onClick={() => handleTypeClick("heads")}>Heads</Button>
        <Button selected={type === "tails"} onClick={() => handleTypeClick("tails")}>Tails</Button>
      </div>
    </div>
  );
}
