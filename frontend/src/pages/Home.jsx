import React from 'react'
import Hero from "../components/sections/HomeHero";
import Featured from "../components/sections/HomeFeatured";
import CTA from "../components/sections/HomeCTA";
import Subscription from "../components/sections/HomeSubscription";
import Footer from "../components/layout/Footer"
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <>
      {/* hero page  */}
      <Hero />
      {/* Section page  Fearured Items */}
      <Featured />
      {/* CTA section starts here */}
      <CTA />
      {/* next sextion starts here Billing Section */}
      <Subscription />
      {/* Footer starts from here */}
      <Footer/>
    </>
  )
}

export default Home
