import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { Modal } from '../common/Modal';

export const DocumentUploadModal = ({ isOpen, onClose, onUploadComplete, showToast }) => {
  const [docType, setDocType] = useState('External Lab Report');
  const [docTitle, setDocTitle] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      if (!docTitle) setDocTitle(file.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!docTitle.trim() || !fileName) return;

    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      const newDoc = {
        id: `DOC-UP-${Date.now().toString().slice(-4)}`,
        title: docTitle.trim(),
        date: new Date().toISOString().split('T')[0],
        issuedBy: `Patient Uploaded (${docType})`,
        summary: `Patient record uploaded on ${new Date().toLocaleDateString('en-IN')}. Verified copy attached.`,
        fileType: 'PDF',
        fileSize: fileSize || '1.2 MB'
      };

      if (onUploadComplete) onUploadComplete(newDoc);
      if (showToast) showToast(`Document "${docTitle}" uploaded successfully to your health records!`, 'success');
      onClose();
    }, 600);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Medical Records & Documents"
      maxWidth="500px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
          Upload outside pathology records, prior clinical discharge summaries, or your health insurance card for doctor reference.
        </p>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Document Category</label>
          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.86rem' }}
          >
            <option value="External Lab Report">Prior Pathology / Blood Test</option>
            <option value="Health Insurance Card">Health Insurance Card</option>
            <option value="Imaging / X-Ray / MRI">Imaging / Radiology Report</option>
            <option value="Discharge Summary">Hospital Discharge Summary</option>
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Document Title</label>
          <input
            type="text"
            placeholder="e.g. 2025 Fasting Blood Sugar Report"
            value={docTitle}
            onChange={(e) => setDocTitle(e.target.value)}
            required
            style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.86rem' }}
          />
        </div>

        {/* Drag-drop file container */}
        <div 
          style={{
            border: '2px dashed var(--primary-teal)',
            backgroundColor: 'var(--warm-cream)',
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center',
            cursor: 'pointer'
          }}
          onClick={() => document.getElementById('medical-doc-file-input')?.click()}
        >
          <input
            id="medical-doc-file-input"
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <Upload size={28} color="var(--primary-teal)" style={{ margin: '0 auto 8px' }} />
          {fileName ? (
            <div style={{ fontSize: '0.86rem', fontWeight: '700', color: 'var(--deep-teal)' }}>
              Selected: {fileName} ({fileSize})
            </div>
          ) : (
            <>
              <div style={{ fontSize: '0.86rem', fontWeight: '700', color: 'var(--text-main)' }}>
                Click to browse or drop your document here
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                PDF, JPG or PNG • Up to 15MB
              </div>
            </>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '6px' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary btn-sm" disabled={isUploading}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary btn-sm" disabled={isUploading || !fileName}>
            {isUploading ? 'Uploading...' : 'Upload Document'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default DocumentUploadModal;
