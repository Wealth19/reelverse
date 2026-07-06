import Link from "next/link";

interface AuthFooterProps {
  text: string;
  linkText: string;
  href: string;
}

export default function AuthFooter({ text, linkText, href }: AuthFooterProps) {
  return (
    <div className="mt-8 text-center text-slate-400">
      {text}{" "}
      <Link
        href={href}
        className="font-semibold text-red-500 hover:text-red-400"
      >
        {linkText}
      </Link>
    </div>
  );
}
