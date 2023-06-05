import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Board from "../components/Board";
import { trpc } from "../utils/trpc";
import useMediaQuery from "../hooks/useMediaQuery";

const Home: NextPage = () => {
  const { data: levelData, refetch: refetchLevelData } = trpc.useQuery(
    ["level.fetchById", "cli8wtzzr00231cj3vlai6ob7"],
    { staleTime: Infinity }
  );

  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <>
      <Head>
        <title>Nanogram / Picross</title>
        <meta name="description" content="A Nanogram Game" />
      </Head>

      <div className="h-full min-h-fit flex flex-col items-center justify-evenly py-4">
        <h2 className="text-3xl lg:text-4xl mt-12 mb-8 text-center">
          A simple Nanogram (picross) game
        </h2>
        <div className="my-4">
          <Board levelData={levelData || null} cellSize={isMobile ? 0 : 2} />
        </div>
        <div className="text-2xl text-center my-4">
          By{" "}
          <Link href="https://www.google.com">
            <a className="text-blue-600">Tigger Chan</a>
          </Link>
          <br />
          <br />
          Built with Typescript, tRPC, Tailwindcss,
          <br />
          the{" "}
          <Link href="https://github.com/t3-oss/create-t3-app">
            <a className="text-blue-600">T3</a>
          </Link>{" "}
          stack
          <br />
          <br />
          Deployed on{" "}
          <Link href="https://vercel.com/">
            <a className="text-blue-600">Vercel</a>
          </Link>{" "}
          serverlessly.
        </div>
      </div>
    </>
  );
};

export default Home;
