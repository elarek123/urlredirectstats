<?php

namespace App\Filament\Resources\Urls\Pages;

use App\Filament\Resources\Urls\UrlResource;
use App\Models\Domain;
use Filament\Resources\Pages\CreateRecord;

class CreateUrl extends CreateRecord
{
    protected static string $resource = UrlResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $domain = Domain::find($data['domain_id']);
        $slash = $domain->name[-1] == '/' ? '' : '/';
        $data['short_url'] = $domain
            ? $domain->name . $slash . $data['slug']
            : $data['slug'];

        unset($data['slug']);

        return $data;
    }
    protected function afterCreate(): void
    {
        $this->dispatch('slug-saved');
    }
}
