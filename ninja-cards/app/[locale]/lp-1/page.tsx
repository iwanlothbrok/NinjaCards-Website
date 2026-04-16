import SalesLandingPage from "../components/sales/SalesLandingPage";

export default function LP1Page({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return <SalesLandingPage locale={locale} source="lp" />;
}
