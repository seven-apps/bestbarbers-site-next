"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

import { faqItems, type FAQItem } from "@/content/faq-home";

// Get unique categories
const categories = Array.from(new Set(faqItems.map(item => item.category)));

function FAQAccordionItem({
  item,
  isOpen,
  onToggle,
  index
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <div
      className="border-b border-gray-800/30 last:border-b-0 animate-fade-in"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <button
        onClick={onToggle}
        className="w-full py-5 md:py-6 flex items-center justify-between text-left gap-4 group"
      >
        <span className="text-sm md:text-base font-medium text-white group-hover:text-[#ffaf02] transition-colors leading-relaxed">
          {item.question}
        </span>
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? "bg-[#ffaf02]/20 rotate-180" : "bg-white/5 group-hover:bg-white/10"
            }`}
        >
          <ChevronDown className={`w-4 h-4 transition-colors ${isOpen ? "text-[#ffaf02]" : "text-gray-400 group-hover:text-[#ffaf02]"
            }`} />
        </div>
      </button>
      {/* CSS-based collapse animation */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <p className="pb-5 md:pb-6 text-sm md:text-[15px] text-gray-400 leading-relaxed pr-12">
          {item.answer}
        </p>
      </div>
    </div>
  );
}

export function FAQSection() {
  const [activeCategory, setActiveCategory] = useState<string>("App Próprio");
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0]));
  const tabsRef = useRef<HTMLDivElement>(null);
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const [showRightGradient, setShowRightGradient] = useState(true);

  const filteredItems = faqItems.filter(item => item.category === activeCategory);

  const toggleItem = (index: number) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  // Handle scroll gradient visibility
  useEffect(() => {
    const handleScroll = () => {
      if (!tabsRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current;
      setShowLeftGradient(scrollLeft > 10);
      setShowRightGradient(scrollLeft < scrollWidth - clientWidth - 10);
    };

    const tabsElement = tabsRef.current;
    if (tabsElement) {
      tabsElement.addEventListener("scroll", handleScroll);
      handleScroll();
    }

    return () => {
      if (tabsElement) {
        tabsElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-[#121212]">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14 animate-fade-in-up">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ffaf02]/10 text-[#ffaf02] text-xs md:text-sm font-semibold mb-4 border border-[#ffaf02]/20">
            <HelpCircle className="w-4 h-4" />
            DÚVIDAS FREQUENTES
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-3">
            Perguntas frequentes
          </h2>
          <p className="text-sm md:text-base text-gray-400 max-w-xl mx-auto">
            Tire suas dúvidas sobre as funcionalidades do BestBarbers
          </p>
        </div>

        {/* Category Tabs - Horizontal scroll on mobile */}
        <div className="relative mb-8 md:mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {/* Left gradient fade */}
          <div
            className={`absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#121212] to-transparent z-10 pointer-events-none transition-opacity duration-300 md:hidden ${showLeftGradient ? "opacity-100" : "opacity-0"
              }`}
          />

          {/* Right gradient fade */}
          <div
            className={`absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#0f0f0f] to-transparent z-10 pointer-events-none transition-opacity duration-300 md:hidden ${showRightGradient ? "opacity-100" : "opacity-0"
              }`}
          />

          {/* Tabs container */}
          <div
            ref={tabsRef}
            className="flex md:flex-wrap md:justify-center gap-2 md:gap-3 overflow-x-auto scrollbar-hide pb-2 md:pb-0 px-1 -mx-1 scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map((category, index) => (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category);
                  setOpenItems(new Set([0]));
                }}
                className={`flex-shrink-0 px-4 py-2.5 md:px-5 md:py-3 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] animate-fade-in ${activeCategory === category
                  ? "bg-gradient-to-r from-[#ffaf02] to-[#ffc233] text-black "
                  : "bg-[#1a1a1a]/80 backdrop-blur-sm text-gray-300 hover:bg-[#252525] border border-gray-800/50 hover:border-gray-700"
                  }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {/* Glassmorphism card */}
          <div className="bg-gradient-to-br from-[#1a1a1a]/90 to-[#1e1e1e]/90 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-gray-800/50 px-5 md:px-8 shadow-2xl">
            <div key={activeCategory} className="animate-fade-in">
              {filteredItems.map((item, index) => (
                <FAQAccordionItem
                  key={`${activeCategory}-${index}`}
                  item={item}
                  isOpen={openItems.has(index)}
                  onToggle={() => toggleItem(index)}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
