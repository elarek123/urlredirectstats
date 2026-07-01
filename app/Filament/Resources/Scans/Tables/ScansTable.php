<?php

namespace App\Filament\Resources\Scans\Tables;

use App\Filament\Resources\Urls\RelationManagers\ScansRelationManager;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Livewire\Component;

class ScansTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('url_id')
                ->hidden(function ($livewire) {
                    return $livewire instanceof ScansRelationManager;
                }),
                TextColumn::make('user_ip')
                    ->label('Ip пользователя')
                    ->searchable(),
                TextColumn::make('created_at')
                    ->label('Дата перехода')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                //
            ])
            ->recordActions([
            ])
            ->toolbarActions([
            ]);
    }
}
