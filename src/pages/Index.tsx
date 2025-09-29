import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import {
  Shield,
  Lock,
  Share2,
  FileText,
  CheckCircle,
  ArrowRight,
  Cloud,
  Smartphone,
  Globe,
} from 'lucide-react';

const Index = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <Lock className="h-6 w-6" />,
      title: 'Secure Storage',
      description: 'Bank-level encryption for all your documents',
    },
    {
      icon: <Share2 className="h-6 w-6" />,
      title: 'Easy Sharing',
      description: 'Share documents securely with time-limited links',
    },
    {
      icon: <Cloud className="h-6 w-6" />,
      title: 'Cloud Backup',
      description: 'Access your documents from anywhere, anytime',
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: 'Mobile Ready',
      description: 'Responsive design works on all devices',
    },
  ];

  const documentTypes = [
    'Aadhaar Card',
    'PAN Card',
    'Passport',
    'Driving License',
    'Educational Certificates',
    'Property Documents',
    'Medical Records',
    'Financial Documents',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-primary rounded-2xl shadow-glow">
              <Shield className="h-12 w-12 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Your Digital Document Vault
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Store, manage, and share your important documents securely with government-grade encryption.
            Say goodbye to physical paperwork and embrace the digital future.
          </p>
          <div className="flex gap-4 justify-center">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button variant="gradient" size="lg" className="gap-2">
                  Go to Dashboard
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button variant="gradient" size="lg" className="gap-2">
                    Get Started Free
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg">
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose DigiLocker?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-elevated transition-all duration-200 hover:scale-105">
              <CardContent className="p-6">
                <div className="p-3 bg-primary/10 rounded-lg inline-block mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Document Types Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Store All Your Important Documents
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From identity proofs to educational certificates, keep all your documents organized in one secure place
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {documentTypes.map((type, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-4 bg-card rounded-lg border border-border hover:border-primary transition-colors"
            >
              <FileText className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">{type}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-primary text-primary-foreground p-12 text-center shadow-glow">
          <CardContent className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Go Paperless?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Join thousands of citizens who have already digitized their documents.
              Start your secure digital journey today!
            </p>
            {!isAuthenticated && (
              <Link to="/register">
                <Button variant="secondary" size="lg" className="gap-2">
                  Create Free Account
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-4xl font-bold text-primary mb-2">100%</h3>
            <p className="text-muted-foreground">Secure & Encrypted</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-primary mb-2">24/7</h3>
            <p className="text-muted-foreground">Access Anywhere</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-primary mb-2">∞</h3>
            <p className="text-muted-foreground">Unlimited Storage</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
