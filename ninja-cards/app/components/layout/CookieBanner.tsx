'use client';

import CookieConsent from 'react-cookie-consent';
import Link from 'next/link';

export default function CookieBanner() {
    return (
        <CookieConsent
            location="bottom"
            buttonText="Разбрах"
            declineButtonText="Отказ"
            enableDeclineButton
            style={{ background: "#2B373B" }}
            buttonStyle={{ color: "#fff", background: "#ff8000", borderRadius: "4px", padding: "8px 16px" }}
            declineButtonStyle={{ color: "#fff", background: "#888", borderRadius: "4px", padding: "8px 16px", marginLeft: "8px" }}
            expires={150}
        >
            Ние използваме бисквитки за да подобрим вашето преживяване.{" "}
            <Link href="/privacy/CookiePolicy" className="underline text-white">
                Прочетете повече
            </Link>
        </CookieConsent>
    );
}
