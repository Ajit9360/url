'use client';

import { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import { Card } from '@/components/ui/card';
import { QRCodeOptions } from '@/types';

interface QRCodePreviewProps {
  options: QRCodeOptions;
}

export function QRCodePreview({ options }: QRCodePreviewProps) {
  const [mounted, setMounted] = useState(false);
  
  // This effect ensures the component only renders on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Card className="flex items-center justify-center w-full aspect-square max-w-[350px] mx-auto bg-muted animate-pulse">
        <div className="text-sm text-muted-foreground">Loading QR Code...</div>
      </Card>
    );
  }

  return (
    <Card className="flex items-center justify-center w-full p-4 aspect-square max-w-[350px] mx-auto">
      <QRCode
        value={options.value || 'https://example.com'}
        size={options.size}
        level={options.level}
        bgColor={options.bgColor}
        fgColor={options.fgColor}
        includeMargin={options.includeMargin}
        imageSettings={options.imageSettings}
        style={options.style}
      />
    </Card>
  );
}