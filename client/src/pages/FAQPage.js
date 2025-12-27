import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "What types of appliances does Relda offer?",
      answer: "Relda offers a wide range of home and kitchen appliances, including chimneys, hobs, mixers, nutri-mixers, kettles, LED TVs, and commercial mixers—affordable for every household."
    },
    {
      question: "Are Relda products suitable for both home and commercial use?",
      answer: "Yes! Relda appliances are designed to meet both home and commercial requirements, ensuring durability and efficiency."
    },
    {
      question: "Do Relda products come with a warranty?",
      answer: "Yes, all Relda products come with a standard manufacturer's warranty. Warranty duration may vary depending on the product."
    },
    {
      question: "How do I register my product for warranty?",
      answer: "You can register your product online via our website or by contacting our customer support team. Registration is simple and ensures smooth service if needed."
    },
    {
      question: "Does Relda deliver products nationwide?",
      answer: "Yes, Relda delivers across India. Delivery times may vary based on location, and you can track your order online after purchase."
    },
        {
      question: "What payment options are available?",
      answer: "We accept payments via credit/debit cards, net banking, UPI, (where applicable). EMI options are also available on select products."
    },
    {
      question: "What is the return or replacement policy?",
      answer: "As per policy details, eligible products can be, replaced, or repaired."
    },
    {
      question: "Can I visit a Relda store to see the products?",
      answer: "Yes, Relda stores are open for customers to explore and test products before purchasing. Visit our website to find your nearest store."
    },
    {
      question: "Does Relda provide installation services?",
      answer: "Yes, professional installation services are available for most kitchen appliances purchased from Relda. Our team ensures safe and proper setup."
    },
    {
      question: "How can I become a Relda franchise partner?",
      answer: "You can join the Relda family by filling out the franchise inquiry form on our website. We provide full support and guidance for new franchise partners."
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">

          <h1 className="text-3xl font-bold mb-3">
            Frequently asked questions
          </h1>
          {/* <p className="text-[#99A1AF] text-sm sm:text-base">
            There's no such thing as too many questions
          </p> */}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4 sm:space-y-5">
          {faqs.map((faq, index) => (
                <div
                key={index}
                className={`rounded-2xl transition-all duration-300 ${
                    openIndex === index
                    ? 'bg-white border-2 border-red-400 shadow-lg'
                    : 'bg-[#F5F5F5] border-2 border-transparent shadow-sm hover:shadow-md'
                }`}
                >

              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-5 sm:px-8 py-4 flex justify-between items-center text-left"
              >
                <span className="text-base lg:text-lg font-medium pr-4">
                  {faq.question}
                </span>
                <span className="flex-shrink-0 text-brand-primary text-2xl sm:text-3xl font-light">
                  {openIndex === index ? <Minus /> : <Plus/>}
                </span>
              </button>
              
              {openIndex === index && (
                <div className="px-5 sm:px-8 pb-5 sm:pb-6">
                  <p className="text-[#A7A5AF] text-sm sm:text-base leading-7 md:leading-8">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
