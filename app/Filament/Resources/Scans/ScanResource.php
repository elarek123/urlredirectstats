<?php

namespace App\Filament\Resources\Scans;

use App\Filament\Resources\Scans\Pages\CreateScan;
use App\Filament\Resources\Scans\Pages\EditScan;
use App\Filament\Resources\Scans\Pages\ListScans;
use App\Filament\Resources\Scans\Schemas\ScanForm;
use App\Filament\Resources\Scans\Tables\ScansTable;
use App\Models\Scan;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class ScanResource extends Resource
{
    protected static ?string $model = Scan::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static bool $shouldRegisterNavigation = false;
    protected static ?string $recordTitleAttribute = 'user_ip';

    public static function form(Schema $schema): Schema
    {
        return ScanForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ScansTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

//    public static function getPages(): array
//    {
//        return [
//            'index' => ListScans::route('/'),
//            'create' => CreateScan::route('/create'),
//            'edit' => EditScan::route('/{record}/edit'),
//        ];
//    }
}
