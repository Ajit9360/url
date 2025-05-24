'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QRCode } from '@/types';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase';
import { BarChart3, QrCode, Trash } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { QRCodePreview } from '@/components/qr-code-preview';

export default function DashboardPage() {
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/auth');
      return;
    }

    const fetchQrCodes = async () => {
      const { data, error } = await supabase
        .from('qr_codes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching QR codes:', error);
      } else {
        setQrCodes(data as QRCode[]);
      }
      
      setLoading(false);
    };

    fetchQrCodes();
  }, [user, router]);

  const deleteQRCode = async (id: string) => {
    const { error } = await supabase
      .from('qr_codes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting QR code:', error);
    } else {
      setQrCodes(qrCodes.filter(qr => qr.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My QR Codes</h1>
          <p className="text-muted-foreground">
            Manage and track your saved QR codes
          </p>
        </div>
        <Button onClick={() => router.push('/generator')}>
          Create New QR Code
        </Button>
      </div>

      {qrCodes.length === 0 ? (
        <Card className="w-full p-8 flex flex-col items-center justify-center">
          <QrCode className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No QR codes yet</h2>
          <p className="text-muted-foreground mb-4 text-center max-w-md">
            You haven't created any QR codes yet. Start by creating your first QR code.
          </p>
          <Button onClick={() => router.push('/generator')}>
            Create QR Code
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {qrCodes.map((qr) => (
            <Card key={qr.id} className="overflow-hidden flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="truncate">{qr.title}</CardTitle>
                <CardDescription className="truncate">{qr.value}</CardDescription>
              </CardHeader>
              <CardContent className="pb-4 flex-grow">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-32 h-32">
                    <QRCodePreview options={qr.options} />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {qr.scan_count} scans
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        // Redirect to generator page with the selected QR code data
                        router.push(`/generator?id=${qr.id}`);
                      }}
                    >
                      Edit
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            QR code.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => deleteQRCode(qr.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}