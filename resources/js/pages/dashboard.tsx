import { Head } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { dashboard } from '@/routes';
import { Link2, Globe, CheckCircle2 } from 'lucide-react';

type DashboardStats = {
    linksCount: number;
    allRedirectCount: number;
    activeLinksCount: number;
};
export default function Dashboard({ stats }: { stats: DashboardStats }) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                        <div className="flex h-full flex-col justify-between">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Всего ссылок</span>
                                <Link2 className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <span className="text-3xl font-semibold">{stats.linksCount}</span>
                        </div>
                    </div>

                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                        <div className="flex h-full flex-col justify-between">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Активных ссылок</span>
                                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <span className="text-3xl font-semibold">{stats.activeLinksCount}</span>
                        </div>
                    </div>

                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                        <div className="flex h-full flex-col justify-between">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Переходы</span>
                                <Globe className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <span className="text-3xl font-semibold">{stats.allRedirectCount}</span>
                        </div>
                    </div>
                </div>

                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
