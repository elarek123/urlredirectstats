import { Head, router, useForm } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { destroy, index, store, update } from '@/routes/domains';

type Domain = {
    id: number;
    name: string;
    status_id: number;
    is_default: boolean;
    updated_at: string;
};

type Props = {
    domains: Domain[];
    statuses: Record<string, string>;
};

function DomainForm({
    domain,
    statuses,
    onClose,
}: {
    domain?: Domain;
    statuses: Record<string, string>;
    onClose: () => void;
}) {
    const statusKeys = Object.keys(statuses);
    const form = useForm({
        name: domain?.name ?? '',
        status_id: String(domain?.status_id ?? statusKeys[0]),
        is_default: domain?.is_default ?? false,
    });

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: () => onClose(),
        };

        if (domain) {
            form.put(update(domain.id).url, options);
        } else {
            form.post(store().url, options);
        }
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="grid gap-2">
                <Label htmlFor="name">Название</Label>
                <Input
                    id="name"
                    value={form.data.name}
                    onChange={(event) => form.setData('name', event.target.value)}
                    autoFocus
                    placeholder="example.com"
                />
                <InputError message={form.errors.name} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="status_id">Статус</Label>
                <Select
                    value={form.data.status_id}
                    onValueChange={(value) => form.setData('status_id', value)}
                >
                    <SelectTrigger id="status_id">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {statusKeys.map((key) => (
                            <SelectItem key={key} value={key}>
                                {statuses[key]}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={form.errors.status_id} />
            </div>

            <div className="flex items-center gap-2">
                <Checkbox
                    id="is_default"
                    checked={form.data.is_default}
                    onCheckedChange={(checked) =>
                        form.setData('is_default', checked === true)
                    }
                />
                <Label htmlFor="is_default">Домен по умолчанию</Label>
            </div>

            <DialogFooter>
                <Button type="submit" disabled={form.processing}>
                    {form.processing && <Spinner />}
                    {domain ? 'Сохранить' : 'Создать'}
                </Button>
            </DialogFooter>
        </form>
    );
}

function DeleteDomain({ domain }: { domain: Domain }) {
    const [open, setOpen] = useState(false);
    const [processing, setProcessing] = useState(false);

    const remove = () => {
        router.delete(destroy(domain.id).url, {
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
                    <DialogTitle>Удалить домен</DialogTitle>
                    <DialogDescription>
                        Домен «{domain.name}» будет удалён без возможности
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

function EditDomain({
    domain,
    statuses,
}: {
    domain: Domain;
    statuses: Record<string, string>;
}) {
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
                    <DialogTitle>Редактировать домен</DialogTitle>
                </DialogHeader>
                <DomainForm
                    domain={domain}
                    statuses={statuses}
                    onClose={() => setOpen(false)}
                />
            </DialogContent>
        </Dialog>
    );
}

export default function DomainPage({ domains, statuses }: Props) {
    const [createOpen, setCreateOpen] = useState(false);

    return (
        <>
            <Head title="Домены" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <Heading title="Домены" description="Управление доменами" />
                    <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="size-4" />
                                Добавить домен
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Новый домен</DialogTitle>
                            </DialogHeader>
                            <DomainForm
                                statuses={statuses}
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
                                <th className="px-4 py-3 font-medium">Статус</th>
                                <th className="px-4 py-3 font-medium">
                                    По умолчанию
                                </th>
                                <th className="px-4 py-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {domains.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-4 py-10 text-center text-muted-foreground"
                                    >
                                        Доменов пока нет
                                    </td>
                                </tr>
                            )}
                            {domains.map((domain) => (
                                <tr
                                    key={domain.id}
                                    className="border-b border-sidebar-border/70 last:border-0 dark:border-sidebar-border"
                                >
                                    <td className="px-4 py-3 font-medium">
                                        {domain.name}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge
                                            variant={
                                                domain.status_id === 2
                                                    ? 'default'
                                                    : 'secondary'
                                            }
                                        >
                                            {statuses[String(domain.status_id)]}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        {domain.is_default ? (
                                            <Badge variant="outline">Да</Badge>
                                        ) : (
                                            <span className="text-muted-foreground">
                                                —
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-1">
                                            <EditDomain
                                                domain={domain}
                                                statuses={statuses}
                                            />
                                            <DeleteDomain domain={domain} />
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

DomainPage.layout = {
    breadcrumbs: [
        {
            title: 'Домены',
            href: index(),
        },
    ],
};
