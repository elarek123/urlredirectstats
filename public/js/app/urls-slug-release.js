(function () {
    function xsrfToken() {
        const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
        return match ? decodeURIComponent(match[1]) : '';
    }

    function releaseSlug(domainId, slug) {
        if (!domainId || !slug) return;

        const payload = JSON.stringify({ domain_id: domainId, slug: slug });

        if (navigator.sendBeacon) {
            const blob = new Blob([payload], { type: 'application/json' });
            navigator.sendBeacon('/urls/slug-release', blob);
            return;
        }

        fetch('/urls/slug-release', {
            method: 'POST',
            credentials: 'same-origin',
            keepalive: true,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-XSRF-TOKEN': xsrfToken(),
            },
            body: payload,
        }).catch(() => undefined);
    }

    window.__urlReservedSlug = window.__urlReservedSlug || null;

    function extractDetail(event) {
        // Livewire v3 передаёт именованные параметры как массив с одним объектом
        return Array.isArray(event.detail) ? event.detail[0] : event.detail;
    }

    document.addEventListener('slug-reserved', function (event) {
        const detail = extractDetail(event);
        window.__urlReservedSlug = {
            domainId: detail.domainId,
            slug: detail.slug,
        };
    });

    document.addEventListener('slug-saved', function () {
        window.__urlReservedSlug = null;
    });

    function releaseIfNeeded() {
        if (window.__urlReservedSlug) {
            releaseSlug(
                window.__urlReservedSlug.domainId,
                window.__urlReservedSlug.slug,
            );
            window.__urlReservedSlug = null;
        }
    }

    window.addEventListener('pagehide', releaseIfNeeded);
    window.addEventListener('beforeunload', releaseIfNeeded);
    // на случай SPA-навигации Livewire (wire:navigate) без полной перезагрузки
    document.addEventListener('livewire:navigating', releaseIfNeeded);
})();
