<?php

namespace App\Filament\Resources\Urls;

use App\Filament\Resources\Urls\Pages\CreateUrl;
use App\Filament\Resources\Urls\Pages\EditUrl;
use App\Filament\Resources\Urls\Pages\ListUrls;
use App\Filament\Resources\Urls\RelationManagers\ScansRelationManager;
use App\Filament\Resources\Urls\Schemas\UrlForm;
use App\Filament\Resources\Urls\Tables\UrlsTable;
use App\Models\Url;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class UrlResource extends Resource
{
    protected static ?string $model = Url::class;
    protected static ?string $navigationLabel = "Ссылки";
    protected static ?string $pluralLabel = "Ссылки";
    protected static ?string $modelLabel = "Ccылку";
    protected static ?string $pluralModelLabel = "Ccылка";

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return UrlForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return UrlsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            ScansRelationManager::class
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListUrls::route('/'),
            'create' => CreateUrl::route('/create'),
            'edit' => EditUrl::route('/{record}/edit'),
        ];
    }
}
