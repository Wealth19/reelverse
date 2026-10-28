import { FaFacebookF, FaGithub, FaInstagram, FaTwitter } from "react-icons/fa";

const socials = [
  {
    label: "Facebook",
    icon: FaFacebookF,
    href: "https://facebook.com",
  },
  {
    label: "Twitter",
    icon: FaTwitter,
    href: "https://twitter.com",
  },
  {
    label: "Instagram",
    icon: FaInstagram,
    href: "https://instagram.com",
  },
  {
    label: "GitHub",
    icon: FaGithub,
    href: "https://github.com",
  },
];

export default function SocialLinks() {
  return (
    <div className="flex items-center gap-3">
      {socials.map(({ label, icon: Icon, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#2a241c] bg-[#141118] text-[#cbbba4] transition duration-200 hover:-translate-y-0.5 hover:border-[#d4a24c] hover:bg-[#d4a24c] hover:text-[#08070b]"
        >
          <Icon size={15} />
        </a>
      ))}
    </div>
  );
}
