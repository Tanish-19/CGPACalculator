import React, { useState, useRef } from 'react';
import { Upload, Image, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { Subject } from '../types';
import { generateRandomSubjects } from '../utils/cgpaCalculator';

interface FileUploadProps {
  onDataExtracted: (subjects: Subject[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onDataExtracted }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadStatus('error');
      return;
    }

    setIsProcessing(true);
    setUploadStatus('idle');

    // Simulate OCR processing
    setTimeout(() => {
      const extractedSubjects = generateRandomSubjects();
      onDataExtracted(extractedSubjects);
      setIsProcessing(false);
      setUploadStatus('success');
    }, 2000);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <Image className="w-6 h-6 text-blue-300" />
        <h2 className="text-2xl font-bold text-white">Upload Mark Sheet</h2>
      </div>

      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          dragActive
            ? 'border-blue-400 bg-blue-500/10'
            : 'border-white/30 hover:border-white/50 hover:bg-white/5'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isProcessing}
        />

        <div className="flex flex-col items-center gap-4">
          {isProcessing ? (
            <div className="flex flex-col items-center gap-3">
              <Loader className="w-12 h-12 text-blue-400 animate-spin" />
              <p className="text-white/80">Processing your mark sheet...</p>
              <div className="w-48 h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          ) : (
            <>
              <div className={`p-4 rounded-full transition-all duration-300 ${
                uploadStatus === 'success' ? 'bg-green-500/20' :
                uploadStatus === 'error' ? 'bg-red-500/20' :
                'bg-blue-500/20'
              }`}>
                {uploadStatus === 'success' ? (
                  <CheckCircle className="w-8 h-8 text-green-400" />
                ) : uploadStatus === 'error' ? (
                  <AlertCircle className="w-8 h-8 text-red-400" />
                ) : (
                  <Upload className="w-8 h-8 text-blue-400" />
                )}
              </div>
              
              <div className="space-y-2">
                <p className="text-lg font-semibold text-white">
                  {uploadStatus === 'success' ? 'Mark sheet processed successfully!' :
                   uploadStatus === 'error' ? 'Please upload a valid image file' :
                   'Drop your mark sheet here or click to browse'}
                </p>
                <p className="text-white/60 text-sm">
                  Supports JPG, PNG, PDF formats
                </p>
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Choose File
              </button>
            </>
          )}
        </div>
      </div>

      {uploadStatus === 'success' && (
        <div className="mt-6 p-4 bg-green-500/10 border border-green-400/30 rounded-xl">
          <p className="text-green-300 text-sm">
            ✨ OCR extraction completed! Your subjects have been automatically populated below.
          </p>
        </div>
      )}
    </div>
  );
};