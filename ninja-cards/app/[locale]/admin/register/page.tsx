import { redirect } from 'next/navigation';

export default function AdminRegisterRedirect({
    params,
}: {
    params: { locale: string };
}) {
    redirect(`/${params.locale}/admin?module=users`);
}
