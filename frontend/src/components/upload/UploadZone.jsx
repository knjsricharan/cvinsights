import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File, AlertCircle, Loader2 } from 'lucide-react';

const UploadZone = ({ onUpload, isUploading, isAnalyzing }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    if (fileRejections.length > 0) {
      setSelectedFile(null);
      return;
    }
    
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      onUpload(file);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/html': ['.html', '.htm']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false
  });

  const isLoading = isUploading || isAnalyzing;

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200
          ${isDragActive ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'}
          ${fileRejections.length > 0 ? 'border-red-400 bg-red-50/50' : ''}
          ${isLoading ? 'opacity-70 pointer-events-none' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          {isLoading ? (
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
          ) : selectedFile ? (
            <File className="w-12 h-12 text-indigo-500" />
          ) : (
            <UploadCloud className={`w-12 h-12 ${isDragActive ? 'text-indigo-500' : 'text-slate-400'}`} />
          )}
          
          <div className="space-y-1">
            <h3 className="text-lg font-medium text-slate-700">
              {isLoading ? (
                isAnalyzing ? 'AI is analyzing your resume...' : 'Extracting text...'
              ) : selectedFile ? (
                selectedFile.name
              ) : isDragActive ? (
                'Drop it here!'
              ) : (
                'Drag & drop your resume'
              )}
            </h3>
            
            {!isLoading && !selectedFile && (
              <p className="text-sm text-slate-500">
                PDF, DOCX, or HTML (Max 5MB)
              </p>
            )}
          </div>

          {fileRejections.length > 0 && (
            <div className="flex items-center space-x-2 text-red-500 text-sm mt-4">
              <AlertCircle className="w-4 h-4" />
              <span>{fileRejections[0].errors[0].message}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadZone;
