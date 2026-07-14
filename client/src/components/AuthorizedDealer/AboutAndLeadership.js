import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Cpu, 
  Leaf, 
  UserRound, 
  Lightbulb,
  // Star,
  // CircleCheck,
  // Smile
} from 'lucide-react';

import founder from '../../assest/About/founder3.webp';
import TrustImg from '../../assest/About/TrustImg.webp';
import { useNavigate } from 'react-router-dom';

const AboutAndLeadership = () => {
  const navigate = useNavigate();
  const previousBrands = ["IFB", "LG", "HAVELLS", "BLUESTAR"];
  const purposeCards = [
      { title: "Superior Quality", desc: "Superior quality and long-lasting performance", icon: <ShieldCheck className="w-5 h-5" /> },
      { title: "Modern Tech", desc: "Modern technology with practical functionality", icon: <Cpu className="w-5 h-5" /> },
      { title: "Energy Efficient", desc: "Energy efficiency and reliability", icon: <Leaf className="w-5 h-5" /> },
      { title: "Customer Support", desc: "Exceptional customer support", icon: <UserRound className="w-5 h-5" /> },
      { title: "Value Innovation", desc: "Value-driven innovation", icon: <Lightbulb className="w-5 h-5" /> },
    ];

  return (
    <div className="bg-white overflow-hidden">
      
      {/* 1. About RELDA Section */}
      <section className="py-16 px-4 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-[2.5rem] overflow-hidden shadow-2xl order-2 lg:order-1"
          >
            <img 
              src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1000" 
              alt="RELDA Kitchen"
              className="w-full h-[400px] object-cover"
            />
          </motion.div>

          {/* Right: Content */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <span className="bg-red-50 text-brand-primary px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
              About Us
            </span>
            <h2 className="text-brand-primary text-5xl lg:text-6xl font-bold mt-4 mb-2">
              About RELDA
            </h2>
            <h3 className="text-gray-600 text-xl font-bold mb-6">
              Affordable for Everyone
            </h3>
            <p className="text-brand-textMuted text-lg leading-relaxed">
              At RELDA, we believe every home deserves appliances that combine innovation, 
              quality, durability, and value. Our mission is to deliver reliable home 
              appliance solutions that simplify everyday living while maintaining the 
              highest standards of performance and customer satisfaction.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. Leadership Section */}
      <section className="pb-16 px-4 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-brand-primary text-4xl font-bold inline-block relative"
          >
            Leadership Built on Experience
            <div className="h-1.5 w-20 bg-brand-primary mt-2 rounded-full"></div>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* CEO Image Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-5 relative"
          >
            {/* Pink decorative corner behind image */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-red-50 rounded-tl-[3rem] -z-10"></div>
            
            <div className="rounded-[2rem] overflow-hidden shadow-xl border-4 border-white">
              <img 
                src={founder}
                alt="CEO Mr. Paul Daniel K"
                className="w-full h-[550px] object-cover object-top"
              />
            </div>

            {/* Experience Badge */}
            <div className="absolute bottom-6 right-6 bg-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3">
              <div className="bg-yellow-400 p-1.5 rounded-md">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div>
                <p className="text-brand-primary text-xl font-bold leading-none">15+</p>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-tight">Years Industry Experience</p>
              </div>
            </div>
          </motion.div>

          {/* CEO Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 flex flex-col justify-center pt-6"
          >
            <h3 className="text-[#1A1A1A] text-5xl font-bold mb-2">Mr. Paul Daniel K</h3>
            <p className="text-brand-primary text-xl font-bold mb-8">Director & CEO</p>
            
            <div className="text-brand-textMuted text-lg leading-relaxed space-y-6">
              <p>
                With over 15 years of illustrious leadership in the consumer durables 
                industry, Mr. Paul Daniel K has been at the forefront of driving operational 
                excellence and market growth for some of India's most iconic brands.
              </p>
              <p>
                His visionary approach and deep understanding of the Indian consumer 
                landscape were honed through pivotal roles at IFB, LG, Havells, and 
                Bluestar. This extensive experience serves as the bedrock of RELDA's 
                commitment to quality and innovation.
              </p>
            </div>

            <div className="mt-12">
              <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mb-6">
                Industry Experience Across India's Leading Consumer Durable Brands
              </p>
              <div className="flex flex-wrap gap-4">
                {previousBrands.map((brand) => (
                  <div key={brand} className="bg-gray-50 px-8 py-4 rounded-xl border border-gray-100 text-gray-400 font-bold text-sm tracking-widest">
                    {brand}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Red Vision Banner */}
      <section className="pb-16 px-4 lg:px-8 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-brand-primary rounded-[3rem] p-10 lg:p-20 relative overflow-hidden flex flex-col lg:flex-row items-center gap-12"
        >
          {/* Text Side */}
          <div className="lg:w-1/2 text-white">
            <h2 className="text-4xl lg:text-6xl font-bold leading-[1.1] mb-8">
              Inspired by Experience. Built for Every Home.
            </h2>
            <p className="text-white/80 text-lg lg:text-xl leading-relaxed max-w-md">
              This rich industry experience inspired the creation of RELDA, a brand built 
              on a simple vision: to make premium-quality appliances accessible, 
              dependable, and affordable for every Indian household.
            </p>
          </div>

          {/* Image Side */}
          <div className="lg:w-1/2 relative">
             <div className="rounded-3xl overflow-hidden border-[10px] border-white/10 shadow-2xl">
                <img 
                  src={TrustImg}
                  alt="RELDA Range"
                  className="w-full h-auto object-cover"
                />
             </div>
          </div>
        </motion.div>
        
      </section>

            {/* 4. Product Purpose Section (New - Top part of your image) */}
            <section className="py-16 bg-[#F8FAFF]">
              <div className="max-w-7xl mx-auto px-4 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-brand-primary text-4xl md:text-5xl font-bold mb-4">Every RELDA Product is Built with Purpose</h2>
                  <div className="h-1 w-24 bg-brand-primary mx-auto rounded-full"></div>
                </div>
      
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  {purposeCards.map((card, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="bg-white p-4 xl:p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all text-center flex flex-col items-center border border-gray-50"
                    >
                      <div className="bg-[#FCECEC] text-brand-primary p-3 rounded-full mb-6">
                        {card.icon}
                      </div>
                      <h4 className="text-gray-900 font-bold text-lg mb-3 leading-tight">{card.title}</h4>
                      <p className="text-brand-textMuted text-sm leading-relaxed">{card.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className='w-full flex justify-center'>
                <button onClick={() => navigate('/AboutUs')} type="button" className="flex justify-center mt-12 text-brand-primary bg-red-100 py-4 px-8 rounded-full font-bold text-lg hover:bg-brand-primary hover:text-white">Read Our Story</button>
              </div>
            </section>
      
            {/* 5. Trust Section (New - Middle part with peach background) */}
            {/* <section className="py-16 bg-[#FDF2F0]/60 px-4 lg:px-8">
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  whileInView={{ opacity: 1, scale: 1 }} 
                  viewport={{ once: true }}
                  className="rounded-[2.5rem] overflow-hidden shadow-2xl"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1000" 
                    alt="Quality Testing" 
                    className="w-full h-auto" 
                  />
                </motion.div>
                
                <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                  <h2 className="text-brand-primary text-5xl lg:text-6xl font-bold leading-tight mb-8">
                    More Than Appliances. We Build Trust.
                  </h2>
                  <p className="text-brand-textMuted text-lg leading-relaxed mb-10">
                    At RELDA, we don't just manufacture appliances, we build trust that lasts for years. 
                    Our commitment is to continuously innovate and provide products that enhance 
                    comfort, convenience, and everyday life.
                  </p>
                  
                  <div className="flex flex-wrap gap-4">
                    {[
                      { label: "Innovation", icon: <Star className="w-4 h-4" /> },
                      { label: "Reliability", icon: <CircleCheck className="w-4 h-4" /> },
                      { label: "Customer Satisfaction", icon: <Smile className="w-4 h-4" /> }
                    ].map((badge, i) => (
                      <div key={i} className="bg-white px-5 py-2.5 rounded-full flex items-center gap-2 shadow-sm text-gray-700 font-semibold text-sm">
                        <span className="text-brand-primary">{badge.icon}</span>
                        {badge.label}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </section> */}
            {/* 5. Vision Section (New - Bottom part of your image) */}
                  {/* <section className="pt-16 px-4 lg:px-8 text-center bg-white">
                    <motion.div 
                      initial={{ opacity: 0, y: 30 }} 
                      whileInView={{ opacity: 1, y: 0 }} 
                      viewport={{ once: true }}
                      className="max-w-4xl mx-auto"
                    >
                      <h2 className="text-brand-primary text-5xl md:text-6xl font-bold mb-8">Our Vision</h2>
                      <p className="text-brand-textMuted text-xl leading-relaxed">
                        As we grow, our vision is to establish RELDA as one of India's most trusted home 
                        appliance brands, delivering world-class products backed by industry expertise 
                        and a customer-first approach.
                      </p>
                    </motion.div>
                  </section> */}
    </div>
  );
};

export default AboutAndLeadership;