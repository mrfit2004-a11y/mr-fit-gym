"use client";

import Link from "next/link";
import { User, Bell, Palette } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/components/providers/i18n-provider";
import { NotificationPreferencesForm } from "@/components/notifications/notification-preferences-form";

/** Coach account settings: the signed-in account's details (read-only) plus preferences. */
export function SettingsView({ name, username, email }: { name: string; username: string; email: string }) {
  const { t, locale } = useI18n();
  const L = (ar: string, en: string) => (locale === "ar" ? ar : en);

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title={t.dashboard.coachNav.settings} description={L("بيانات حسابك وتفضيلاتك.", "Your account details and preferences.")} />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><User className="h-4 w-4 text-primary" />{L("الملف الشخصي", "Profile")}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>{t.common.name}</Label><Input value={name} readOnly /></div>
            <div className="space-y-2"><Label>{L("اسم المستخدم", "Username")}</Label><Input dir="ltr" value={username} readOnly /></div>
            {email && (
              <div className="space-y-2 sm:col-span-2"><Label>{t.common.email}</Label><Input dir="ltr" value={email} readOnly /></div>
            )}
            <p className="text-xs text-muted-foreground sm:col-span-2">
              {L("لتعديل بيانات الحساب تواصل مع الإدارة.", "To change these details, contact the administrator.")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><Palette className="h-4 w-4 text-primary" />{L("الهوية والعلامة التجارية", "Branding")}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              {L("اسم الأكاديمية واللوجو والألوان بتتعدّل من صفحة الهوية.", "Academy name, logo and colors are edited on the Branding page.")}
            </p>
            <Button asChild variant="outline"><Link href="/coach/branding">{L("فتح الهوية", "Open branding")}</Link></Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><Bell className="h-4 w-4 text-primary" />{L("التفضيلات", "Preferences")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {L("يمكنك تغيير اللغة والمظهر (فاتح/داكن) من الأزرار أعلى الصفحة، وتُحفظ تلقائياً مع حسابك.", "Change language and light/dark theme from the buttons at the top — they're saved to your account automatically.")}
            </p>
          </CardContent>
        </Card>

        <NotificationPreferencesForm />
      </div>
    </div>
  );
}
