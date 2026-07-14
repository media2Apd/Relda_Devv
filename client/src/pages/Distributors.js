import React from 'react'
import DistributorForm from '../components/DistributerComponents/Distributorform'
import DistributorHero from '../components/DistributerComponents/DistributorHero'
import WhyRelda from '../components/DistributerComponents/WhyRelda'
import Benefits from '../components/DistributerComponents/Benifits'
import Roadmap from '../components/DistributerComponents/Roadmap'
import BusinessSupport from '../components/DistributerComponents/BusinessSupport'
import Luxury from '../components/DistributerComponents/Luxury'
import WhoCanApply from '../components/DistributerComponents/WhoCanApply'
import StatsCard from '../components/DistributerComponents/StatsCard'
import SuccessStory from '../components/DistributerComponents/SuccessStory'
import Faqs from '../components/DistributerComponents/Faqs'
import CTASection from '../components/DistributerComponents/CTASection'
import AboutAndLeadership from "../components/AuthorizedDealer/AboutAndLeadership";

const distributorFaqs = [
  {
    id: 1,
    question: "Who can become a RELDA Distributor?",
    answer: "Distributors, wholesalers, retailers, and entrepreneurs looking to grow with a trusted brand."
  },
  {
    id: 2,
    question: "What support does RELDA provide?",
    answer: "Marketing support, product training, dealer development, and dedicated relationship management."
  },
  {
    id: 3,
    question: "Do distributors get exclusive territories?",
    answer: "Yes. Exclusive territory opportunities are available based on location and eligibility."
  },
  {
    id: 4,
    question: "How do I apply?",
    answer: "Click Apply Now and submit your details. Our team will get in touch."
  },
  {
    id: 5,
    question: "Why partner with RELDA?",
    answer: "Quality products, attractive margins, strong business support, and long-term growth opportunities."
  },
  {
    id: 6,
    question: "Does RELDA help expand my dealer network?",
    answer: "Yes. We assist in dealer onboarding and network development to help grow your business."
  }
];

const Distributors = () => {
  return (
    <div>
      <DistributorHero />
      <WhyRelda />
      <Benefits />
      <Roadmap />
      <BusinessSupport />
      <Luxury />
      <WhoCanApply />
      <StatsCard />
      <AboutAndLeadership />
      <SuccessStory />
            <Faqs 
        title="Frequently Asked Questions"
        faqs={distributorFaqs}
        defaultOpenIndex={0}
        bgColor="bg-gray-50"
        textColor="text-brand-primary"
        borderColor="border-brand-productCardBorder"
      />
      <DistributorForm />
      <CTASection />
    </div>
  )
}

export default Distributors
