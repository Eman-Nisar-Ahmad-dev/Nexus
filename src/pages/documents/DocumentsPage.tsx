import React, { useRef, useState } from 'react';
import { FileText, Upload, Download, Trash2, Share2, PenTool, X } from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

type DocStatus = 'Draft' | 'In Review' | 'Signed';

interface DocItem {
  id: number;
  name: string;
  type: string;
  size: string;
  lastModified: string;
  status: DocStatus;
  fileUrl?: string;
  signatureDataUrl?: string;
}

const initialDocuments: DocItem[] = [
  {
    id: 1,
    name: 'Pitch Deck 2024.pdf',
    type: 'PDF',
    size: '2.4 MB',
    lastModified: '2024-02-15',
    status: 'Draft',
  },
  {
    id: 2,
    name: 'Financial Projections.xlsx',
    type: 'Spreadsheet',
    size: '1.8 MB',
    lastModified: '2024-02-10',
    status: 'In Review',
  },
  {
    id: 3,
    name: 'Business Plan.docx',
    type: 'Document',
    size: '3.2 MB',
    lastModified: '2024-02-05',
    status: 'Signed',
  },
];

const statusColor = (status: DocStatus) => {
  switch (status) {
    case 'Draft':
      return 'gray';
    case 'In Review':
      return 'accent';
    case 'Signed':
      return 'success';
    default:
      return 'gray';
  }
};

export const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<DocItem[]>(initialDocuments);
  const [previewDoc, setPreviewDoc] = useState<DocItem | null>(null);
  const [signingDoc, setSigningDoc] = useState<DocItem | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const sigCanvasRef = useRef<SignatureCanvas>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    const newDoc: DocItem = {
      id: Date.now(),
      name: file.name,
      type: file.type.includes('pdf') ? 'PDF' : file.type.split('/')[1]?.toUpperCase() || 'File',
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      lastModified: new Date().toISOString().split('T')[0],
      status: 'Draft',
      fileUrl,
    };

    setDocuments(prev => [newDoc, ...prev]);
    e.target.value = '';
  };

  const updateStatus = (id: number, status: DocStatus) => {
    setDocuments(prev =>
      prev.map(doc => (doc.id === id ? { ...doc, status } : doc))
    );
  };

  const deleteDoc = (id: number) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const openSignaturePad = (doc: DocItem) => {
    setSigningDoc(doc);
  };

  const saveSignature = () => {
    if (!signingDoc || !sigCanvasRef.current) return;
    if (sigCanvasRef.current.isEmpty()) {
      alert('Please draw a signature first.');
      return;
    }
    const dataUrl = sigCanvasRef.current.toDataURL();
    setDocuments(prev =>
      prev.map(doc =>
        doc.id === signingDoc.id
          ? { ...doc, signatureDataUrl: dataUrl, status: 'Signed' }
          : doc
      )
    );
    setSigningDoc(null);
  };

  const clearSignature = () => {
    sigCanvasRef.current?.clear();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-600">Manage your startup's important files</p>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileSelected}
          accept=".pdf,.doc,.docx,.xlsx,.png,.jpg,.jpeg"
        />
        <Button leftIcon={<Upload size={18} />} onClick={handleUploadClick}>
          Upload Document
        </Button>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">All Documents</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-2">
            {documents.length === 0 && (
              <p className="text-gray-500 text-sm py-6 text-center">
                No documents yet. Click "Upload Document" to add one.
              </p>
            )}

            {documents.map(doc => (
              <div
                key={doc.id}
                className="flex items-center p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                <div
                  className="p-2 bg-primary-50 rounded-lg mr-4 cursor-pointer"
                  onClick={() => doc.fileUrl && setPreviewDoc(doc)}
                >
                  <FileText size={24} className="text-primary-600" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3
                      className="text-sm font-medium text-gray-900 truncate cursor-pointer hover:underline"
                      onClick={() => doc.fileUrl && setPreviewDoc(doc)}
                    >
                      {doc.name}
                    </h3>
                    <Badge variant={statusColor(doc.status)} size="sm">
                      {doc.status}
                    </Badge>
                    {doc.signatureDataUrl && (
                      <Badge variant="success" size="sm">Signed by you</Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    <span>{doc.type}</span>
                    <span>{doc.size}</span>
                    <span>Modified {doc.lastModified}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <select
                    value={doc.status}
                    onChange={(e) => updateStatus(doc.id, e.target.value as DocStatus)}
                    className="text-sm border border-gray-300 rounded-md px-2 py-1"
                  >
                    <option value="Draft">Draft</option>
                    <option value="In Review">In Review</option>
                    <option value="Signed">Signed</option>
                  </select>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2"
                    aria-label="Sign document"
                    onClick={() => openSignaturePad(doc)}
                    title="Add e-signature"
                  >
                    <PenTool size={18} />
                  </Button>

                  {doc.fileUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2"
                      aria-label="Download"
                      onClick={() => window.open(doc.fileUrl, '_blank')}
                    >
                      <Download size={18} />
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2"
                    aria-label="Share"
                  >
                    <Share2 size={18} />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2 text-error-600 hover:text-error-700"
                    aria-label="Delete"
                    onClick={() => deleteDoc(doc.id)}
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="font-medium text-gray-900">{previewDoc.name}</h3>
              <Button variant="ghost" size="sm" className="p-2" onClick={() => setPreviewDoc(null)}>
                <X size={18} />
              </Button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              {previewDoc.fileUrl && previewDoc.type === 'PDF' ? (
                <iframe src={previewDoc.fileUrl} className="w-full h-[70vh]" title="Document preview" />
              ) : previewDoc.fileUrl ? (
                <img src={previewDoc.fileUrl} alt={previewDoc.name} className="max-w-full mx-auto" />
              ) : (
                <p className="text-gray-500 text-center py-12">No preview available for this file.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Signature Modal */}
      {signingDoc && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="font-medium text-gray-900">Sign: {signingDoc.name}</h3>
              <Button variant="ghost" size="sm" className="p-2" onClick={() => setSigningDoc(null)}>
                <X size={18} />
              </Button>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-3">Draw your signature below:</p>
              <div className="border border-gray-300 rounded-md bg-gray-50">
                <SignatureCanvas
                  ref={sigCanvasRef}
                  canvasProps={{ width: 460, height: 180, className: 'w-full' }}
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={clearSignature}>
                  Clear
                </Button>
                <Button size="sm" onClick={saveSignature}>
                  Save Signature
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};