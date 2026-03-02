import React from 'react'
import HeroJoin from '../components/joinus/HeroJoin'
import ChooseMembership from '../components/joinus/ChooseMembership'
import Bonuses from '../components/joinus/Bonuses'
import ExploreFeatures from '../components/joinus/ExploreFeatures'
import ComparePlans from '../components/joinus/ComparePlans'
import FreeTrial from '../components/joinus/FreeTrial'
import FAQSection from '../components/layout/FAQSection'
export default function page() {
    return (
        <div>
            <HeroJoin />
            <ChooseMembership />
            <Bonuses />
            <ExploreFeatures />
            <ComparePlans />
            <FreeTrial />
            <FAQSection />
        </div >
    )
}
