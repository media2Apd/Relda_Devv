import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "What interest rate can I expect?",
      answer: "Generally, the shorter the loan term, the lower the interest rate offered by most loan companies. Some lenders even offer an autopay discount if you authorize your monthly loan payments to be directly withdrawn from your checking account or savings account. Qualifying for lower rates offered by a lender is dependent on your online loan application, credit history and credit score, whether you get a short-term loan or a long-term loan, loan purpose, and other factors. The better the interest rate you can qualify for."
    },
    {
      question: "What can I use a personal loan for?",
      answer: "Personal loans can be used for various purposes including debt consolidation, home improvements, medical expenses, wedding costs, vacation expenses, and other major purchases or financial needs."
    },
    {
      question: "How can I get a personal loan?",
      answer: "To get a personal loan, you typically need to: 1) Check your credit score, 2) Compare lenders and rates, 3) Get pre-qualified, 4) Submit a formal application, 5) Provide required documentation, and 6) Review and sign the loan agreement once approved."
    },
    {
      question: "What is a personal loan?",
      answer: "A personal loan is an unsecured loan that you can use for various purposes. Unlike mortgages or auto loans, personal loans are not tied to a specific asset and can be used at your discretion for most legal purposes."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h3 className="text-brand-primary text-base sm:text-lg font-bold mb-3 sm:mb-4 tracking-wider">
            FAQ
          </h3>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Frequently asked questions
          </h1>
          <p className="text-[#99A1AF] text-sm sm:text-base">
            There's no such thing as too many questions
          </p>
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
                <span className="text-base sm:text-lg lg:text-xl font-semibold pr-4">
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
