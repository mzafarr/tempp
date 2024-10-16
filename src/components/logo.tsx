import Link from "next/link";
import React from "react";

function Logo() {
  return (
    <Link href="/">
      <img src="/logo.jpg" alt="logo" width={120} height={120} className="rounded-lg -py-2" />
    </Link>
  );
}

export default Logo;
