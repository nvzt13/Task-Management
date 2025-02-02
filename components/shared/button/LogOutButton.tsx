import React, { useState } from "react";
import { Button } from "../../ui/button";
import { signOut } from "next-auth/react";
import { cn } from "../../../lib/utils";
import { Loader2Icon } from "lucide-react";

const LogOutButton = () => {
  const [loading, setLoading] = useState(false);
  
  const handleSignOut = () => {
    setLoading(true);
    signOut({ callbackUrl: '/' }); // Çıkış yaptıktan sonra login sayfasına yönlendir
  };
  
  return (
    <Button
      onClick={handleSignOut}
      className={cn({
        "opacity-40 pointer-events-none": loading,
        "flex items-center justify-center gap-4": true,
      })}
    >
      <p>Log Out</p>
      {loading && <Loader2Icon className="animate-spin" />}
    </Button>
  );
};

export default LogOutButton;
