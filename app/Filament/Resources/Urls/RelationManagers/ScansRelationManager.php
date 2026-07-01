<?php

namespace App\Filament\Resources\Urls\RelationManagers;

use App\Filament\Resources\Scans\ScanResource;
use Filament\Actions\CreateAction;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables\Table;

class ScansRelationManager extends RelationManager
{
    protected static string $relationship = 'scans';

    protected static ?string $relatedResource = ScanResource::class;

    public function table(Table $table): Table
    {
        return $table;
    }
}
