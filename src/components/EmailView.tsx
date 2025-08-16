import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { X, Download, Image as ImageIcon } from "lucide-react";
import { Email, Attachment } from "./EmailClient";
import { formatEmailDate } from "@/lib/email-utils";

interface EmailViewProps {
  email: Email;
  onClose: () => void;
}

const EmailView = ({ email, onClose }: EmailViewProps) => {
  const [emailContent, setEmailContent] = useState<string>("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading email content and attachments
    setIsLoading(true);
    
    setTimeout(() => {
      // Mock content
      setEmailContent(`
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #2563eb; margin-bottom: 16px;">${email.subject}</h2>
          <p>Привет!</p>
          <p>Это содержимое письма от <strong>${email.fromName || email.fromEmail}</strong>.</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
          <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          <p>С уважением,<br/>${email.fromName || email.fromEmail}</p>
        </div>
      `);
      
      // Mock attachments
      const mockAttachments: Attachment[] = [
        {
          name: "image1.jpg",
          size: "245 KB",
          type: "image/jpeg",
          url: "https://picsum.photos/400/300?random=1",
          isImage: true
        },
        {
          name: "document.pdf",
          size: "1.2 MB", 
          type: "application/pdf",
          url: "#",
          isImage: false
        },
        {
          name: "photo.png",
          size: "180 KB",
          type: "image/png", 
          url: "https://picsum.photos/300/200?random=2",
          isImage: true
        }
      ];
      
      setAttachments(mockAttachments);
      setIsLoading(false);
    }, 500);
  }, [email]);

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="flex-shrink-0 pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold text-email-subject mb-2 line-clamp-2">
              {email.subject || "(без темы)"}
            </h2>
            
            <div className="flex items-center justify-between text-sm text-email-meta">
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {email.fromName || email.fromEmail}
                </span>
                {email.fromEmail && email.fromName && (
                  <span className="text-muted-foreground">
                    &lt;{email.fromEmail}&gt;
                  </span>
                )}
              </div>
              
              <time className="flex-shrink-0">
                {formatEmailDate(email.date, true)}
              </time>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="flex-shrink-0 h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-muted-foreground">Загружаем письмо...</div>
          </div>
        ) : (
          <>
            <div 
              className="prose prose-sm max-w-none text-email-content"
              dangerouslySetInnerHTML={{ __html: emailContent }}
            />
            
            {attachments.length > 0 && (
              <div className="border-t pt-4">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Вложения ({attachments.length})
                </h3>
                
                <div className="space-y-3">
                  {attachments.map((attachment, index) => (
                    <div key={index} className="space-y-2">
                      {attachment.isImage ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">{attachment.name}</span>
                            <span className="text-muted-foreground">{attachment.size}</span>
                          </div>
                          <img
                            src={attachment.url}
                            alt={attachment.name}
                            className="max-w-full h-auto rounded-lg border"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                              <Download className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-medium text-sm">{attachment.name}</div>
                              <div className="text-xs text-muted-foreground">{attachment.size}</div>
                            </div>
                          </div>
                          
                          <Button variant="outline" size="sm">
                            Скачать
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EmailView;