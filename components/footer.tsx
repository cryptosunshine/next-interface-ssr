"use client";

import { useState, useMemo } from "react";
import { useRouter, usePathname } from 'next-intl/client';

import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import { LocaleConfig } from "@/locale"

const regex = /^\/([a-zA-Z]+)/;

export default function Footer() {
    const matches = regex.exec(location.pathname);
    const [selectedKey, setSelectedKey] = useState(matches && matches.length > 1 && matches[1] || LocaleConfig.defaultLocale);


    const router = useRouter();
    const pathname = usePathname();

    const handleChange = (e: any) => {
        router.push(pathname, { locale: e.anchorKey });
        setSelectedKey(e.anchorKey);

    };

    const defaultLabel = useMemo(() => {
        const match = LocaleConfig.locales.filter(e => e.value === selectedKey);
        return match && match.length > 0 && match[0].label || LocaleConfig.defaultLocale;
    }, [selectedKey])
    return (
        <footer className="w-full flex items-center justify-center py-3">
            <Dropdown>
                <DropdownTrigger>
                    <Button
                        variant="bordered"
                        className="capitalize"
                    >
                        {defaultLabel}
                    </Button>
                </DropdownTrigger>
                <DropdownMenu
                    aria-label="Select language"
                    variant="flat"
                    disallowEmptySelection
                    selectionMode="single"
                    selectedKeys={selectedKey}
                    onSelectionChange={handleChange}
                >
                    {LocaleConfig.locales.map((lang) => (
                        <DropdownItem key={lang.value} value={lang.value}>
                            {lang.label}
                        </DropdownItem>
                    ))}
                </DropdownMenu>
            </Dropdown>

        </footer>
    )
}