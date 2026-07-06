import SectionContainer from "@/components/shared/SectionContainer";
import { Separator } from "@/components/ui/separator";

import FooterLinks from "./FooterLinks";
import NewsletterForm from "./NewsletterForm";
import SocialLinks from "./SocialLinks";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <SectionContainer className="py-20">
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <h2 className="text-4xl font-bold">🎬 ReelVerse</h2>

            <p className="mt-6 max-w-md text-slate-400">
              Experience the next generation of movie streaming with beautiful
              design and lightning-fast performance.
            </p>

            <div className="mt-8">
              <SocialLinks />
            </div>
          </div>

          <div className="space-y-12">
            <NewsletterForm />

            <FooterLinks />
          </div>
        </div>

        <Separator className="my-10 bg-slate-800" />

        <div className="flex flex-col items-center justify-between gap-4 text-sm text-slate-500 md:flex-row">
          <p>© 2026 ReelVerse. All rights reserved.</p>

          {/* <p>Built with ❤️ using Next.js & shadcn/ui</p> */}
        </div>
      </SectionContainer>
    </footer>
  );
}
