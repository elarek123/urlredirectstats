<?php

namespace App\Filament\Resources\Urls\Pages;

use App\Filament\Resources\Urls\UrlResource;
use App\Models\Domain;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditUrl extends EditRecord
{
    protected static string $resource = UrlResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }

//    protected function mutateFormDataBeforeSave(array $data): array
//    {
//        $domain = Domain::find($data['domain_id']);
//
//        $slash = $domain->name[-1] == '/' ? '' : '/';
//        $data['short_url'] = $domain
//            ? $domain->name . $slash . $data['slug']
//            : $data['slug'];
//
//        unset($data['slug']);
//
//        return $data;
//    }
}
