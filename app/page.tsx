import Link from 'next/link';
import { QrCode, Sparkles, Upload, BarChart4 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Create Advanced QR Codes with <span className="text-primary">QR Studio</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Customize every aspect of your QR codes with powerful styling options, track scans, and more.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/generator">
                <Button size="lg" className="animate-pulse">
                  Start Creating
                </Button>
              </Link>
              <Link href="/auth">
                <Button variant="outline" size="lg">
                  Sign Up Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="mx-auto grid max-w-5xl items-center gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-muted-foreground/10 p-3">
                <QrCode className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Advanced Customization
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Fine-tune every aspect of your QR codes with our comprehensive styling options. Customize dots, corners, and add your own logo.
              </p>
            </div>
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-muted-foreground/10 p-3">
                <Sparkles className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Beautiful Designs
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Create QR codes that stand out with beautiful designs and color schemes that match your brand.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="mx-auto grid max-w-5xl items-center gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-muted-foreground/10 p-3">
                <Upload className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Custom Logo Upload
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Upload your logo or image to be seamlessly integrated into your QR codes, making them uniquely yours.
              </p>
            </div>
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-muted-foreground/10 p-3">
                <BarChart4 className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Track Scans
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Monitor how many times your QR codes are scanned with our built-in analytics for registered users.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to create your first QR code?
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Get started for free and explore all the customization options.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/generator">
                <Button size="lg">
                  Create QR Code
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}