import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Auth } from "../components/Auth";
import { useSupabase } from "../hooks/useSupabase";

const Home: NextPage = () => {
  const { session, supabase } = useSupabase();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!session);
    console.log(session);
  }, [session]);

  return (
    <div>
      <Head>
        <title>Supabase Chat App</title>
        <meta name="description" content="A Supabase chat app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-screen min-h-screen flex flex-col justify-center items-center">
        {!loggedIn && <Auth />}
        {loggedIn && <h1>App</h1>}
      </main>
    </div>
  );
};

export default Home;
