import { Head, router } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { UrlForm } from '@/components/url-form';
import { destroy, index, show } from '@/routes/urls';

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
    updated_at: string;
};

type Props = {
    urls: Url[];
    domains: Domain[];
};

function DeleteUrl({ url }: { url: Url }) {
    const [open, setOpen] = useState(false);
    const [processing, setProcessing] = useState(false);

    const remove = () => {
        router.delete(destroy(url.id).url, {
            preserveScroll: true,
            onStart: () => setProcessing(true),
            onFinish: () => setProcessing(false),
            onSuccess: () => setOpen(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Trash2 className="size-4 text-muted-foreground" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Удалить ссылку</DialogTitle>
                    <DialogDescription>
                        Ссылка «{url.name}» будет удалена без возможности
                        восстановления.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Отмена
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={remove}
                        disabled={processing}
                    >
                        {processing && <Spinner />}
                        Удалить
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function EditUrl({ url, domains }: { url: Url; domains: Domain[] }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Pencil className="size-4 text-muted-foreground" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Редактировать ссылку</DialogTitle>
                </DialogHeader>
                <UrlForm
                    url={url}
                    domains={domains}
                    onClose={() => setOpen(false)}
                />
            </DialogContent>
        </Dialog>
    );
}

export default function UrlPage({ urls, domains }: Props) {
    const [createOpen, setCreateOpen] = useState(false);

    return (
        <>
            <Head title="Ссылки" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <Heading title="Ссылки" description="Управление ссылками" />
                    <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="size-4" />
                                Добавить ссылку
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Новая ссылка</DialogTitle>
                            </DialogHeader>
                            <UrlForm
                                domains={domains}
                                onClose={() => setCreateOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <table className="w-full text-sm">
                        <thead className="border-b border-sidebar-border/70 bg-muted/40 dark:border-sidebar-border">
                            <tr className="text-left text-muted-foreground">
                                <th className="px-4 py-3 font-medium">Название</th>
                                <th className="px-4 py-3 font-medium">
                                    Короткая ссылка
                                </th>
                                <th className="px-4 py-3 font-medium">Переход</th>
                                <th className="px-4 py-3 font-medium">
                                    Количество переходов
                                </th>
                                <th className="px-4 py-3 font-medium">Статус</th>
                                <th className="px-4 py-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {urls.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-4 py-10 text-center text-muted-foreground"
                                    >
                                        Ссылок пока нет
                                    </td>
                                </tr>
                            )}
                            {urls.map((url) => (
                                <tr
                                    key={url.id}
                                    onClick={() => router.visit(show(url.id).url)}
                                    className="cursor-pointer border-b border-sidebar-border/70 transition-colors last:border-0 hover:bg-muted/40 dark:border-sidebar-border"
                                >
                                    <td className="px-4 py-3 font-medium">
                                        {url.name}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {url.short_url}
                                    </td>
                                    <td className="max-w-xs truncate px-4 py-3 text-muted-foreground">
                                        {url.redirect_url ?? '—'}
                                    </td>
                                    <td className="px-4 py-3">{url.scans_count}</td>
                                    <td className="px-4 py-3">
                                        <Badge
                                            variant={
                                                url.is_active
                                                    ? 'default'
                                                    : 'secondary'
                                            }
                                        >
                                            {url.is_active
                                                ? 'Активна'
                                                : 'Отключена'}
                                        </Badge>
                                    </td>
                                    <td
                                        className="px-4 py-3"
                                        onClick={(event) => event.stopPropagation()}
                                    >
                                        <div className="flex justify-end gap-1">
                                            <EditUrl
                                                url={url}
                                                domains={domains}
                                            />
                                            <DeleteUrl url={url} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

UrlPage.layout = {
    breadcrumbs: [
        {
            title: 'Ссылки',
            href: index(),
        },
    ],
};
