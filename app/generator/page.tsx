import { QRCodeCustomizer } from '@/components/qr-code-customizer';

export default function GeneratorPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">QR Code Generator</h1>
          <p className="text-muted-foreground">
            Customize your QR code with advanced styling options
          </p>
        </div>
        
        <QRCodeCustomizer />
      </div>
    </div>
  );
}