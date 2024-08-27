import React from 'react';

const Features: React.FC = () => {
    return (
        <div className="py-16">
            {/* First Section */}
            <div className="container mx-auto flex flex-col md:flex-row items-center mb-16 px-6">
                <div className="md:w-1/2 md:pr-10">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Share Your Contact</h2>
                    <p className="text-gray-600 mb-6">
                        Tapitag NFC digital business card, sharing your contact information is effortless.
                        You can simply tap your phone against another NFC-enabled device, and your contact details
                        will be instantly shared. You can also save the contact details of other Tapitag users with a
                        single tap, making networking easier and more efficient than ever before.
                    </p>
                </div>
                <div className="md:w-1/2">
                    <img src="/path-to-your-image1.jpg" alt="Share Your Contact" className="w-full rounded-lg shadow-md" />
                </div>
            </div>

            {/* Second Section */}
            <div className="container mx-auto flex flex-col md:flex-row items-center px-6">
                <div className="md:w-1/2 md:order-2 md:pl-10">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Update Your Details Anytime</h2>
                    <p className="text-gray-600 mb-6">
                        Tapitag NFC digital business card profile allows you to update your contact information
                        anytime, making it convenient to keep your network updated. With just a tap of your phone,
                        your contacts can access your latest information instantly. Stay connected with ease and make
                        a lasting impression with Tapitag's seamless and modern approach to business cards.
                    </p>
                </div>
                <div className="md:w-1/2 md:order-1">
                    <img src="/path-to-your-image2.jpg" alt="Update Your Details" className="w-full rounded-lg shadow-md" />
                </div>
            </div>
        </div>
    );
};

export default Features;
