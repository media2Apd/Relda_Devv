import React from 'react'
import ChannelPartnerHero from '../components/ChannelPartnerComponents/ChannelPartnerHero'
import BrandShop from '../components/ChannelPartnerComponents/BrandShop'
import Store from '../components/ChannelPartnerComponents/Store'
import BussinessJourney from '../components/ChannelPartnerComponents/BussinessJourney'
import OurStory from '../components/ChannelPartnerComponents/OurStory'
import Product from '../components/ChannelPartnerComponents/Product'
import Support from '../components/ChannelPartnerComponents/Support'
import WhyRelda from '../components/ChannelPartnerComponents/WhyRelda'
import WhyJoin from '../components/ChannelPartnerComponents/WhyJoin'
import BrandShopForm from '../components/ChannelPartnerComponents/Brandshopform'


const ChannelPartner = () => {
  return (
    <div>
      <ChannelPartnerHero />
      <BrandShop />
      <Store />
      <BussinessJourney />
      <OurStory />
      <Product />
      <Support />
      <WhyRelda />
      <WhyJoin />
      <BrandShopForm/>
    </div>
  )
}

export default ChannelPartner
