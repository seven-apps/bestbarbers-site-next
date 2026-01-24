"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { homeContent } from "@/content/home";

export function Footer() {
  const { footer } = homeContent;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <footer className="bg-[#0a0a0a] py-16 md:py-20 lg:py-24 overflow-hidden border-t border-white/5">
      <div className="container-custom">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row justify-between items-start gap-10 md:gap-12 lg:gap-20"
        >
          {/* Logo and tagline */}
          <motion.div variants={itemVariants} className="flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Image
                src={footer.logo.src}
                alt={footer.logo.alt}
                width={footer.logo.width}
                height={footer.logo.height}
                className="w-[150px] md:w-[180px] lg:w-[200px] h-auto mb-4"
              />
            </motion.div>
            <p className="text-gray-500 text-sm max-w-xs mt-4 hidden lg:block">
              Transformando barbearias em negócios lucrativos desde 2020.
            </p>
          </motion.div>

          {/* Links sections - Desktop */}
          <div className="hidden lg:flex flex-1 justify-between gap-16">
            {footer.sections.map((section, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex flex-col space-y-4"
              >
                <h3 className="text-white font-semibold text-base mb-2">
                  {section.title}
                </h3>
                
                {'links' in section && section.links && (
                  <div className="flex flex-col space-y-3">
                    {section.links.map((link, linkIndex) => (
                      <motion.div
                        key={linkIndex}
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link
                          href={link.href}
                          className="text-gray-400 hover:text-[#ffaf02] transition-colors text-sm inline-flex items-center gap-2"
                        >
                          {link.text}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                )}

                {'contact' in section && section.contact && (
                  <div className="flex flex-col space-y-4">
                    <motion.div
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link
                        href={section.contact.whatsapp.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-3 text-gray-400 hover:text-[#ffaf02] transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#25D366]/10 flex items-center justify-center group-hover:bg-[#25D366]/20 transition-colors">
                          <Image
                            src="/images/icon-5.webp"
                            alt="WhatsApp"
                            width={18}
                            height={18}
                            className="w-4 h-4"
                          />
                        </div>
                        <span className="text-sm">{section.contact.whatsapp.text}</span>
                      </Link>
                    </motion.div>
                    
                    <div className="flex items-center space-x-3 text-gray-400">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                        <Image
                          src="/images/icon-6.webp"
                          alt="Email"
                          width={18}
                          height={18}
                          className="w-4 h-4"
                        />
                      </div>
                      <span className="text-sm">{section.contact.email}</span>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* App Store badges */}
          <motion.div variants={itemVariants} className="flex flex-col space-y-4">
            <h3 className="text-white font-semibold text-base mb-2">
              {footer.appStores.title}
            </h3>
            <div className="flex flex-row lg:flex-col gap-3">
              {footer.appStores.links.map((store, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={store.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Image
                      src={store.image}
                      alt={`Baixar na ${store.type === 'ios' ? 'App Store' : 'Google Play'}`}
                      width={140}
                      height={42}
                      className="h-10 md:h-11 w-auto opacity-80 hover:opacity-100 transition-opacity"
                    />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Links sections - Mobile */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="lg:hidden mt-10 space-y-8"
        >
          {footer.sections.map((section, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex flex-col space-y-4"
            >
              <h3 className="text-white font-semibold text-base">
                {section.title}
              </h3>
              
              {'links' in section && section.links && (
                <div className="flex flex-col space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <Link
                      key={linkIndex}
                      href={link.href}
                      className="text-gray-400 hover:text-[#ffaf02] transition-colors text-sm"
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
                    className="flex items-center space-x-3 text-gray-400 hover:text-[#ffaf02] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#25D366]/10 flex items-center justify-center">
                      <Image
                        src="/images/icon-5.webp"
                        alt="WhatsApp"
                        width={18}
                        height={18}
                        className="w-4 h-4"
                      />
                    </div>
                    <span className="text-sm">{section.contact.whatsapp.text}</span>
                  </Link>
                  
                  <div className="flex items-center space-x-3 text-gray-400">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <Image
                        src="/images/icon-6.webp"
                        alt="Email"
                        width={18}
                        height={18}
                        className="w-4 h-4"
                      />
                    </div>
                    <span className="text-sm">{section.contact.email}</span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mt-12 mb-8"
        />

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-xs"
        >
          <p>© {new Date().getFullYear()} BestBarbers. Todos os direitos reservados.</p>
          <p>Feito com dedicação para barbearias que querem crescer.</p>
        </motion.div>
      </div>
    </footer>
  );
}
