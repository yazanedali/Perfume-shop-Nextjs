import { getTranslations } from "next-intl/server";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import {
  getUserSellerRequest,
} from "@/actions/user.action";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { CheckCircle, Clock, DollarSign, Rocket, Users, XCircle } from "lucide-react";
import PremiumRequestForm from "@/components/forms/PremiumRequestForm";
import { auth } from "@clerk/nextjs/server";

const RequestStatusCard = async ({ status, locale }: { status: string, locale: string }) => {
  const t = await getTranslations({ locale, namespace: "PremiumPage.status" });
  
  const statusConfig = {
    PENDING: { Icon: Clock, color: "text-primary" },
    APPROVED: { Icon: CheckCircle, color: "text-green-500" },
    REJECTED: { Icon: XCircle, color: "text-destructive" },
  };

  // اختيار الأيقونة واللون بناءً على الحالة
  const { Icon, color } = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;

  return (
    <Card className="max-w-md mx-auto mt-10 text-center">
      <CardHeader>
        <div className={`mx-auto bg-primary/10 p-3 rounded-full w-fit`}>
          <Icon className={`w-8 h-8 ${color}`} />
        </div>
        <CardTitle className="mt-4">{t(`${status}.title`)}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{t(`${status}.description`)}</p>
      </CardContent>
    </Card>
  );
};
export default async function PremiumPage({ params }: { params: { locale: string } }) {
  const { locale } = await Promise.resolve(params);
  const t = await getTranslations({ locale, namespace: "PremiumPage" });
  const { userId } = await auth();
  const existingRequest = userId ? await getUserSellerRequest(userId) : null;


 const rejectedRequest = existingRequest?.status === 'REJECTED' ? existingRequest : undefined;
const pendingOrApprovedRequest = existingRequest && (existingRequest.status === 'PENDING' || existingRequest.status === 'APPROVED');

  const features = [
    {
      icon: Rocket,
      title: t("features.reach.title"),
      description: t("features.reach.description"),
    },
    {
      icon: DollarSign,
      title: t("features.sales.title"),
      description: t("features.sales.description"),
    },
    {
      icon: Users,
      title: t("features.tools.title"),
      description: t("features.tools.description"),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      {/* القسم العلوي */}
      <div className="text-center max-w-3xl mx-auto">
        <Badge variant="outline" className="text-primary border-primary">
          {t("badge")}
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mt-4">
          {t("title")}
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          {t("subtitle")}
        </p>
      </div>

      {/* قسم الميزات */}
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-16">
        {features.map((feature, index) => (
          <div key={index} className="text-center p-6 bg-card rounded-lg border">
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
              <feature.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="mt-5 text-xl font-semibold">{feature.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* قسم النموذج أو حالة الطلب */}
      <div className="mt-16 mb-10">
        <SignedOut>
          <Card className="max-w-md mx-auto text-center">
            <CardHeader>
              <CardTitle>{t("loginPrompt.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {t("loginPrompt.description")}
              </p>
              <Button asChild>
                <Link href="/sign-in">{t("loginPrompt.button")}</Link>
              </Button>
            </CardContent>
          </Card>
        </SignedOut>

        <SignedIn>
          {pendingOrApprovedRequest ? (
            // إذا كان الطلب معلقًا أو مقبولًا، اعرض حالته
            <RequestStatusCard status={existingRequest!.status} locale={locale} />
          ) : (
            // وإلا (إذا لم يكن هناك طلب أو كان مرفوضًا)، اعرض الفورم
            // ومرر بيانات الطلب المرفوض إليه
            <PremiumRequestForm userId={userId!} rejectedRequest={rejectedRequest} />
          )}
        </SignedIn>
      </div>
    </div>
  );
}