const links = {
  Explore: ["Movies", "TV Shows", "Top Rated", "Trending"],
  Company: ["About", "Careers", "Contact", "Blog"],
  Support: ["Help Center", "Privacy", "Terms", "FAQ"],
};

export default function FooterLinks() {
  return (
    <div className="grid grid-cols-2 gap-10 md:grid-cols-3">
      {Object.entries(links).map(([title, items]) => (
        <div key={title}>
          <h3 className="mb-4 font-semibold">{title}</h3>

          <ul className="space-y-3 text-slate-400">
            {items.map((item) => (
              <li key={item}>
                <a href="#" className="transition hover:text-red-500">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
