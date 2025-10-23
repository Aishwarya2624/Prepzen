import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { auth } from '@/lib/firebase-config'; // Import your Firebase auth instance
import { confirmPasswordReset } from 'firebase/auth'; // Import the Firebase function
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export const ResetPasswordForm = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // The 'oobCode' is the action code sent by Firebase in the password reset link
  const oobCode = searchParams.get('oobCode');

  useEffect(() => {
    // If the oobCode is missing from the URL, the link is invalid.
    if (!oobCode) {
      toast.error('Invalid Reset Link', {
        description: 'The password reset link is missing required information.',
      });
      navigate('/forgot-password');
    }
  }, [oobCode, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!oobCode) {
      toast.error('Invalid Action', {
        description: 'Cannot reset password without a valid action code.',
      });
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      // Use Firebase's confirmPasswordReset function
      await confirmPasswordReset(auth, oobCode, password);
      
      toast.success('Password updated successfully!');
      navigate('/sign-in');

    } catch (error: any) {
      console.error("Error resetting password:", error);
      let errorMessage = 'An unexpected error occurred. Please try again.';
      // Handle specific Firebase errors
      if (error.code === 'auth/expired-action-code') {
        errorMessage = 'This password reset link has expired. Please request a new one.';
      } else if (error.code === 'auth/invalid-action-code') {
        errorMessage = 'This password reset link is invalid. It may have already been used.';
      }
      
      toast.error('Password reset failed', {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Set New Password</CardTitle>
          <CardDescription className="text-center">
            Enter your new password below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading || !oobCode}>
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};