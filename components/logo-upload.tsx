'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LogoUploadProps {
  onLogoChange: (logo: string | null) => void;
  logo: string | null;
}

export function LogoUpload({ onLogoChange, logo }: LogoUploadProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);
      const file = acceptedFiles[0];
      
      if (!file) return;
      
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }
      
      // Check file size (max 1MB)
      if (file.size > 1024 * 1024) {
        setError('File size should be less than 1MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        onLogoChange(dataUrl);
      };
      reader.readAsDataURL(file);
    },
    [onLogoChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.svg'],
    },
    maxFiles: 1
  });
  
  const removeLogo = () => {
    onLogoChange(null);
  };

  return (
    <div className="space-y-2">
      {!logo ? (
        <div 
          {...getRootProps()} 
          className={cn(
            "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors",
            isDragActive 
              ? "border-primary/70 bg-primary/5" 
              : "border-border hover:border-primary/50 hover:bg-muted"
          )}
        >
          <input {...getInputProps()} />
          <Upload className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-sm text-center text-muted-foreground">
            {isDragActive ? 'Drop the logo here' : 'Drag & drop a logo, or click to select'}
          </p>
          <p className="text-xs text-center text-muted-foreground mt-1">
            PNG, JPG or SVG (max. 1MB)
          </p>
          {error && <p className="text-xs text-destructive mt-2">{error}</p>}
        </div>
      ) : (
        <div className="border rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src={logo} 
              alt="Logo preview" 
              className="h-12 w-12 object-contain mr-4"
            />
            <p className="text-sm truncate max-w-[150px]">Logo uploaded</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={removeLogo}
            className="text-muted-foreground hover:text-destructive"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
}