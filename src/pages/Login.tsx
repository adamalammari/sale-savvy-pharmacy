import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pill, Lock, User, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (login(username, password)) {
        toast.success('تم تسجيل الدخول بنجاح');
      } else {
        toast.error('اسم المستخدم أو كلمة المرور غير صحيحة');
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted to-background p-4" dir="rtl">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="w-[420px] shadow-2xl border-border/50">
          <CardHeader className="text-center pb-2 pt-8">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Pill className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">فارما بلس</h1>
            <p className="text-sm text-muted-foreground">نظام إدارة الصيدلية المتكامل</p>
          </CardHeader>
          <CardContent className="pt-4 pb-8 px-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">اسم المستخدم</label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pr-10"
                    placeholder="أدخل اسم المستخدم"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">كلمة المرور</label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pr-10 pl-10"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="أدخل كلمة المرور"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <button type="button" className="absolute left-3 top-1/2 -translate-y-1/2" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full h-11 text-base mt-2" disabled={loading || !username || !password}>
                {loading ? <span className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full" /> : 'تسجيل الدخول'}
              </Button>
            </form>
            <div className="mt-6 p-3 rounded-lg bg-muted/50 border border-border/50">
              <p className="text-xs text-muted-foreground text-center">
                بيانات الدخول التجريبية: <span className="font-mono font-bold text-foreground">admin</span> / <span className="font-mono font-bold text-foreground">admin123</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
