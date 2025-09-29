import React from 'react';
import { Document } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  FileText,
  FileImage,
  FilePlus,
  MoreVertical,
  Download,
  Share2,
  Edit,
  Trash,
  Eye,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface DocumentCardProps {
  document: Document;
  onView: (doc: Document) => void;
  onEdit: (doc: Document) => void;
  onDelete: (doc: Document) => void;
  onShare: (doc: Document) => void;
  onDownload: (doc: Document) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onView,
  onEdit,
  onDelete,
  onShare,
  onDownload,
}) => {
  const getIcon = () => {
    if (document.fileType.includes('image')) return <FileImage className="h-8 w-8" />;
    if (document.fileType.includes('pdf')) return <FileText className="h-8 w-8 text-destructive" />;
    return <FilePlus className="h-8 w-8" />;
  };

  const getCategoryColor = () => {
    const colors = {
      education: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      identity: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      financial: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      health: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      property: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      employment: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
      other: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    };
    return colors[document.category] || colors.other;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Card className="group hover:shadow-elevated transition-all duration-200 hover:scale-[1.02] bg-gradient-card">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-background rounded-lg shadow-sm">
            {getIcon()}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(document)}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(document)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onShare(document)}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDownload(document)}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(document)} className="text-destructive">
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <h3 className="font-semibold text-lg mb-2 text-foreground truncate">
          {document.name}
        </h3>

        <div className="space-y-2">
          <Badge className={getCategoryColor()} variant="secondary">
            {document.category}
          </Badge>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{formatFileSize(document.fileSize)}</span>
            <span>{formatDistanceToNow(new Date(document.uploadedAt), { addSuffix: true })}</span>
          </div>

          {document.shared && (
            <Badge variant="outline" className="w-full justify-center">
              <Share2 className="mr-1 h-3 w-3" />
              Shared
            </Badge>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onView(document)}
          >
            <Eye className="mr-1 h-3 w-3" />
            View
          </Button>
          <Button
            variant="default"
            size="sm"
            className="flex-1"
            onClick={() => onShare(document)}
          >
            <Share2 className="mr-1 h-3 w-3" />
            Share
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default DocumentCard;