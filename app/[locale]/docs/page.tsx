'use client'
import { title } from "@/components/primitives";
import { useTranslations } from 'next-intl';

export const runtime = 'edge';

export default function DocsPage() {
	const t = useTranslations("header");

	return (
		<div>
			<h1 className={title()}>Docs{t('title')}</h1>
		</div>
	);
}
