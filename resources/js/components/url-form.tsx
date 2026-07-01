import { useForm } from '@inertiajs/react';
import { Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DialogFooter } from '@/components/ui/dialog';
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
import { store, update } from '@/routes/urls';

export type UrlFormDomain = {
    id: number;
    name: string;
};

export type UrlFormModel = {
    id: number;
    name: string;
    domain_id: number | null;
    short_url: string;
    redirect_url: string | null;
    is_active: boolean;
};

function xsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);

    return match ? decodeURIComponent(match[1]) : '';
}
// В useForm вместо short_url используем slug


// Хелпер — вынести за пределы компонента (рядом с xsrfToken/releaseSlug)
function extractSlug(url: UrlFormModel): string {
    const idx = url.short_url.lastIndexOf('/');

    return idx === -1 ? url.short_url : url.short_url.slice(idx + 1);
}
function releaseSlug(domainId: string, slug: string): void {
    fetch('/urls/slug-release', {
        method: 'POST',
        credentials: 'same-origin',
        keepalive: true,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-XSRF-TOKEN': xsrfToken(),
        },
        body: JSON.stringify({ domain_id: domainId, slug }),
    }).catch(() => undefined);
}

export function UrlForm({
    url,
    domains,
    onClose,
}: {
    url?: UrlFormModel;
    domains: UrlFormDomain[];
    onClose: () => void;
}) {
    const [generating, setGenerating] = useState(false);
    const reserved = useRef<{ domainId: string; slug: string } | null>(null);
    const saved = useRef(false);
    const form = useForm({
        name: url?.name ?? '',
        domain_id: url?.domain_id ? String(url.domain_id) : '',
        slug: url ? extractSlug(url) : '',
        redirect_url: url?.redirect_url ?? '',
        is_active: url?.is_active ?? true,
    });

    useEffect(() => {
        return () => {
            if (reserved.current && !saved.current) {
                releaseSlug(reserved.current.domainId, reserved.current.slug);
            }
        };
    }, []);

    const generateShortUrl = async () => {
        if (!form.data.domain_id) {
            form.setError('slug', 'Сначала выберите домен');

            return;
        }

        setGenerating(true);

        try {
            const response = await fetch('/urls/slug-generate', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-XSRF-TOKEN': xsrfToken(),
                },
                body: JSON.stringify({ domain_id: form.data.domain_id }),
            });

            const payload = await response.json();

            if (!response.ok || !payload.slug) {
                form.setError('slug', 'Не удалось сгенерировать ссылку');

                return;
            }

            if (reserved.current) {
                releaseSlug(reserved.current.domainId, reserved.current.slug);
            }

            reserved.current = {
                domainId: form.data.domain_id,
                slug: payload.slug,
            };

            form.setData('slug', payload.slug);
        } finally {
            setGenerating(false);
        }
    };
    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                saved.current = true;
                onClose();
            },
        };

        form.transform((data) => {
            const domain = domains.find(
                (item) => String(item.id) === data.domain_id,
            );

            return {
                ...data,
                short_url: domain ? `${domain.name}/${data.slug}` : data.slug,
            };
        });

        if (url) {
            form.put(update(url.id).url, options);
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
                    placeholder="Моя ссылка"
                />
                <InputError message={form.errors.name} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="domain_id">Домен</Label>
                <Select
                    value={form.data.domain_id}
                    onValueChange={(value) => form.setData('domain_id', value)}
                >
                    <SelectTrigger id="domain_id">
                        <SelectValue placeholder="Выберите домен" />
                    </SelectTrigger>
                    <SelectContent>
                        {domains.map((domain) => (
                            <SelectItem key={domain.id} value={String(domain.id)}>
                                {domain.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={form.errors.domain_id} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="slug">Короткая ссылка</Label>
                <div className="flex gap-2">
                    {form.data.domain_id && (
                        <span className="flex items-center whitespace-nowrap text-sm text-muted-foreground">
                {
                    domains.find(
                        (item) => String(item.id) === form.data.domain_id,
                    )?.name
                }
                            /
            </span>
                    )}
                    <Input
                        id="slug"
                        value={form.data.slug}
                        onChange={(event) => form.setData('slug', event.target.value)}
                        placeholder="abc"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        onClick={generateShortUrl}
                        disabled={generating}
                    >
                        {generating ? <Spinner /> : <Sparkles className="size-4" />}
                        Сгенерировать
                    </Button>
                </div>
                <InputError message={form.errors.slug} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="redirect_url">Ссылка для перехода</Label>
                <Input
                    id="redirect_url"
                    value={form.data.redirect_url}
                    onChange={(event) =>
                        form.setData('redirect_url', event.target.value)
                    }
                    placeholder="https://example.com/target"
                />
                <InputError message={form.errors.redirect_url} />
            </div>

            <div className="flex items-center gap-2">
                <Checkbox
                    id="is_active"
                    checked={form.data.is_active}
                    onCheckedChange={(checked) =>
                        form.setData('is_active', checked === true)
                    }
                />
                <Label htmlFor="is_active">Активна</Label>
            </div>

            <DialogFooter>
                <Button type="submit" disabled={form.processing}>
                    {form.processing && <Spinner />}
                    {url ? 'Сохранить' : 'Создать'}
                </Button>
            </DialogFooter>
        </form>
    );
}
