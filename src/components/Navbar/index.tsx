import Link from "next/link";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const Navbar = () => {
  const {
    data: randomLevel,
    refetch: refetchRandomLevel,
    isLoading: randomLevelLoading,
  } = trpc.useQuery(["level.fetchRandom"]);
  const router = useRouter();

  const [navOpen, setNavOpen] = useState(false);

  return (
    <>
      <button
        className={`absolute top-2 left-2 w-12 h-12 rounded-md bg-yellow-300 z-10 text-2xl lg:hidden`}
        onClick={() => setNavOpen(true)}
      >
        ≡
      </button>
      <div
        className={`fixed top-0 left-0 w-full h-full bg-black/20 z-20 ${
          navOpen ? "block lg:hidden" : "hidden"
        }`}
        onClick={() => setNavOpen(false)}
      />
      <nav
        className={`
            ${navOpen ? "" : "-translate-x-full lg:translate-x-0"} 
            bg-yellow-100
            flex flex-col items-center z-30 w-fit
            absolute transition-transform duration-800
            lg:bg-yellow-300 lg:flex-row lg:justify-around lg:w-full h-full lg:h-auto lg:relative 
            `}
      >
        <Link href="/">
          <a className="text-5xl bg-yellow-300 w-full text-center lg:text-left px-16 lg:px-12 py-4">
            Nanogram
          </a>
        </Link>
        <ul className="flex flex-col items-center gap-24 lg:flex-row text-3xl px-12 lg:px-4 text-center lg:text-left">
          <li className="py-4">
            <Link href="/">
              <a onClick={() => setNavOpen(false)}>Home</a>
            </Link>
          </li>
          <li className="py-4">
            <Link href="/editor">
              <a onClick={() => setNavOpen(false)}>Create</a>
            </Link>
          </li>
          <li className="py-4">
            <Link href="/browse">
              <a onClick={() => setNavOpen(false)}>Search</a>
            </Link>
          </li>
          <li className="py-4">
            <button
              disabled={!randomLevel || randomLevelLoading}
              onClick={async () => {
                setNavOpen(false);
                await refetchRandomLevel();
                router.push(`../puzzle/${randomLevel!.id}`);
              }}
              className="disabled:opacity-20"
            >
              Random Game
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
