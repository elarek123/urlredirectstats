import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Pencil } from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { UrlForm } from '@/components/url-form';
import { index } from '@/routes/urls';

type Domain = {
    id: number;
    name: string;
};

type Url = {
    id: number;
    name: string;
    domain_id: number | null;
    domain: Domain | null;
    short_url: string;
    redirect_url: string | null;
    is_active: boolean;
    scans_count: number;
};

type Scan = {
    id: number;
    user_ip: string;
    created_at: string;
};

type Props = {
    url: Url;
    scans: Scan[];
    domains: Domain[];
};

function formatDate(value: string): string {
    return new Date(value).toLocaleString('ru-RU');
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="font-medium break-all">{children}</span>
        </div>
    );
}

export default function UrlDetail({ url, scans, domains }: Props) {
    const [editOpen, setEditOpen] = useState(false);

    return (
        <>
            <Head title={url.name} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <Heading title={url.name} description="Информация о ссылке" />
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={index().url}>
                                <ArrowLeft className="size-4" />
                                Назад
                            </Link>
                        </Button>
                        <Dialog open={editOpen} onOpenChange={setEditOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Pencil className="size-4" />
                                    Редактировать
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Редактировать ссылку
                                    </DialogTitle>
                                </DialogHeader>
                                <UrlForm
                                    url={url}
                                    domains={domains}
                                    onClose={() => setEditOpen(false)}
                                />
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <div className="grid gap-6 rounded-xl border border-sidebar-border/70 p-6 sm:grid-cols-2 dark:border-sidebar-border">
                    <Field label="Домен">{url.domain?.name ?? '—'}</Field>
                    <Field label="Статус">
                        <Badge variant={url.is_active ? 'default' : 'secondary'}>
                            {url.is_active ? 'Активна' : 'Отключена'}
                        </Badge>
                    </Field>
                    <Field label="Короткая ссылка">{url.short_url}</Field>
                    <Field label="Ссылка для перехода">
                        {url.redirect_url ?? '—'}
                    </Field>
                    <Field label="Количество переходов">{url.scans_count}</Field>
                </div>

                <div>
                    <Heading variant="small" title="Переходы" />
                    <div className="mt-4 overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <table className="w-full text-sm">
                            <thead className="border-b border-sidebar-border/70 bg-muted/40 dark:border-sidebar-border">
                                <tr className="text-left text-muted-foreground">
                                    <th className="px-4 py-3 font-medium">
                                        IP адрес
                                    </th>
                                    <th className="px-4 py-3 font-medium">Дата</th>
                                </tr>
                            </thead>
                            <tbody>
                                {scans.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={2}
                                            className="px-4 py-10 text-center text-muted-foreground"
                                        >
                                            Переходов пока нет
                                        </td>
                                    </tr>
                                )}
                                {scans.map((scan) => (
                                    <tr
                                        key={scan.id}
                                        className="border-b border-sidebar-border/70 last:border-0 dark:border-sidebar-border"
                                    >
                                        <td className="px-4 py-3 font-medium">
                                            {scan.user_ip}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {formatDate(scan.created_at)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

UrlDetail.layout = {
    breadcrumbs: [
        {
            title: 'Ссылки',
            href: index(),
        },
    ],
};
