import React, { useMemo, useRef, useState } from 'react';
import { useVault, VaultDocument } from '../context/VaultContext';
import './Vault.css';

const CATS = ['All', 'Lab Reports', 'Prescriptions', 'Imaging', 'Insurance', 'Discharge Summary', 'Other'];

const CAT_STYLE: Record<string, { icon: string; color: string }> = {
  'Lab Reports': { icon: '🧪', color: '#c8f135' },
  'Prescriptions': { icon: '💊', color: '#e6b84a' },
  'Imaging': { icon: '🫁', color: '#ff7c45' },
  'Insurance': { icon: '🛡️', color: '#e6b84a' },
  'Discharge Summary': { icon: '🏥', color: '#c8f135' },
  'Other': { icon: '📄', color: '#7dedff' },
};

const MAX_FILE_BYTES = 4 * 1024 * 1024; // 4MB — keeps localStorage usage reasonable

const formatSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const VaultPage: React.FC = () => {
  const { documents, addDocument, deleteDocument } = useVault();
  const [activeCat, setActiveCat] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [showUpload, setShowUpload] = useState(false);

  const filtered = documents.filter(
    d => (activeCat === 'All' || d.cat === activeCat) &&
      (!search || d.name.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDownload = (doc: VaultDocument) => {
    const a = document.createElement('a');
    a.href = doc.dataUrl;
    a.download = doc.name;
    a.click();
  };

  const docCard = (doc: VaultDocument, list: boolean) => {
    const style = CAT_STYLE[doc.cat] || CAT_STYLE.Other;
    return (
      <div key={doc.id} className={list ? 'vault-doc-card-list' : 'vault-doc-card'}>
        <div className={`vault-doc-icon${list ? ' list' : ''}`} style={{ background: `${style.color}12`, borderColor: `${style.color}25` }}>
          {style.icon}
        </div>
        {list ? (
          <div style={{ flex: 1 }}>
            <div className="vault-doc-name">{doc.name}</div>
            <div className="vault-doc-meta">{doc.hospital || 'Hospital not specified'} · {formatDate(doc.date)} · {doc.sizeLabel}</div>
          </div>
        ) : (
          <>
            <div className="vault-cat-badge" style={{ background: `${style.color}10`, borderColor: `${style.color}25`, color: style.color }}>
              {doc.cat}
            </div>
            <div className="vault-doc-name">{doc.name}</div>
            <div className="vault-doc-meta">{doc.hospital || 'Hospital not specified'} · {formatDate(doc.date)} · {doc.sizeLabel}</div>
          </>
        )}
        {list && (
          <span className="vault-cat-badge" style={{ background: `${style.color}10`, borderColor: `${style.color}25`, color: style.color, marginBottom: 0 }}>
            {doc.cat}
          </span>
        )}
        <div className="vault-doc-actions">
          <button className="vault-doc-btn" onClick={() => handleDownload(doc)}>Download</button>
          <button className="vault-doc-btn vault-doc-btn-danger" onClick={() => deleteDocument(doc.id)}>Delete</button>
        </div>
      </div>
    );
  };

  return (
    <div className="vault-page">
      <div className="vault-page-header">
        <div className="vault-eyebrow">Secure Storage</div>
        <div className="vault-title">Document Vault</div>
        <div className="vault-sub">Upload, manage, and download your medical documents</div>
      </div>

      <div className="vault-wrap">
        <div className="vault-toolbar">
          <div className="vault-cats">
            {CATS.map(c => (
              <button
                key={c}
                className={`vault-cat-btn${activeCat === c ? ' active' : ''}`}
                onClick={() => setActiveCat(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="vault-toolbar-right">
            <div className="vault-search-wrap">
              <span className="vault-search-icon">⌕</span>
              <input
                className="vault-search-input"
                placeholder="Search documents..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="vault-view-toggle">
              <button className={`vault-view-btn${viewMode === 'grid' ? ' active' : ''}`} onClick={() => setViewMode('grid')} aria-label="Grid view">⊞</button>
              <button className={`vault-view-btn${viewMode === 'list' ? ' active' : ''}`} onClick={() => setViewMode('list')} aria-label="List view">≡</button>
            </div>
            <button className="vault-upload-btn" onClick={() => setShowUpload(true)}>+ Upload</button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="vault-empty-state">
            <div className="vault-empty-icon">📂</div>
            <div className="vault-empty-text">
              {documents.length === 0 ? 'No documents uploaded yet.' : 'No documents found.'}
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="vault-grid">{filtered.map(d => docCard(d, false))}</div>
        ) : (
          <div className="vault-list">{filtered.map(d => docCard(d, true))}</div>
        )}
      </div>

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} onUpload={addDocument} />}
    </div>
  );
};

const UploadModal: React.FC<{
  onClose: () => void;
  onUpload: (doc: Omit<VaultDocument, 'id' | 'date'>) => void;
}> = ({ onClose, onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [cat, setCat] = useState(CATS[1]);
  const [hospital, setHospital] = useState('');
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndSetFile = (f: File | undefined) => {
    if (!f) return;
    if (f.size > MAX_FILE_BYTES) {
      setError(`File is too large (max ${formatSize(MAX_FILE_BYTES)}).`);
      return;
    }
    const okTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (f.type && !okTypes.includes(f.type)) {
      setError('Unsupported file type. Please use PDF, JPG, or PNG.');
      return;
    }
    setError('');
    setFile(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    validateAndSetFile(e.dataTransfer.files[0]);
  };

  const handleUploadClick = () => {
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      onUpload({
        name: file.name,
        cat,
        hospital,
        sizeLabel: formatSize(file.size),
        dataUrl: reader.result as string,
        mimeType: file.type,
      });
      setUploading(false);
      onClose();
    };
    reader.onerror = () => {
      setError('Could not read that file. Please try again.');
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="vault-modal-overlay" onClick={onClose}>
      <div className="vault-modal-card" onClick={e => e.stopPropagation()}>
        <div className="vault-modal-title">Upload Document</div>
        <div className="vault-modal-sub">Supported: PDF, JPG, PNG · Max {formatSize(MAX_FILE_BYTES)}</div>

        <div
          className={`vault-drop-zone${dragging ? ' dragging' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <div className="vault-drop-icon">📎</div>
          <div className="vault-drop-txt">{file ? file.name : 'Drag & drop your file here'}</div>
          <div className="vault-drop-sub">{file ? formatSize(file.size) : 'or click to browse'}</div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,image/jpeg,image/png"
            style={{ display: 'none' }}
            onChange={e => validateAndSetFile(e.target.files?.[0])}
          />
        </div>

        {error && <div className="vault-modal-error">{error}</div>}

        <div className="vault-modal-field">
          <label className="vault-modal-label" htmlFor="vault-cat">Category</label>
          <select id="vault-cat" className="vault-modal-select" value={cat} onChange={e => setCat(e.target.value)}>
            {CATS.slice(1).map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div className="vault-modal-field">
          <label className="vault-modal-label" htmlFor="vault-hospital">Hospital Name</label>
          <input
            id="vault-hospital"
            className="vault-modal-input"
            placeholder="e.g. Apollo Hospital"
            value={hospital}
            onChange={e => setHospital(e.target.value)}
          />
        </div>

        <div className="vault-modal-actions">
          <button className="vault-modal-btn-primary" disabled={!file || uploading} onClick={handleUploadClick}>
            {uploading ? 'Uploading…' : 'Upload'}
          </button>
          <button className="vault-modal-btn-secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default VaultPage;
