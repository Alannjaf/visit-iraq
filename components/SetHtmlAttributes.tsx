"use client";

import { useEffect } from 'react';

interface SetHtmlAttributesProps {
  lang: string;
  dir: 'ltr' | 'rtl';
}

export function SetHtmlAttributes({ lang, dir }: SetHtmlAttributesProps) {
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  return null;
}

