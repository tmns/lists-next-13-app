import Link from "next/link";

const Home = () => {
  return (
    <>
      <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
        Just Lists
      </h1>
      <p className="text-md text-white">Nothing more, nothing less.</p>
      <p className="text-md text-zinc-400 transition-colors duration-300 hover:text-white">
        <Link href="/signin">Get started</Link>
      </p>
    </>
  );
};

export default Home;
