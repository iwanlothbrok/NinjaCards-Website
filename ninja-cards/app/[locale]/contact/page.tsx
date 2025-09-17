"use client";

import React from 'react';
import ContactForm from './ContactForm';
import Header from '../components/layout/Header';
import { useTranslations } from 'next-intl';

const Contact: React.FC = () => {
    const t = useTranslations("Contact");

    return (
        <>
            <Header
                pageInformation={t("pageInformation")}
                textOne={t("textOne")}
                textTwo={t("textTwo")}
                textThree={t("textThree")}
            />
            <main className="flex flex-col items-center justify-center px-4">
                <ContactForm />
            </main>
        </>
    );
};

export default Contact;
