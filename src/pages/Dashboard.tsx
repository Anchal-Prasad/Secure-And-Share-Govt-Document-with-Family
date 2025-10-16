import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Document, DocumentCategory } from "@/types";
import DocumentCard from "@/components/DocumentCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Search, Grid, List, Plus, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/utils";

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | "all">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [viewFile, setViewFile] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);

  const [uploadForm, setUploadForm] = useState({
    name: "",
    category: "other" as DocumentCategory,
    file: null as File | null,
    description: "",
  });

  // Fetch documents on mount
  React.useEffect(() => {
    if (user?.id) {
      fetchDocuments();
    }
  }, [user?.id]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("userid", user?.id)
        .order("uploadedat", { ascending: false });

      if (error) throw error;

      // Map database fields to Document type
      const mappedDocs: Document[] = (data || []).map((doc: any) => ({
        id: doc.id,
        userId: doc.userid,
        name: doc.name,
        category: doc.category,
        fileType: doc.filetype,
        fileSize: doc.filesize,
        uploadedAt: new Date(doc.uploadedat),
        shared: false,
        description: doc.description || "",
        filePath: doc.filepath,
        publicUrl: supabase.storage.from("documents").getPublicUrl(doc.filepath).data.publicUrl,
      }));

      setDocuments(mappedDocs);
    } catch (err: any) {
      console.error("Error fetching documents:", err);
      toast({
        title: "Error",
        description: "Failed to load documents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Restrict allowed MIME types
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Only PDF, DOC, DOCX, JPG, and PNG files are allowed.",
          variant: "destructive",
        });
        return;
      }

      setUploadForm({
        ...uploadForm,
        file,
        name: uploadForm.name || file.name.split(".")[0],
      });
    }
  };

  // Upload to Supabase Storage AND Database
  const handleUpload = async () => {
    if (!uploadForm.file) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    try {
      const ext = uploadForm.file.name.split(".").pop();
      const fileName = `${Date.now()}.${ext}`;
      const path = `${user?.id || "anonymous"}/${fileName}`;

      // Upload to Supabase bucket "documents"
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(path, uploadForm.file);

      if (uploadError) throw uploadError;

      // Get public URL from Supabase
      const { data } = supabase.storage.from("documents").getPublicUrl(path);
      const publicUrl = data.publicUrl;

      // Insert into database
      const { data: insertedDoc, error: dbError } = await supabase
        .from("documents")
        .insert({
          userid: user?.id,
          name: uploadForm.name,
          category: uploadForm.category,
          filetype: uploadForm.file.type,
          filesize: uploadForm.file.size,
          filepath: path,
          description: uploadForm.description,
          uploadedat: new Date().toISOString(),
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Create document object
      const newDocument: Document = {
        id: insertedDoc.id,
        userId: user?.id || "1",
        name: uploadForm.name,
        category: uploadForm.category,
        fileType: uploadForm.file.type,
        fileSize: uploadForm.file.size,
        uploadedAt: new Date(),
        shared: false,
        description: uploadForm.description,
        filePath: path,
        publicUrl
      };

      // Add to local state
      setDocuments((prev) => [newDocument, ...prev]);

      // Reset form
      setIsUploadModalOpen(false);
      setUploadForm({ name: "", category: "other", file: null, description: "" });

      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });
    } catch (err: any) {
      console.error("Upload error:", err);
      toast({
        title: "Upload Failed",
        description: err.message || "Error uploading file",
        variant: "destructive",
      });
    }
  };

  // Share document
  const handleShare = (doc: Document) => {
    if (!doc.publicUrl) {
      toast({
        title: "Error",
        description: "Cannot share this document. Public URL missing.",
        variant: "destructive",
      });
      return;
    }

    navigator.clipboard
      .writeText(doc.publicUrl)
      .then(() => {
        toast({
          title: "Share Link Copied",
          description: "The document public link has been copied to clipboard.",
        });
        setDocuments((prev) =>
          prev.map((d) => (d.id === doc.id ? { ...d, shared: true } : d))
        );
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to copy link to clipboard",
          variant: "destructive",
        });
      });
  };

  // Delete document (from database AND storage)
  const handleDelete = async (doc: Document) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("documents")
        .remove([doc.filePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from("documents")
        .delete()
        .eq("id", doc.id);

      if (dbError) throw dbError;

      // Remove from local state
      setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
      
      toast({
        title: "Deleted",
        description: `${doc.name} has been deleted`,
      });
    } catch (err: any) {
      console.error("Delete error:", err);
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      });
    }
  };

  const handleDownload = (doc: Document) => {
    if (doc.publicUrl) {
      const link = document.createElement("a");
      link.href = doc.publicUrl;
      link.download = doc.name;
      link.click();
      toast({
        title: "Download Started",
        description: `Downloading ${doc.name}`,
      });
    } else {
      toast({
        title: "Error",
        description: "File not available to download",
        variant: "destructive",
      });
    }
  };

  const handleView = (doc: Document) => {
    if (doc.publicUrl) {
      setViewFile(doc);
    } else {
      toast({
        title: "Error",
        description: "File not available to view.",
        variant: "destructive",
      });
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const documentStats = {
    total: documents.length,
    shared: documents.filter((d) => d.shared).length,
    categories: [...new Set(documents.map((d) => d.category))].length,
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

        {/* Stats */}
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

        {/* Filters */}
        <Card>
          <CardContent className="p-4 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={(value) =>
                setSelectedCategory(value as DocumentCategory | "all")
              }
            >
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
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Document Grid/List */}
        {loading ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-muted-foreground">Loading documents...</p>
            </CardContent>
          </Card>
        ) : filteredDocuments.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No documents found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || selectedCategory !== "all"
                  ? "Try adjusting your filters"
                  : "Upload your first document to get started"}
              </p>
              {!searchQuery && selectedCategory === "all" && (
                <Button variant="gradient" onClick={() => setIsUploadModalOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Your First Document
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                : "space-y-4"
            }
          >
            {filteredDocuments.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onView={handleView}
                onEdit={() => {}}
                onDelete={handleDelete}
                onShare={handleShare}
                onDownload={() => handleDownload(doc)}
              />
            ))}
          </div>
        )}

        {/* Upload Modal */}
        <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
              <DialogDescription>Upload a new document to your secure vault</DialogDescription>
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
                  onValueChange={(value) =>
                    setUploadForm({ ...uploadForm, category: value as DocumentCategory })
                  }
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
                  onChange={(e) =>
                    setUploadForm({ ...uploadForm, description: e.target.value })
                  }
                  placeholder="Add a description..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUploadModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="success" onClick={handleUpload}>
                <Upload className="mr-2 h-4 w-4" /> Upload
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Modal */}
        <Dialog open={!!viewFile} onOpenChange={() => setViewFile(null)}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>{viewFile?.name}</DialogTitle>
              <DialogDescription>{viewFile?.description}</DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              {viewFile?.fileType.includes("pdf") ? (
                <iframe
                  src={viewFile.publicUrl}
                  className="w-full h-[500px]"
                  title={viewFile.name}
                />
              ) : (
                <img src={viewFile?.publicUrl} alt={viewFile?.name} className="w-full" />
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewFile(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Dashboard;