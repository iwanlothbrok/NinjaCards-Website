import React from 'react';

import FeatureRow from './FeatureRow';

const FeaturesSection: React.FC = () => {
    return (
        <section className="bg-gray-50 dark:bg-gray-800">
            <div className="max-w-screen-xl px-4 py-8 mx-auto space-y-12 lg:space-y-20 lg:py-24 lg:px-6">
                <FeatureRow
                    title="Work with tools you already use"
                    description="Deliver great service experiences fast - without the complexity of traditional ITSM solutions. Accelerate critical development work, eliminate toil, and deploy changes with ease."
                    listItems={[
                        "Continuous integration and deployment",
                        "Development workflow",
                        "Knowledge management"
                    ]}
                    imgSrc="/feature01.png"
                />
                <FeatureRow
                    title="Сканирай и получи всички нунжи контакти"
                    description="Deliver great service experiences fast - without the complexity of traditional ITSM solutions. Accelerate critical development work, eliminate toil, and deploy changes with ease."
                    listItems={[
                        "Dynamic reports and dashboards",
                        "Templates for everyone",
                        "Development workflow",
                        "Limitless business automation",
                        "Knowledge management"
                    ]}
                    imgSrc="/ninjas-scanning-cards.png"
                    reverse
                />
            </div>
        </section>
    );
};

export default FeaturesSection;
