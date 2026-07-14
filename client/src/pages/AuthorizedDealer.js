import React from "react";

import DealerHero from "../components/AuthorizedDealer/DealerHero";
import WhyPartner from "../components/AuthorizedDealer/WhyPartner";
import AffordableSection from "../components/AuthorizedDealer/AffordableSection";
import CustomerBenefits from "../components/AuthorizedDealer/CustomerBenefits";
import DealerCriteria from "../components/AuthorizedDealer/DealerCriteria";
import SuccessPath from "../components/AuthorizedDealer/SuccessPath";
import AboutAndLeadership from "../components/AuthorizedDealer/AboutAndLeadership";
import FinalCTA from "../components/AuthorizedDealer/FinalCTA";
import Faqs from "../components/DistributerComponents/Faqs";
import DealerForm from "../components/AuthorizedDealer/DealerForm";
import Testimonials from "../components/AuthorizedDealer/Testimonials";


const serviceCenterFaqs = [
  {
    question: "Who can become a RELDA dealer?",
    answer:
      "Anyone with a retail space, investment capability, and passion for business can apply.",
  },
  {
    question: "Do I need prior experience?",
    answer:
      "No. RELDA provides complete training and business support.",
  },
  {
    question: "What support does RELDA provide?",
    answer:
      "Showroom branding, marketing, product training, and dealer assistance.",
  },
  {
    question: "How do I apply?",
    answer:
      "Click Apply Now and submit your details. Our team will contact you.",
  },
  {
    question: "Why choose RELDA?",
    answer:
      "Affordable, quality home appliances backed by trusted service and dealer support.",
  },
  {
    question: "Will I receive marketing support?",
    answer:
      "Yes. We provide both digital and offline marketing support.",
  },
];

export default function AuthorizedDealer() {
  
  const scrollToForm = () => {
    const formElement = document.getElementById('dealer-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <DealerHero onApplyClick={scrollToForm} />
      <WhyPartner />
      <AffordableSection />
      <CustomerBenefits />
      <DealerCriteria />
      <SuccessPath />
      <AboutAndLeadership />
      <Testimonials />
      <Faqs title="Frequently Asked Questions"
        faqs={serviceCenterFaqs}
        defaultOpenIndex={0}
        bgColor="bg-gray-50"
        textColor="text-brand-primary"
        borderColor="border-brand-productCardBorder" />

      <DealerForm />
      <FinalCTA onApplyClick={scrollToForm}/>
    </>
  );
}