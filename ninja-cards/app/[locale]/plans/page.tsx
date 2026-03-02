import React from 'react'
import ChoosePlan from '../components/plans/ChoosePlan'
import ComparePlans from '../components/joinus/ComparePlans'
import ExploreFeatures from '../components/joinus/ExploreFeatures'
import PlansFaq from '../components/joinus/PlansFaq'
import FreeTrial from '../components/joinus/FreeTrial'
export default function page() {
    return (
        <div>
            <div id='pricing'>
                <ComparePlans />
            </div>
            <ExploreFeatures />
            <PlansFaq />
            <FreeTrial />
            {/* <ChoosePlan /> */}
        </div>
    )
}
