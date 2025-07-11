import { title } from "@/components/primitives";
import ContactSection from "@/components/contact-section";

export default function ContactPage() {
  return (
    <div className="py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="text-center mb-12 lg:mb-16">
          <h1 className={title()}>Contact</h1>
          <p className="mt-4 text-lg text-default-600">
            Let's connect and discuss opportunities
          </p>
        </div>
        <ContactSection />
      </div>
    </div>
  );
}
