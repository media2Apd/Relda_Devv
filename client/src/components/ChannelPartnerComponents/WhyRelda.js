import React from "react";
import { motion } from "framer-motion";
import { Asterisk } from "lucide-react";
import whyReldaImage from "../../assest/ChannelPartner/why-relda-india.webp";

const whyItems = [
  {
    title: "Rapidly Growing Market",
    description:
      "The home and kitchen appliance industry in India is expanding at 25% CAGR, making it the perfect time to invest.",
  },
  {
    title: "Trusted Indian Brand",
    description:
      "RELDA India is proudly made in India, combining quality, reliability, and affordability for every household.",
  },
  {
    title: "Innovative & Versatile Products",
    description:
      "From Chimneys, Hobs, Mixers, to LED TVs and more, we offer a wide range of products designed for modern Indian homes.",
  },
];

const WhyRelda = () => {
  return (
    <section className="bg-white px-4 py-12 sm:px-6 md:py-16 lg:px-10 lg:py-20">
      <div className="mx-auto w-full max-w-[1500px]">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
          className="text-center"
        >
          <h2
            className="
            text-3xl
            sm:text-4xl
            md:text-5xl
            lg:text-6xl
            font-light
            tracking-tight
            text-black
            "
          >
            Why{" "}
            <span className="font-normal text-[#E60000]">
              RELDA India?
            </span>
          </h2>
        </motion.div>


        {/* Main Content */}
        <div
          className="
          mt-10
          grid
          grid-cols-1
          items-center
          gap-10
          lg:grid-cols-2
          lg:gap-16
          lg:mt-14
          "
        >


          {/* Left Content */}
          <div className="space-y-8 sm:space-y-10">

            {whyItems.map((item, index) => (

              <motion.div
                key={item.title}
                initial={{
                  opacity:0,
                  x:-40
                }}
                whileInView={{
                  opacity:1,
                  x:0
                }}
                viewport={{
                  once:true,
                  amount:0.3
                }}
                transition={{
                  duration:0.5,
                  delay:index * 0.15
                }}
                className="
                flex
                items-start
                gap-4
                "
              >


                {/* Icon */}
                <div
                  className="
                  flex
                  shrink-0
                  items-center
                  justify-center
                  h-10
                  w-10
                  rounded-full
                  bg-[#E60000]
                  text-white
                  "
                >
                  <Asterisk
                    className="w-6 h-6"
                    strokeWidth={2}
                  />
                </div>


                {/* Text */}
                <div className="flex-1">

                  <h3
                    className="
                    text-lg
                    sm:text-xl
                    md:text-2xl
                    font-semibold
                    text-black
                    "
                  >
                    {item.title}
                  </h3>


                  <p
                    className="
                    mt-2
                    text-sm
                    sm:text-base
                    leading-7
                    text-gray-600
                    "
                  >
                    {item.description}
                  </p>

                </div>


              </motion.div>

            ))}

          </div>



          {/* Right Image */}
          <motion.div

            initial={{
              opacity:0,
              scale:0.95
            }}

            whileInView={{
              opacity:1,
              scale:1
            }}

            viewport={{
              once:true,
              amount:0.3
            }}

            transition={{
              duration:0.6
            }}

            className="
            w-full
            "
          >

            <img

              src={whyReldaImage}

              alt="Why RELDA India"

              className="
              w-full
              h-[230px]
              sm:h-[320px]
              md:h-[400px]
              lg:h-[450px]
              xl:h-[500px]
              object-cover
              rounded-xl
              "
            />

          </motion.div>


        </div>

      </div>
    </section>
  );
};


export default WhyRelda;