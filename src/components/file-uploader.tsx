import { useState, useRef } from 'react';

interface FileUploaderProps {
  onFileSelect: (file: File | null) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect }) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        setFileName(file.name);
        onFileSelect(file);
      } else {
        alert('Please upload a PDF file');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        setFileName(file.name);
        onFileSelect(file);
      } else {
        alert('Please upload a PDF file');
      }
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
          dragActive 
            ? 'border-blue-500 bg-blue-500/10 backdrop-blur-sm scale-[1.02]' 
            : 'border-border hover:border-blue-400 hover:bg-muted/30'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          onChange={handleChange}
          className="hidden"
        />
        
        {fileName ? (
          <div className="space-y-3">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 text-green-600 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">Selected file:</p>
            <p className="font-medium text-foreground bg-card/50 rounded-lg p-2 border">{fileName}</p>
            <button
              type="button"
              onClick={() => {
                setFileName('');
                onFileSelect(null);
              }}
              className="text-sm text-red-500 hover:text-red-700 transition-colors"
            >
              Remove file
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 text-muted-foreground">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                <button
                  type="button"
                  onClick={onButtonClick}
                  className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
                >
                  Click to upload
                </button>
                {' '}or drag and drop
              </p>
              <p className="text-xs text-muted-foreground mt-1">PDF files only</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader; 