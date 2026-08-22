'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, ChevronDown, Flame, Mail, MessageCircle } from 'lucide-react';
import { FadeIn } from '@/components/motion/FadeIn';

const FAQ_DATA = [
  {
    category: "Products & Quality",
    questions: [
      {
        q: "What products does Sunil Choudhary Masala (SCM) offer?",
        a: "SCM offers a range of premium Indian spices, including Red Chilli, Coriander, Turmeric, Dry Fruits, Makhana, and Cooking Oils crafted for everyday Indian cooking."
      },
      {
        q: "What makes SCM spices different?",
        a: "SCM combines three generations of family experience with carefully selected ingredients, hygienic processing, and modern packaging to deliver authentic Indian taste and consistent quality."
      },
      {
        q: "Do SCM products contain artificial colours?",
        a: "No. SCM does not add artificial colours during the processing or packing of its spice products."
      },
      {
        q: "Do SCM products contain preservatives?",
        a: "No. SCM does not add preservatives during the processing or packing of its spice products."
      },
      {
        q: "Why may the colour or aroma of spices vary slightly?",
        a: "Spices are natural agricultural products. Their colour, aroma, texture, and appearance may naturally vary depending on crop, season, origin, and harvesting conditions."
      },
      {
        q: "How should I store SCM spices?",
        a: "For best freshness: \n• Store in a cool and dry place.\n• Keep the packet tightly sealed after use.\n• Avoid direct sunlight and moisture.\n• Always use a clean and dry spoon."
      }
    ]
  },
  {
    category: "Ordering",
    questions: [
      {
        q: "How can I place an order?",
        a: "You can browse our products, add your preferred items to the cart, and complete your purchase through our secure checkout process."
      },
      {
        q: "Can I modify or cancel my order after placing it?",
        a: "If your order has not yet been processed for dispatch, please contact our customer support team as soon as possible. We'll do our best to assist you. See our Cancellation Policy for details."
      },
      {
        q: "Will I receive an order confirmation?",
        a: "Yes. Once your order is successfully placed, you will receive an order confirmation via your registered email address or mobile number."
      }
    ]
  },
  {
    category: "Payments",
    questions: [
      {
        q: "Which payment methods are accepted?",
        a: "SCM supports secure online payment methods. The available payment options will be displayed during checkout."
      },
      {
        q: "Is my payment information secure?",
        a: "Yes. All online payments are processed through secure and trusted payment gateway providers using industry-standard encryption."
      }
    ]
  },
  {
    category: "Shipping",
    questions: [
      {
        q: "Where does SCM deliver?",
        a: "SCM delivers to most serviceable locations across India. Delivery availability depends on your postal code and courier service coverage."
      },
      {
        q: "How long will delivery take?",
        a: "Delivery timelines may vary depending on your location. Estimated delivery information will be shared during checkout. See our Shipping Policy for typical timeframes."
      },
      {
        q: "What if my package arrives damaged?",
        a: "If your package appears damaged during delivery, please contact our customer support team as soon as possible with photographs of the package and product so we can review the issue."
      },
      {
        q: "Can shipping be delayed?",
        a: "Yes. Delivery may occasionally be delayed due to weather conditions, public holidays, logistics issues, or other unforeseen circumstances."
      }
    ]
  },
  {
    category: "Returns & Refunds",
    questions: [
      {
        q: "Can I return a product?",
        a: "Returns are accepted only under the conditions mentioned in our Return & Refund Policy. Products should remain unused and meet the applicable return requirements."
      },
      {
        q: "When will I receive my refund?",
        a: "Once the returned product has been inspected and approved, eligible refunds will be processed according to our Return & Refund Policy."
      }
    ]
  },
  {
    category: "Distributor & Business Enquiries",
    questions: [
      {
        q: "How can I become an SCM distributor?",
        a: "You can submit your business enquiry through the Distributor Program page. Our team will review your application and contact you if your business profile matches our partnership requirements."
      },
      {
        q: "Can retailers partner with SCM?",
        a: "Yes. SCM welcomes enquiries from kirana stores, supermarkets, departmental stores, grocery outlets, and other retail businesses interested in stocking our products."
      },
      {
        q: "Does SCM work with content creators and influencers?",
        a: "Yes. SCM offers a Creator Partnership Program for eligible food, cooking, lifestyle, and family content creators. Collaborations are currently offered on a barter basis."
      }
    ]
  },
  {
    category: "Customer Support",
    questions: [
      {
        q: "How can I contact SCM?",
        a: "You can reach us through the Contact Us page, WhatsApp, email, phone support, or our online enquiry form."
      },
      {
        q: "What are your customer support hours?",
        a: "Our support team is available Monday to Sunday, from 9:00 AM to 7:00 PM (IST)."
      },
      {
        q: "Can I enquire about bulk or wholesale purchases?",
        a: "Yes. Businesses interested in wholesale, retail, or distributor partnerships are welcome to contact our business team through the dedicated enquiry forms."
      },
      {
        q: "Where can I find your company policies?",
        a: "Our Privacy Policy, Terms & Conditions, Shipping Policy, Return & Refund Policy, Cancellation Policy, and Cookie Policy are available in the footer of our website."
      }
    ]
  },
  {
    category: "General",
    questions: [
      {
        q: "Are the product images shown on the website actual products?",
        a: "We strive to display accurate product images. However, actual packaging may vary slightly due to product updates, printing revisions, or manufacturing changes."
      },
      {
        q: "Why should I choose Sunil Choudhary Masala?",
        a: "For over three generations, SCM has been committed to delivering authentic Indian spices with carefully selected ingredients, hygienic processing, honest business practices, and a dedication to customer satisfaction."
      }
    ]
  }
];

export default function FaqPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (categoryId: number, questionId: number) => {
    const key = `${categoryId}-${questionId}`;
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredCategories = FAQ_DATA.map(category => {
    return {
      ...category,
      questions: category.questions.filter(q => 
        q.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
        q.a.toLowerCase().includes(searchTerm.toLowerCase())
      )
    };
  }).filter(category => category.questions.length > 0);

  return (
    <div className="bg-cream min-h-screen pb-20">
      {/* Interior Page Hero */}
      <div className="bg-gradient-to-r from-charcoal to-[#2a2420] py-20 relative overflow-hidden">
        <div className="absolute top-1/2 left-8 -translate-y-1/2 text-9xl opacity-5 select-none pointer-events-none">❓</div>
        <div className="absolute top-1/2 right-8 -translate-y-1/2 text-9xl opacity-5 select-none pointer-events-none">💡</div>
        
        <div className="container-custom relative z-10 text-center">
          <span className="text-saffron font-bold tracking-wider uppercase text-sm mb-3 block">Help Center</span>
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Frequently Asked Questions</h1>
          <p className="text-cream-mid max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
            Everything you need to know about SCM products, orders & policies
          </p>
        </div>
      </div>

      <div className="container-custom max-w-4xl -mt-8 relative z-20">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-cream-dark">
          
          <div className="relative mb-12">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="text-brown/50" size={20} />
            </div>
            <input
              type="text"
              placeholder="Search questions (e.g. shipping, returns, payment)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-cream/30 border border-cream-dark/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-brand-red text-charcoal font-medium text-lg transition-shadow"
            />
          </div>

          {filteredCategories.length > 0 ? (
            <div className="space-y-12">
              {filteredCategories.map((category, catIndex) => (
                <div key={catIndex} className="animate-fade-in-up">
                  <h2 className="flex items-center gap-3 font-playfair text-2xl font-bold text-brand-red mb-6 pb-2 border-b border-cream-dark/30">
                    <Flame size={24} />
                    {category.category}
                  </h2>
                  <div className="space-y-4">
                    {category.questions.map((item, qIndex) => {
                      const isOpen = openItems[`${catIndex}-${qIndex}`];
                      return (
                        <div 
                          key={qIndex} 
                          className={`border rounded-xl transition-all duration-300 overflow-hidden ${
                            isOpen 
                              ? 'border-brand-red/30 bg-cream/30 shadow-md' 
                              : 'border-cream-dark/50 bg-white hover:border-brand-red/50 hover:shadow-sm'
                          }`}
                        >
                          <button
                            onClick={() => toggleItem(catIndex, qIndex)}
                            className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none gap-4"
                          >
                            <span className="font-medium text-lg text-charcoal">{item.q}</span>
                            <ChevronDown 
                              size={20} 
                              className={`text-brand-red shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                            />
                          </button>
                          <div 
                            className={`transition-all duration-300 ease-in-out ${
                              isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                            }`}
                          >
                            <div className="px-6 pb-6 text-brown leading-relaxed whitespace-pre-line border-t border-cream-dark/30 pt-4 mt-2 mx-6">
                              {item.a}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-cream/30 rounded-2xl border border-cream-dark/30">
              <Search className="mx-auto text-cream-dark mb-4" size={48} />
              <h3 className="font-playfair text-2xl font-bold text-charcoal mb-2">No questions found</h3>
              <p className="text-brown">We couldn't find anything matching "{searchTerm}". Try different keywords.</p>
            </div>
          )}

          <div className="mt-16 bg-cream-dark/20 rounded-2xl p-8 md:p-10 border border-cream-dark/50 text-center">
            <h3 className="font-playfair text-2xl md:text-3xl font-bold text-charcoal mb-4">Still Need Help?</h3>
            <p className="text-brown mb-8 text-lg">Our team will be happy to assist you — Monday to Sunday, 9:00 AM – 7:00 PM (IST)</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-brand-red text-white px-8 py-3.5 rounded-full font-bold hover:bg-red-800 transition-colors">
                <Mail size={18} />
                Contact Us
              </Link>
              <a href="https://wa.me/919875231865" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-white text-brand-red border border-brand-red px-8 py-3.5 rounded-full font-bold hover:bg-cream transition-colors">
                <MessageCircle size={18} />
                WhatsApp Us
              </a>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
