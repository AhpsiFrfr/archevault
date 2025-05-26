import React, { useRef, useState, useCallback, DragEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, File, Image as ImageIcon, FileText, FileArchive, FileVideo, FileAudio, FileCode, FileSpreadsheet, FileDigit, FileCheck2, UploadCloud } from 'lucide-react';

interface FileWithPreview extends File {
  preview?: string;
  uploadProgress?: number;
  error?: string;
  id: string;
}

export interface FileUploadProps {
  multiple?: boolean;
  accept?: string;
  maxSizeMB?: number;
  onFilesSelected: (files: FileWithPreview[]) => void;
  onUploadProgress?: (fileId: string, progress: number) => void;
  onUploadComplete?: (fileId: string, url: string) => void;
  onUploadError?: (fileId: string, error: Error) => void;
  className?: string;
  disabled?: boolean;
}

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB default
const ACCEPTED_FILE_TYPES = 'image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.zip,.rar,.7z,.txt,.md,.json,.js,.jsx,.ts,.tsx,.css,.scss,.html,.py,.java,.cpp,.c,.cs,.php,.rb,.go,.rs,.swift,.kt';

export const FileUpload: React.FC<FileUploadProps> = ({
  multiple = true,
  accept = ACCEPTED_FILE_TYPES,
  maxSizeMB = 50,
  onFilesSelected,
  onUploadProgress,
  onUploadComplete,
  onUploadError,
  className = '',
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (file: File) => {
    const fileType = file.type.split('/')[0];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    switch (fileType) {
      case 'image':
        return <ImageIcon className="h-5 w-5 text-blue-500" />;
      case 'video':
        return <FileVideo className="h-5 w-5 text-purple-500" />;
      case 'audio':
        return <FileAudio className="h-5 w-5 text-green-500" />;
      default:
        switch (fileExtension) {
          case 'pdf':
            return <FileText className="h-5 w-5 text-red-500" />;
          case 'zip':
          case 'rar':
          case '7z':
            return <FileArchive className="h-5 w-5 text-yellow-500" />;
          case 'xls':
          case 'xlsx':
          case 'csv':
            return <FileSpreadsheet className="h-5 w-5 text-green-600" />;
          case 'doc':
          case 'docx':
            return <FileText className="h-5 w-5 text-blue-600" />;
          case 'js':
          case 'jsx':
          case 'ts':
          case 'tsx':
          case 'py':
          case 'java':
          case 'cpp':
          case 'c':
          case 'cs':
          case 'php':
          case 'rb':
          case 'go':
          case 'rs':
          case 'swift':
          case 'kt':
            return <FileCode className="h-5 w-5 text-yellow-600" />;
          default:
            return <File className="h-5 w-5 text-gray-500" />;
        }
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      return {
        valid: false,
        error: `File size exceeds ${maxSizeMB}MB`,
      };
    }

    // Additional validation can be added here (e.g., file type validation)
    return { valid: true };
  };

  const processFiles = useCallback(
    (fileList: FileList | File[]) => {
      const newFiles: FileWithPreview[] = [];
      const filesArray = Array.from(fileList);

      filesArray.forEach((file) => {
        const validation = validateFile(file);
        if (!validation.valid) {
          const fileWithError: FileWithPreview = {
            ...file,
            id: Math.random().toString(36).substr(2, 9),
            error: validation.error,
          };
          newFiles.push(fileWithError);
          return;
        }

        const fileWithPreview: FileWithPreview = {
          ...file,
          id: Math.random().toString(36).substr(2, 9),
          preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
          uploadProgress: 0,
        };

        newFiles.push(fileWithPreview);
      });

      setFiles((prevFiles) => (multiple ? [...prevFiles, ...newFiles] : newFiles));
      onFilesSelected(newFiles);

      // Start upload simulation (replace with actual upload logic)
      if (onUploadProgress) {
        simulateUpload(newFiles, onUploadProgress, onUploadComplete, onUploadError);
      }
    },
    [multiple, onFilesSelected, onUploadComplete, onUploadError, onUploadProgress]
  );

  const simulateUpload = (
    filesToUpload: FileWithPreview[],
    progressCallback: (fileId: string, progress: number) => void,
    completeCallback?: (fileId: string, url: string) => void,
    errorCallback?: (fileId: string, error: Error) => void
  ) => {
    setIsUploading(true);
    
    filesToUpload.forEach((file) => {
      if (file.error) return;
      
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          // Simulate completion
          setTimeout(() => {
            if (completeCallback) {
              completeCallback(file.id, `https://example.com/uploads/${file.name}`);
            }
            
            // Check if all uploads are complete
            const allComplete = filesToUpload.every(f => 
              f.uploadProgress === 100 || f.error
            );
            if (allComplete) {
              setIsUploading(false);
            }
          }, 300);
        }
        
        progressCallback(file.id, Math.min(progress, 100));
      }, 100);
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      // Reset the input value to allow selecting the same file again
      e.target.value = '';
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (disabled) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (fileId: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Clean up object URLs to avoid memory leaks
  React.useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files]);

  return (
    <div className={`w-full ${className}`}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
        className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 bg-white dark:bg-gray-800'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="space-y-2">
          <UploadCloud className={`h-10 w-10 mx-auto ${
            isDragging ? 'text-blue-500' : 'text-gray-400'
          }`} />
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium text-blue-600 dark:text-blue-400">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {`${multiple ? 'Multiple files up to' : 'File up to'} ${maxSizeMB}MB`}
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4 space-y-3">
          {files.map((file) => (
            <div
              key={file.id}
              className="relative flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              {/* File Preview */}
              {file.preview ? (
                <div className="flex-shrink-0 h-10 w-10 rounded overflow-hidden">
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded">
                  {getFileIcon(file)}
                </div>
              )}

              {/* File Info */}
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {file.name}
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                    {formatFileSize(file.size)}
                  </span>
                </div>

                {/* Progress Bar */}
                {file.uploadProgress !== undefined && file.uploadProgress < 100 && !file.error && (
                  <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full"
                      style={{ width: `${file.uploadProgress}%` }}
                    ></div>
                  </div>
                )}

                {/* Error Message */}
                {file.error && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {file.error}
                  </p>
                )}

                {/* Success Indicator */}
                {file.uploadProgress === 100 && (
                  <div className="flex items-center mt-1">
                    <FileCheck2 className="h-3.5 w-3.5 text-green-500 mr-1" />
                    <span className="text-xs text-green-600 dark:text-green-400">
                      Upload complete
                    </span>
                  </div>
                )}
              </div>

              {/* Remove Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(file.id);
                }}
                className="ml-2 p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                disabled={isUploading && !file.error}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove file</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
