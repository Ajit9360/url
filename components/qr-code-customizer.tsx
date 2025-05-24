'use client';

import { useState } from 'react';
import { QRCodeOptions } from '@/types';
import { QRCodePreview } from '@/components/qr-code-preview';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { LogoUpload } from '@/components/logo-upload';
import { Check, Download, Link, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { saveAs } from 'file-saver';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

const formSchema = z.object({
  value: z.string().min(1, 'URL is required'),
  title: z.string().min(1, 'Title is required').optional(),
  size: z.number().min(128).max(512),
  level: z.enum(['L', 'M', 'Q', 'H']),
  bgColor: z.string(),
  fgColor: z.string(),
  includeMargin: z.boolean(),
  dotsType: z.enum(['rounded', 'dots', 'classy', 'classy-rounded', 'square', 'extra-rounded']),
  dotsColor: z.string().optional(),
  cornersSquareType: z.enum(['default', 'dot', 'square', 'extra-rounded']),
  cornersSquareColor: z.string().optional(),
  cornersDotType: z.enum(['default', 'dot', 'square']),
  cornersDotColor: z.string().optional(),
});

export function QRCodeCustomizer() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [logo, setLogo] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: 'https://example.com',
      size: 256,
      level: 'H',
      bgColor: '#FFFFFF',
      fgColor: '#000000',
      includeMargin: true,
      dotsType: 'square',
      cornersSquareType: 'default',
      cornersDotType: 'default',
    },
  });

  const watchedValues = form.watch();
  
  const qrCodeOptions: QRCodeOptions = {
    value: watchedValues.value,
    size: watchedValues.size,
    level: watchedValues.level,
    bgColor: watchedValues.bgColor,
    fgColor: watchedValues.fgColor,
    includeMargin: watchedValues.includeMargin,
    imageSettings: logo ? {
      src: logo,
      height: 40,
      width: 40,
      excavate: true,
    } : undefined,
    dots: {
      type: watchedValues.dotsType,
      color: watchedValues.dotsColor,
    },
    cornersSquareOptions: {
      type: watchedValues.cornersSquareType,
      color: watchedValues.cornersSquareColor,
    },
    cornersDotOptions: {
      type: watchedValues.cornersDotType,
      color: watchedValues.cornersDotColor,
    },
  };

  const handleLogoChange = (logoDataUrl: string | null) => {
    setLogo(logoDataUrl);
  };

  const saveQRCode = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to save your QR codes.',
        variant: 'destructive',
      });
      return;
    }

    const qrCode = {
      id: uuidv4(),
      user_id: user.id,
      title: values.title || 'Untitled QR Code',
      value: values.value,
      options: qrCodeOptions,
      scan_count: 0,
    };

    try {
      const { error } = await supabase.from('qr_codes').insert([qrCode]);
      
      if (error) {
        console.error('Supabase error:', error);
        toast({
          title: 'Error',
          description: `Failed to save QR code: ${error.message}`,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: 'QR code saved successfully.',
        });
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while saving the QR code.',
        variant: 'destructive',
      });
    }
  };

  const downloadQRCode = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      saveAs(blob, `qr-code-${new Date().toISOString().split('T')[0]}.png`);
    });
  };

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(watchedValues.value);
    toast({
      title: 'Link copied',
      description: 'QR code link copied to clipboard.',
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 max-w-6xl mx-auto">
      <Card className="overflow-hidden order-2 md:order-1">
        <CardContent className="p-6">
          <Form {...form}>
            <form className="space-y-6">
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="style">Style</TabsTrigger>
                  <TabsTrigger value="corners">Corners</TabsTrigger>
                </TabsList>
                <TabsContent value="content" className="space-y-4 mt-4">
                  <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>QR Code Content</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {user && (
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>QR Code Title (for saving)</FormLabel>
                          <FormControl>
                            <Input placeholder="My QR Code" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Size: {field.value}px</FormLabel>
                        <FormControl>
                          <Slider 
                            value={[field.value]} 
                            min={128} 
                            max={512}
                            step={1}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Error Correction Level</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="L">Low (7%)</SelectItem>
                            <SelectItem value="M">Medium (15%)</SelectItem>
                            <SelectItem value="Q">Quartile (25%)</SelectItem>
                            <SelectItem value="H">High (30%)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-2">
                    <FormLabel>Logo</FormLabel>
                    <LogoUpload onLogoChange={handleLogoChange} logo={logo} />
                  </div>
                </TabsContent>
                
                <TabsContent value="style" className="space-y-4 mt-4">
                  <FormField
                    control={form.control}
                    name="bgColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Background Color</FormLabel>
                        <div className="flex items-center gap-4">
                          <FormControl>
                            <Input type="color" {...field} className="w-12 h-8 p-1" />
                          </FormControl>
                          <FormControl>
                            <Input {...field} className="flex-1" />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="fgColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Foreground Color</FormLabel>
                        <div className="flex items-center gap-4">
                          <FormControl>
                            <Input type="color" {...field} className="w-12 h-8 p-1" />
                          </FormControl>
                          <FormControl>
                            <Input {...field} className="flex-1" />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="includeMargin"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Include Margin</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="dotsType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dots Style</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select style" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="rounded">Rounded</SelectItem>
                            <SelectItem value="dots">Dots</SelectItem>
                            <SelectItem value="classy">Classy</SelectItem>
                            <SelectItem value="classy-rounded">Classy Rounded</SelectItem>
                            <SelectItem value="square">Square</SelectItem>
                            <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="dotsColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dots Color (optional)</FormLabel>
                        <div className="flex items-center gap-4">
                          <FormControl>
                            <Input 
                              type="color" 
                              value={field.value || watchedValues.fgColor}
                              onChange={field.onChange}
                              className="w-12 h-8 p-1" 
                            />
                          </FormControl>
                          <FormControl>
                            <Input 
                              value={field.value || ''}
                              onChange={field.onChange}
                              placeholder={watchedValues.fgColor}
                              className="flex-1" 
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                <TabsContent value="corners" className="space-y-4 mt-4">
                  <FormField
                    control={form.control}
                    name="cornersSquareType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Corners Square Style</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select style" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="default">Default</SelectItem>
                            <SelectItem value="dot">Dot</SelectItem>
                            <SelectItem value="square">Square</SelectItem>
                            <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="cornersSquareColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Corners Square Color (optional)</FormLabel>
                        <div className="flex items-center gap-4">
                          <FormControl>
                            <Input 
                              type="color" 
                              value={field.value || watchedValues.fgColor}
                              onChange={field.onChange}
                              className="w-12 h-8 p-1" 
                            />
                          </FormControl>
                          <FormControl>
                            <Input 
                              value={field.value || ''}
                              onChange={field.onChange}
                              placeholder={watchedValues.fgColor}
                              className="flex-1" 
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="cornersDotType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Corners Dot Style</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select style" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="default">Default</SelectItem>
                            <SelectItem value="dot">Dot</SelectItem>
                            <SelectItem value="square">Square</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="cornersDotColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Corners Dot Color (optional)</FormLabel>
                        <div className="flex items-center gap-4">
                          <FormControl>
                            <Input 
                              type="color" 
                              value={field.value || watchedValues.fgColor}
                              onChange={field.onChange}
                              className="w-12 h-8 p-1" 
                            />
                          </FormControl>
                          <FormControl>
                            <Input 
                              value={field.value || ''}
                              onChange={field.onChange}
                              placeholder={watchedValues.fgColor}
                              className="flex-1" 
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>
              
              <div className="flex flex-wrap gap-2 justify-end mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={copyLinkToClipboard}
                >
                  <Link className="mr-2 h-4 w-4" />
                  Copy Link
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={downloadQRCode}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                
                {user && (
                  <Button 
                    type="button"
                    onClick={() => saveQRCode(form.getValues())}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <div className="flex flex-col items-center justify-center order-1 md:order-2">
        <div className="space-y-4 w-full max-w-md">
          <QRCodePreview options={qrCodeOptions} />
          {!user && (
            <div className="text-center p-4 rounded-lg bg-muted">
              <p className="text-sm mb-2">Sign in to save your QR codes and track scans</p>
              <Button variant="outline" size="sm" asChild>
                <a href="/auth">Sign In</a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}