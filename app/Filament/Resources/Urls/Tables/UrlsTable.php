<?php

namespace App\Filament\Resources\Urls\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class UrlsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->label('Название')
                    ->searchable(),
                TextColumn::make('user.name')
                    ->label('Пользователь')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('domain.name')
                    ->label('Домен')
                    ->numeric()
                    ->sortable(),
                IconColumn::make('is_active')
                    ->label('Активен')
                    ->boolean(),
                TextColumn::make('short_url')
                    ->label('Короткая ссылка')
                    ->searchable(),
                TextColumn::make('redirect_url')
                    ->label('Ссылка для переходов')
                    ->searchable(),
                TextColumn::make('redirect_count')
                    ->label('Количество переходов')
                    ->state(function ($record) {
                        return $record->scans()->count();
                    }),

                TextColumn::make('created_at')
                    ->label('Дата создания')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->label('Дата обновления')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
