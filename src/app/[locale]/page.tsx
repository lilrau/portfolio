import { notFound } from "next/navigation";
import HomePage from "../../components/HomePage";
import { getDictionary, hasLocale } from "../../i18n";

export default async function Page({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  return <HomePage dict={getDictionary(locale)} locale={locale} />;
}
