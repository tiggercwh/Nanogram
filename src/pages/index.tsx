import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Board from "../components/Board";
import { trpc } from "../utils/trpc";
import { DEFAULT_PUZZLE_ID } from "../utils/env";
import useMediaQuery from "../hooks/useMediaQuery";

const Home: NextPage = () => {
  const { data: levelData, refetch: refetchLevelData } = trpc.useQuery(
    ["level.fetchById", DEFAULT_PUZZLE_ID],
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
        <h2 className="text-3xl lg:text-4xl my-8 text-center">
          Are you good enough to solve this?
        </h2>
        <div className="my-4">
          {levelData?.data && (
            <Board levelData={levelData} isMobile={isMobile} />
          )}
        </div>
        <div className="text-lg text-center my-4">
          This app uses the{" "}
          <Link href="https://create.t3.gg/">
            <a className="text-blue-600">T3</a>
          </Link>{" "}
          stack
        </div>
      </div>
    </>
  );
};

export default Home;
