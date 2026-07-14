import React from 'react'
import ServiceCenterForm from '../components/ServiceCenterComponents/ServiceCenterForm'
import HeroSection from '../components/ServiceCenterComponents/HeroSection'
import PartnerWithUs from '../components/ServiceCenterComponents/PartnerWithUs'
import WhoCanApply from '../components/ServiceCenterComponents/WhoCanApply'
import Benefits from '../components/ServiceCenterComponents/Benefits'
import OnboardJourney from '../components/ServiceCenterComponents/OnboardJourney'
import Support from '../components/ServiceCenterComponents/Support'
import Services from '../components/ServiceCenterComponents/Services'
import Trust from '../components/ServiceCenterComponents/Trust'
import StatsCard from '../components/ServiceCenterComponents/StatsCard'
import Stories from '../components/ServiceCenterComponents/Stories'
import BottomCTA from '../components/ServiceCenterComponents/BottomCTA'
import Faqs from '../components/DistributerComponents/Faqs'
import AboutAndLeadership from "../components/AuthorizedDealer/AboutAndLeadership";


const serviceCenterFaqs = [
  {
    question: "Who can become a RELDA Authorized Service Center?",
    answer:
      "Service providers, repair businesses, technicians, and entrepreneurs with technical expertise can apply.",
  },
  {
    question: "What support does RELDA provide?",
    answer:
      "Technical training, genuine spare parts, warranty support, branding, and business guidance.",
  },
  {
    question: "Will I receive technical training?",
    answer:
      "Yes. RELDA provides product training and technical certification for service partners.",
  },
  {
    question: "What services can I offer?",
    answer:
      "Installation, warranty service, repairs, maintenance, spare parts replacement, and customer support.",
  },
  {
    question: "How do I apply?",
    answer:
      "Click Apply Now and submit your details. Our team will contact you.",
  },
  {
    question: "Why partner with RELDA?",
    answer:
      "Build a trusted service business with official recognition, ongoing support, and long-term growth opportunities.",
  },
];

const ServiceCenter = () => {
  return (
    <div>
        <HeroSection />
        <PartnerWithUs />
        <WhoCanApply />
        <Benefits />
        <OnboardJourney />
        <Support />
        <Services />
        <Trust />
        <StatsCard />
        <AboutAndLeadership />
        <Stories />
        <Faqs title="Frequently Asked Questions"
        faqs={serviceCenterFaqs}
        defaultOpenIndex={0}
        bgColor="bg-gray-50"
        textColor="text-brand-primary"
        borderColor="border-brand-productCardBorder" />
      <ServiceCenterForm />
      <BottomCTA />
    </div>
  )
}

export default ServiceCenter
