<?php

namespace App\Filament\Resources\Domains\Schemas;

use App\Enums\StatusEnum;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class DomainForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->label('Домен')
                    ->required(),
                Select::make('status_id')
                    ->label('Статус')
                    ->options(StatusEnum::toSelectList())
                    ->default(1),
                Toggle::make('is_default')
                    ->label('По умолчанию')
                    ->default(false),
            ]);
    }
}
