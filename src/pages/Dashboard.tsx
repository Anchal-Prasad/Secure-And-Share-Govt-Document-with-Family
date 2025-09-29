import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Document, DocumentCategory } from '@/types';
import DocumentCard from '@/components/DocumentCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Search, Filter, FileText, Grid, List, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      userId: '1',
      name: 'Aadhaar Card',
      category: 'identity',
      fileType: 'application/pdf',
      fileSize: 245000,
      uploadedAt: new Date('2024-01-15'),
      shared: false,
    },
    {
      id: '2',
      userId: '1',
      name: 'PAN Card',
      category: 'financial',
      fileType: 'image/jpeg',
      fileSize: 180000,
      uploadedAt: new Date('2024-02-20'),
      shared: true,
    },
    {
      id: '3',
      userId: '1',
      name: 'Degree Certificate',
      category: 'education',
      fileType: 'application/pdf',
      fileSize: 520000,
      uploadedAt: new Date('2024-03-10'),
      shared: false,
    },
  ]);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    name: '',
    category: 'other' as DocumentCategory,
    file: null as File | null,
    description: '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadForm({
        ...uploadForm,
        file: e.target.files[0],
        name: uploadForm.name || e.target.files[0].name.split('.')[0],
      });
    }
  };

  const handleUpload = () => {
    if (!uploadForm.file) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    const newDocument: Document = {
      id: Date.now().toString(),
      userId: user?.id || '1',
      name: uploadForm.name,
      category: uploadForm.category,
      fileType: uploadForm.file.type,
      fileSize: uploadForm.file.size,
      uploadedAt: new Date(),
      shared: false,
      description: uploadForm.description,
    };

    setDocuments([...documents, newDocument]);
    setIsUploadModalOpen(false);
    setUploadForm({
      name: '',
      category: 'other',
      file: null,
      description: '',
    });

    toast({
      title: "Success",
      description: "Document uploaded successfully",
    });
  };

  const handleEdit = (doc: Document) => {
    setSelectedDocument(doc);
    setIsEditModalOpen(true);
  };

  const handleDelete = (doc: Document) => {
    setDocuments(documents.filter(d => d.id !== doc.id));
    toast({
      title: "Document Deleted",
      description: `${doc.name} has been deleted`,
    });
  };

  const handleShare = (doc: Document) => {
    // Mock share functionality
    const shareUrl = `${window.location.origin}/shared/${doc.id}`;
    navigator.clipboard.writeText(shareUrl);
    
    setDocuments(documents.map(d => 
      d.id === doc.id ? { ...d, shared: true } : d
    ));

    toast({
      title: "Share Link Copied",
      description: "The share link has been copied to your clipboard",
    });
  };

  const handleDownload = (doc: Document) => {
    toast({
      title: "Download Started",
      description: `Downloading ${doc.name}...`,
    });
  };

  const handleView = (doc: Document) => {
    toast({
      title: "Opening Document",
      description: `Viewing ${doc.name}`,
    });
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const documentStats = {
    total: documents.length,
    shared: documents.filter(d => d.shared).length,
    categories: [...new Set(documents.map(d => d.category))].length,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Documents</h1>
            <p className="text-muted-foreground">Welcome back, {user?.name}</p>
          </div>
          <Button variant="gradient" onClick={() => setIsUploadModalOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-card">
            <CardHeader className="pb-2">
              <CardDescription>Total Documents</CardDescription>
              <CardTitle className="text-3xl">{documentStats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-gradient-card">
            <CardHeader className="pb-2">
              <CardDescription>Shared Documents</CardDescription>
              <CardTitle className="text-3xl">{documentStats.shared}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-gradient-card">
            <CardHeader className="pb-2">
              <CardDescription>Categories</CardDescription>
              <CardTitle className="text-3xl">{documentStats.categories}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as DocumentCategory | 'all')}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="identity">Identity</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="property">Property</SelectItem>
                  <SelectItem value="employment">Employment</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents Grid/List */}
        {filteredDocuments.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No documents found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || selectedCategory !== 'all' 
                  ? 'Try adjusting your filters'
                  : 'Upload your first document to get started'}
              </p>
              {!searchQuery && selectedCategory === 'all' && (
                <Button variant="gradient" onClick={() => setIsUploadModalOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Your First Document
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            : "space-y-4"
          }>
            {filteredDocuments.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onShare={handleShare}
                onDownload={handleDownload}
              />
            ))}
          </div>
        )}

        {/* Upload Modal */}
        <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
              <DialogDescription>
                Upload a new document to your secure vault
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file">Select File</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Document Name</Label>
                <Input
                  id="name"
                  value={uploadForm.name}
                  onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                  placeholder="e.g., Aadhaar Card"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={uploadForm.category}
                  onValueChange={(value) => setUploadForm({ ...uploadForm, category: value as DocumentCategory })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="identity">Identity</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="property">Property</SelectItem>
                    <SelectItem value="employment">Employment</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  placeholder="Add a description..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUploadModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="success" onClick={handleUpload}>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Dashboard;