import Image from "next/image";
import Link from "next/link";
import { homeContent } from "@/content/home";

export function Footer() {
  const { footer } = homeContent;

  return (
    <footer className="section-dark section-padding">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-32">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Image
              src={footer.logo.src}
              alt={footer.logo.alt}
              width={footer.logo.width}
              height={footer.logo.height}
              className="w-[200px] h-auto mb-6 lg:mb-0"
            />
          </div>

          {/* Links sections - Desktop */}
          <div className="hidden lg:flex flex-1 justify-between">
            {footer.sections.map((section, index) => (
              <div key={index} className="flex flex-col space-y-4">
                <h3 className="text-white font-semibold text-base">
                  {section.title}
                </h3>
                
                {'links' in section && section.links && (
                  <div className="flex flex-col space-y-2">
                    {section.links.map((link, linkIndex) => (
                      <Link
                        key={linkIndex}
                        href={link.href}
                        className="text-neutral-dark-grey hover:text-white transition-colors text-sm"
                        style={{ color: '#f0f0f0' }}
                      >
                        {link.text}
                      </Link>
                    ))}
                  </div>
                )}

                {'contact' in section && section.contact && (
                  <div className="flex flex-col space-y-3">
                    <Link
                      href={section.contact.whatsapp.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-neutral-dark-grey hover:text-white transition-colors"
                      style={{ color: '#f0f0f0' }}
                    >
                      <Image
                        src="/images/icon-5.webp"
                        alt="WhatsApp"
                        width={16}
                        height={16}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{section.contact.whatsapp.text}</span>
                    </Link>
                    
                    <div className="flex items-center space-x-2 text-neutral-dark-grey">
                      <Image
                        src="/images/icon-6.webp"
                        alt="Email"
                        width={16}
                        height={16}
                        className="w-4 h-4"
                        style={{ color: '#f0f0f0' }}
                      />
                      <span className="text-sm" style={{ color: '#f0f0f0' }}>{section.contact.email}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* App Store badges */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-white font-semibold text-base">
              {footer.appStores.title}
            </h3>
            <div className="flex flex-col space-y-2">
              {footer.appStores.links.map((store, index) => (
                <Link
                  key={index}
                  href={store.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Image
                    src={store.image}
                    alt={`Baixar na ${store.type === 'ios' ? 'App Store' : 'Google Play'}`}
                    width={120}
                    height={40}
                    className="h-10 w-auto"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Links sections - Mobile */}
        <div className="lg:hidden mt-8 space-y-8">
          {footer.sections.map((section, index) => (
            <div key={index} className="flex flex-col space-y-4">
              <h3 className="text-white font-semibold text-base">
                {section.title}
              </h3>
              
              {'links' in section && section.links && (
                <div className="flex flex-col space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <Link
                      key={linkIndex}
                      href={link.href}
                      className="text-neutral-dark-grey hover:text-white transition-colors text-sm"
                    >
                      {link.text}
                    </Link>
                  ))}
                </div>
              )}

              {'contact' in section && section.contact && (
                <div className="flex flex-col space-y-3">
                  <Link
                    href={section.contact.whatsapp.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-neutral-dark-grey hover:text-white transition-colors"
                  >
                    <Image
                      src="/images/icon-5.webp"
                      alt="WhatsApp"
                      width={16}
                      height={16}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{section.contact.whatsapp.text}</span>
                  </Link>
                  
                  <div className="flex items-center space-x-2 text-neutral-dark-grey">
                    <Image
                      src="/images/icon-6.webp"
                      alt="Email"
                      width={16}
                      height={16}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{section.contact.email}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
