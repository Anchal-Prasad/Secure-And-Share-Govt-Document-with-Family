import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, Mail, RefreshCw } from 'lucide-react';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { resendConfirmation } = useAuth();
  const [isResending, setIsResending] = useState(false);
  
  const email = searchParams.get('email') || '';

  const handleResendConfirmation = async () => {
    if (!email) return;
    
    setIsResending(true);
    try {
      await resendConfirmation(email);
    } catch (error) {
      console.error('Error resending confirmation:', error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
          <CardDescription className="text-gray-600">
            We've sent a verification link to{' '}
            <span className="font-medium text-gray-900">{email}</span>
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-gray-600">
            <p>Click the verification link in your email to activate your account.</p>
          </div>
          
          <div className="space-y-3">
            <Button
              onClick={handleResendConfirmation}
              disabled={isResending || !email}
              variant="outline"
              className="w-full"
            >
              {isResending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Resend Verification Link
                </>
              )}
            </Button>
            
            <Button
              onClick={() => navigate('/login')}
              variant="ghost"
              className="w-full"
            >
              Back to Login
            </Button>
          </div>
          
          <div className="text-xs text-gray-500 text-center">
            <p>Didn't receive the email? Check your spam folder or try resending.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;