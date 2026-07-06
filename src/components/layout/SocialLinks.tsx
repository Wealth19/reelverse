
import { FaFacebookF, FaGithub, FaInstagram, FaTwitter } from "react-icons/fa";


const socials = [
  {
    icon: FaFacebookF,
    href: "#",
  },
  {
    icon: FaTwitter,
    href: "#",
  },
  {
    icon: FaInstagram,
    href: "#",
  },
  {
    icon: FaGithub,
    href: "#",
  },
];

export default function SocialLinks() {
  return (
    <div className="flex gap-4">
      {socials.map(({ icon: Icon, href }, index) => (
        <a
          key={index}
          href={href}
          className="rounded-full border border-slate-700 p-3 transition hover:border-red-600 hover:bg-red-600"
        >
          <Icon size={18} />
        </a>
      ))}
    </div>
  );
}
