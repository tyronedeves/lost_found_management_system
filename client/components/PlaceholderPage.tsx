import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction, ArrowLeft, MessageCircle } from "lucide-react";
import Header from "@/components/Header";

interface PlaceholderPageProps {
  title: string;
  description: string;
  suggestedAction?: string;
}

export default function PlaceholderPage({ 
  title, 
  description, 
  suggestedAction = "Continue building this feature by describing what you'd like to see here!" 
}: PlaceholderPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mx-auto max-w-2xl">
          <Card className="border-dashed border-2">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Construction className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl">{title}</CardTitle>
              <CardDescription className="text-base">
                {description}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <MessageCircle className="inline h-4 w-4 mr-1" />
                  {suggestedAction}
                </p>
              </div>
              
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link to="/">
                  <Button variant="outline" className="w-full sm:w-auto">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                  </Button>
                </Link>
                <Link to="/report">
                  <Button className="w-full sm:w-auto">
                    Report an Item
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
