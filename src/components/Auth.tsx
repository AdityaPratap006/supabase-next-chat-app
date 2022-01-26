import { useSupabase } from "../hooks/useSupabase";

export const Auth = () => {
  const { supabase } = useSupabase();

  const signInWithGithub = () => {
    supabase.auth.signIn({
      provider: "github",
    });
  };

  return (
    <div className=" w-96 h-44 flex justify-center items-center rounded-md bg-purple-400">
      <button
        className="px-6 py-3 m-4 cursor-pointer bg-gray-700 hover:bg-gray-800 hover:shadow-lg rounded-md text-white"
        onClick={signInWithGithub}
      >
        Login with Github
      </button>
    </div>
  );
};
