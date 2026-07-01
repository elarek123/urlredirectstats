<?php

namespace App\Filament\Resources\Scans\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class ScanForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('url_id')
                    ->required()
                    ->numeric(),
                TextInput::make('user_ip')
                    ->required(),
            ]);
    }
}
