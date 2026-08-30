import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function LoginView() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication delay
    setTimeout(() => {
      setIsLoading(false);
      navigate('/admin');
    }, 600);
  };

  return (
    <div className="w-full max-w-sm mx-auto py-12 sm:py-20">
      <div className="space-y-6">
        
        {/* Title Header */}
        <div className="space-y-2 text-center sm:text-left">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Sign in to Sideout
          </h1>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Enter your admin credentials to manage players, matches, and court logs.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-medium text-foreground">
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="admin@sideout.app"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-10 rounded-lg text-sm bg-background border-border/80 focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-medium text-foreground">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-10 rounded-lg text-sm bg-background border-border/80 focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2"
          >
            <span>{isLoading ? 'Signing in...' : 'Sign In'}</span>
            {!isLoading && <ArrowRight className="size-4" />}
          </Button>
        </form>

        {/* Footer Note */}
        <div className="pt-4 border-t border-border/60 text-center">
          <p className="text-[11px] text-muted-foreground leading-normal">
            Restricted area. If you need moderator access or password resets, contact your primary organization administrator.
          </p>
        </div>

      </div>
    </div>
  );
}