"use client";

import React from 'react';
import ContactForm from './ContactForm';
import Header from '../components/layout/Header';

const Contact: React.FC = () => {
    return (
        <>
            <Header pageInformation='Контакт' textOne='Обратна връзка' textTwo='24/7 поддръжка' textThree='Въпроси' />
            <main className="flex flex-col items-center justify-center ">
                <ContactForm />
            </main>
        </>
    );
};

export default Contact;
