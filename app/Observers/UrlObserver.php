<?php

namespace App\Observers;

use App\Models\Url;
use App\Services\UrlService;

class UrlObserver
{
    public function creating(Url $url)
    {
        UrlService::compare($url);
    }

    public function updating(Url $url)
    {
        UrlService::compare($url);
    }

    public function deleted(Url $url)
    {
        $slug = last(explode('/', $url->short_url));
        $url?->domain?->slugGeneratorUrlAvailableSlugs()->create(['available_slug' => $slug]);
    }
}
