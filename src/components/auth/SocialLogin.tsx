import { FaGithub, FaGoogle } from "react-icons/fa";

import { Button } from "@/components/ui/button";

export default function SocialLogin() {
  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        className="w-full justify-center gap-3 border-slate-700 bg-transparent hover:bg-slate-900 cursor-pointer"
      >
        <FaGoogle />
        Continue with Google
      </Button>

      <Button
        variant="outline"
        className="w-full cursor-pointer justify-center gap-3 border-slate-700 bg-transparent hover:bg-slate-900"
      >
        <FaGithub />
        Continue with GitHub
      </Button>
    </div>
  );
}
