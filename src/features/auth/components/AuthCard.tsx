import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";

type AuthCardProps = {
    title: string;
    description: string;
    children: React.ReactNode;
  };
  
  export function AuthCard({
    title,
    description,
    children,
  }: AuthCardProps) {
    return (
      <Card className="border-slate-800 bg-slate-900/80">
        <CardHeader>
          <CardTitle className="text-slate-100">{title}</CardTitle>
          <CardDescription>
            {description}
          </CardDescription>
        </CardHeader>
  
        <CardContent>
          {children}
        </CardContent>
      </Card>
    );
  }